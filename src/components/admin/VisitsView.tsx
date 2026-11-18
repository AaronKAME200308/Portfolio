import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import supabase from "../../services/supabase";
import { dateTimeFr, downloadCsv, inputCls, keyWhite, useList, type SortDef } from "../../lib/adminData";
import type { StatVisit } from "../../lib/stats";
import { Chips, Empty, PageTitle, Pager, Toolbar } from "./ui";

type Kind = "human" | "bot" | "owner";
const KINDS: { value: Kind; label: string }[] = [
  { value: "human", label: "Humains" }, { value: "bot", label: "Robots" }, { value: "owner", label: "Moi" },
];
const kindOf = (v: StatVisit): Kind => (v.kind === "bot" || v.kind === "owner" ? v.kind : "human");

const SORTS: SortDef<StatVisit>[] = [
  { id: "recent", label: "Plus récentes", cmp: (a, b) => b.created_at.localeCompare(a.created_at) },
  { id: "old", label: "Plus anciennes", cmp: (a, b) => a.created_at.localeCompare(b.created_at) },
];

export function VisitsList({ visits, ready, onChanged }: { visits: StatVisit[]; ready: boolean; onChanged: () => Promise<void> }) {
  const [filter, setFilter] = useState<Kind | "all">("human");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const shown = visits.filter((v) => filter === "all" || kindOf(v) === filter);
  const L = useList(shown, (v) => `${v.visitor_id} ${v.page ?? ""} ${v.referrer ?? ""} ${v.lang ?? ""} ${v.device ?? ""}`, SORTS);

  const run = async (p: PromiseLike<{ error: unknown }>) => {
    setBusy(true); setErr("");
    const { error } = await p;
    if (error) setErr("Action impossible (la migration admin_v4.sql est-elle exécutée ?).");
    await onChanged();
    setBusy(false);
  };
  const setKind = (v: StatVisit, k: Kind) => run(supabase.from("site_visits").update({ kind: k }).eq("id", v.id!));
  const del = (v: StatVisit) => run(supabase.from("site_visits").delete().eq("id", v.id!));
  const delAll = (k: "bot" | "owner") => {
    if (confirm(`Supprimer définitivement toutes les visites « ${KINDS.find((x) => x.value === k)?.label} » (${visits.filter((v) => kindOf(v) === k).length}) ?`))
      void run(supabase.from("site_visits").delete().eq("kind", k));
  };

  if (!ready) return <Empty>Table des visites indisponible : exécute supabase/admin_v3.sql puis admin_v4.sql.</Empty>;

  return (
    <div className="space-y-4">
      <PageTitle title="Visites" sub="Visites anonymes du portfolio (ni IP ni cookie). Tu peux reclasser ou supprimer une visite." />
      <Toolbar q={L.q} onQ={L.setQ} sort={L.sort} onSort={L.setSort} sorts={SORTS} placeholder="Page, provenance, identifiant…"
        onExport={() => downloadCsv("visites.csv", ["Date", "Type", "Page", "Langue", "Appareil", "Provenance", "Visiteur"],
          L.all.map((v) => [v.created_at, kindOf(v), v.page, v.lang, v.device, v.referrer, v.visitor_id]))} />
      <Chips value={filter} onChange={(v) => { setFilter(v); L.setPage(0); }}
        options={[{ value: "all", label: "Toutes", count: visits.length },
          ...KINDS.map((k) => ({ value: k.value as Kind | "all", label: k.label, count: visits.filter((v) => kindOf(v) === k.value).length }))]} />
      {(filter === "bot" || filter === "owner") && shown.length > 0 && (
        <button type="button" onClick={() => delAll(filter)} disabled={busy} className={`keycap px-4 py-2.5 text-xs font-semibold ${keyWhite}`}>
          <Trash2 size={14} /> Tout supprimer dans « {KINDS.find((k) => k.value === filter)?.label} »
        </button>
      )}
      {err && <p className="text-sm text-red-600" role="alert">{err}</p>}

      {L.rows.length === 0 ? <Empty>Aucune visite.</Empty> : (
        <ul className="space-y-2">
          {L.rows.map((v, idx) => (
            <li key={v.id ?? idx} className="rounded-2xl bg-white border-2 border-ink/10 p-3.5 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="min-w-0 flex-1 basis-48">
                <span className="block text-sm font-semibold text-forest truncate">{v.page || "/"}</span>
                <span className="block font-mono-label !text-[10px] text-ink-mute">
                  {dateTimeFr(v.created_at)} · {v.device ?? "?"} · {(v.lang ?? "?").toUpperCase()} · {v.visitor_id.slice(0, 8)}
                </span>
                {v.referrer && <span className="block text-xs text-ink-soft truncate">depuis {v.referrer}</span>}
              </span>
              <span className="flex items-center gap-2">
                <select className={`${inputCls} !py-1.5 !text-sm !w-auto`} value={kindOf(v)} disabled={busy || v.id === undefined}
                  onChange={(e) => setKind(v, e.target.value as Kind)} aria-label="Type de visite">
                  {KINDS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
                </select>
                <button type="button" onClick={() => del(v)} disabled={busy || v.id === undefined} aria-label="Supprimer la visite"
                  className="p-2 rounded-lg text-ink-mute hover:text-red-600 disabled:opacity-30">
                  {busy ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
      <Pager page={L.page} pages={L.pages} total={L.all.length} onPage={L.setPage} />
    </div>
  );
}