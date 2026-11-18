import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Plus, Star } from "lucide-react";
import supabase from "../../services/supabase";
import { dateFr, downloadCsv, inputCls, keyGreen, keyWhite, reviewOf, useList, type Order, type Review, type SortDef } from "../../lib/adminData";
import ReviewEditor from "./ReviewEditor";
import { BackLink, Chips, Empty, PageTitle, Pager, Panel, Toolbar } from "./ui";

type Row = { o: Order; r: Review };
const Stars = ({ n }: { n: number }) => (
  <span className="inline-flex gap-0.5" aria-label={`${n} sur 5`}>
    {[1, 2, 3, 4, 5].map((k) => <Star key={k} size={14} fill={k <= n ? "#f59e0b" : "none"} stroke={k <= n ? "#f59e0b" : "#b9c8bd"} />)}
  </span>
);

const SORTS: SortDef<Row>[] = [
  { id: "recent", label: "Plus récents", cmp: (a, b) => (b.r.submitted_at ?? "").localeCompare(a.r.submitted_at ?? "") },
  { id: "best", label: "Meilleures notes", cmp: (a, b) => b.r.rating - a.r.rating },
  { id: "worst", label: "Notes basses", cmp: (a, b) => a.r.rating - b.r.rating },
];

export function ReviewsList({ orders, onChanged }: { orders: Order[]; onChanged: () => Promise<void> }) {
  const rows: Row[] = orders.flatMap((o) => { const r = reviewOf(o); return r ? [{ o, r }] : []; });
  const [filter, setFilter] = useState<"all" | "pending" | "ok">("all");
  const [adding, setAdding] = useState(false);
  const [pick, setPick] = useState("");
  const shown = rows.filter((x) => filter === "all" || (filter === "ok") === x.r.approved);
  const L = useList(shown, (x) => `${x.o.client_name ?? ""} ${x.o.reference} ${x.r.comment}`, SORTS);
  const free = orders.filter((o) => !reviewOf(o));

  const toggle = async (x: Row) => {
    await supabase.from("client_reviews").update({ approved: !x.r.approved, approved_at: x.r.approved ? null : new Date().toISOString() }).eq("id", x.r.id);
    await onChanged();
  };

  return (
    <div className="space-y-4">
      <PageTitle title="Avis" sub="Ce que tes clients disent de toi, publié sur le site après ta validation"
        action={<button type="button" onClick={() => setAdding((v) => !v)} className={`keycap px-4 py-2.5 text-xs font-semibold ${keyGreen}`}><Plus size={15} /> Ajouter un avis</button>} />

      {adding && (
        <Panel title="Nouvel avis">
          <select className={`${inputCls} mb-4`} value={pick} onChange={(e) => setPick(e.target.value)} aria-label="Commande concernée">
            <option value="">Choisir la commande concernée…</option>
            {free.map((o) => <option key={o.id} value={o.id}>{o.reference} · {o.client_name || "Client sans nom"}</option>)}
          </select>
          {pick && <ReviewEditor key={pick} orderId={pick} review={null} onSaved={() => { setAdding(false); setPick(""); void onChanged(); }} />}
        </Panel>
      )}

      <Toolbar q={L.q} onQ={L.setQ} sort={L.sort} onSort={L.setSort} sorts={SORTS} placeholder="Client, commentaire…"
        onExport={() => downloadCsv("avis.csv", ["Date", "Client", "Commande", "Note", "Publié", "Commentaire"],
          L.all.map((x) => [dateFr(x.r.submitted_at), x.o.client_name, x.o.reference, x.r.rating, x.r.approved ? "oui" : "non", x.r.comment]))} />
      <Chips value={filter} onChange={(v) => { setFilter(v); L.setPage(0); }}
        options={[{ value: "all", label: "Tous", count: rows.length },
          { value: "pending", label: "À valider", count: rows.filter((x) => !x.r.approved).length },
          { value: "ok", label: "Publiés", count: rows.filter((x) => x.r.approved).length }]} />

      {L.rows.length === 0 ? <Empty>Aucun avis.</Empty> : (
        <ul className="space-y-2.5">
          {L.rows.map((x) => (
            <li key={x.r.id} className="rounded-2xl bg-white border-2 border-ink/10 p-3.5 sm:p-4">
              <Link to={`/admin/avis/${x.r.id}`} className="flex items-start gap-3">
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <Stars n={x.r.rating} />
                    <span className="font-display font-bold text-forest truncate">{x.o.client_name || "Client"}</span>
                  </span>
                  <span className="block text-sm text-ink-soft mt-1.5 line-clamp-2">{x.r.comment}</span>
                  <span className="block font-mono-label !text-[10px] text-ink-mute mt-1.5">{x.o.reference} · {dateFr(x.r.submitted_at)}</span>
                </span>
                <ChevronRight size={18} className="text-ink-mute shrink-0 mt-1" />
              </Link>
              <div className="mt-3 pt-3 border-t border-dashed border-ink/15 flex items-center gap-3">
                <button type="button" onClick={() => toggle(x)} className={`keycap px-4 py-2 text-xs font-semibold ${x.r.approved ? keyWhite : keyGreen}`}>
                  {x.r.approved ? "Retirer du site" : "Publier sur le site"}
                </button>
                <span className="font-mono-label !text-[10px] text-ink-mute">{x.r.approved ? "Publié" : "En attente"}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      <Pager page={L.page} pages={L.pages} total={L.all.length} onPage={L.setPage} />
    </div>
  );
}

export function ReviewPage({ orders, onChanged }: { orders: Order[]; onChanged: () => Promise<void> }) {
  const { id } = useParams();
  const nav = useNavigate();
  const o = orders.find((x) => reviewOf(x)?.id === id);
  const r = o && reviewOf(o);
  if (!o || !r) return <div className="space-y-4"><BackLink to="/admin/avis" label="Tous les avis" /><Empty>Avis introuvable (supprimé ?).</Empty></div>;
  return (
    <div className="space-y-4">
      <BackLink to="/admin/avis" label="Tous les avis" />
      <PageTitle title={`Avis de ${o.client_name || "client"}`} sub={`${o.reference} · ${dateFr(r.submitted_at)}`} />
      <Panel>
        <ReviewEditor key={r.id} orderId={o.id} review={r} onSaved={() => void onChanged()} onDeleted={() => nav("/admin/avis")} />
      </Panel>
      <Link to={`${(o.source === "contact" || (o.project_title ?? "").startsWith("Contact :")) ? "/admin/contacts" : "/admin/commandes"}/${o.id}`}
        className="inline-block text-sm font-semibold text-aun hover:underline">Ouvrir la commande →</Link>
    </div>
  );
}