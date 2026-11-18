import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Check, ChevronRight, Copy, FileText, Loader2, Plus, Save, Trash2 } from "lucide-react";
import supabase from "../../services/supabase";
import { BUDGETS, DEADLINES, PROJECT_TYPES, STATUSES, budgetLabel, labelOf } from "../../lib/orderConfig";
import {
  dateFr, downloadCsv, inputCls, keyGreen, keyWhite, linkOf, reviewOf, useList, type Order, type SortDef,
} from "../../lib/adminData";
import { fcfa, invoiceTotal, isContact } from "../../lib/stats";
import InvoiceEditor, { type Invoice } from "./InvoiceEditor";
import ReviewEditor from "./ReviewEditor";
import { BackLink, Chips, Empty, Field, PageTitle, Pager, Panel, Toolbar } from "./ui";

export type Kind = "lien" | "contact";
const base = (k: Kind) => (k === "contact" ? "/admin/contacts" : "/admin/commandes");
const nameOf = (o: Order) => o.client_name || "Client sans nom";
const stOf = (v: string) => STATUSES.find((s) => s.value === v);

const SORTS: SortDef<Order>[] = [
  { id: "recent", label: "Plus récents", cmp: (a, b) => b.submitted_at.localeCompare(a.submitted_at) },
  { id: "old", label: "Plus anciens", cmp: (a, b) => a.submitted_at.localeCompare(b.submitted_at) },
  { id: "name", label: "Nom A → Z", cmp: (a, b) => nameOf(a).localeCompare(nameOf(b), "fr") },
  { id: "status", label: "Statut", cmp: (a, b) => STATUSES.findIndex((s) => s.value === a.status) - STATUSES.findIndex((s) => s.value === b.status) },
];

/* ───────────── Liste ───────────── */
export function OrdersList({ orders, kind, onChanged }: { orders: Order[]; kind: Kind; onChanged: () => Promise<void> }) {
  const nav = useNavigate();
  const mine = orders.filter((o) => isContact(o) === (kind === "contact"));
  const [filter, setFilter] = useState("all");
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const byStatus = mine.filter((o) => filter === "all" || o.status === filter);
  const L = useList(byStatus,
    (o) => [o.client_name, o.client_email, o.client_company, o.reference, o.project_title, o.client_phone].join(" "), SORTS);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr("");
    const row = kind === "contact"
      ? { source: "contact", form_completed: true, project_title: "Contact : ajout manuel" }
      : {};
    const { data, error } = await supabase.from("client_orders")
      .insert({ ...row, client_name: name.trim() || null, client_email: email.trim() || null, reference: "" })
      .select("id, token").single();
    setBusy(false);
    if (error || !data) return setErr("Création impossible.");
    if (kind === "lien") { try { await navigator.clipboard.writeText(linkOf(data.token)); } catch { /* ignore */ } }
    await onChanged();
    nav(`${base(kind)}/${data.id}`);
  };

  const exportCsv = () => downloadCsv(`${kind === "contact" ? "contacts" : "commandes"}.csv`,
    ["Référence", "Date", "Nom", "Email", "Téléphone", "Entreprise", "Type", "Titre", "Budget", "Délai", "Statut"],
    L.all.map((o) => [o.reference, dateFr(o.submitted_at), o.client_name, o.client_email, o.client_phone, o.client_company,
      labelOf(PROJECT_TYPES, o.project_type), o.project_title, o.budget_range ? budgetLabel(o.budget_range, o.budget_currency) : "",
      labelOf(DEADLINES, o.deadline), stOf(o.status)?.label]));

  return (
    <div className="space-y-4">
      <PageTitle title={kind === "contact" ? "Contacts" : "Commandes"}
        sub={kind === "contact" ? "Messages envoyés depuis le formulaire du site ou le chat" : "Projets suivis via un lien client"}
        action={
          <button type="button" onClick={() => setAdding((v) => !v)} className={`keycap px-4 py-2.5 text-xs font-semibold ${keyGreen}`}>
            <Plus size={15} /> {kind === "contact" ? "Nouveau contact" : "Nouveau lien client"}
          </button>
        } />

      {adding && (
        <form onSubmit={create} className="rounded-2xl bg-white/70 border-2 border-ink/10 p-4 grid sm:grid-cols-[1fr_1fr_auto] gap-3">
          <input className={inputCls} placeholder="Nom (facultatif)" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" className={inputCls} placeholder="Email (facultatif)" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button type="submit" disabled={busy} className={`keycap px-6 py-2.5 text-sm font-semibold disabled:opacity-70 ${keyGreen}`}>
            {busy ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Créer
          </button>
          {err && <p className="sm:col-span-3 text-sm text-red-600" role="alert">{err}</p>}
          {kind === "lien" && <p className="sm:col-span-3 text-xs text-ink-mute">Le lien client est copié automatiquement.</p>}
        </form>
      )}

      <Toolbar q={L.q} onQ={L.setQ} sort={L.sort} onSort={L.setSort} sorts={SORTS} onExport={exportCsv}
        placeholder="Nom, email, référence, projet…" />
      <Chips value={filter} onChange={(v) => { setFilter(v); L.setPage(0); }}
        options={[{ value: "all", label: "Tous", count: mine.length },
          ...STATUSES.map((s) => ({ value: s.value as string, label: s.label, count: mine.filter((o) => o.status === s.value).length }))]} />

      {L.rows.length === 0 ? <Empty>Aucun résultat.</Empty> : (
        <ul className="space-y-2.5">
          {L.rows.map((o) => {
            const st = stOf(o.status);
            return (
              <li key={o.id}>
                <Link to={`${base(kind)}/${o.id}`}
                  className="flex items-center gap-3 rounded-2xl bg-white border-2 border-ink/10 p-3.5 sm:p-4 transition hover:border-aun">
                  <span className="h-3 w-3 rounded-full shrink-0" style={{ background: st?.dot }} aria-hidden />
                  <span className="min-w-0 flex-1">
                    <span className="block font-display font-bold text-forest truncate">{nameOf(o)}</span>
                    <span className="block text-sm text-ink-soft truncate">{o.project_title?.replace(/^Contact : /, "") || "Sans titre"}</span>
                    <span className="block font-mono-label !text-[10px] text-ink-mute mt-0.5">
                      {o.reference} · {dateFr(o.submitted_at)} · {st?.label}
                    </span>
                  </span>
                  <span className={`hidden sm:inline font-mono-label !text-[10px] rounded-md px-2 py-1 ${o.form_completed ? "bg-aun/15 text-aun" : "bg-ink/5 text-ink-mute"}`}>
                    {o.form_completed ? "Reçu" : "En attente"}
                  </span>
                  <ChevronRight size={18} className="text-ink-mute shrink-0" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      <Pager page={L.page} pages={L.pages} total={L.all.length} onPage={L.setPage} />
    </div>
  );
}

/* ───────────── Détail ───────────── */
type Form = Record<"client_name" | "client_email" | "client_phone" | "client_company" | "project_type" | "project_title" |
  "description" | "features" | "preferred_techs" | "visual_references" | "budget_range" | "budget_currency" | "deadline" |
  "additional_notes" | "admin_notes", string>;
const FIELDS = ["client_name", "client_email", "client_phone", "client_company", "project_type", "project_title", "description",
  "features", "preferred_techs", "visual_references", "budget_range", "budget_currency", "deadline", "additional_notes", "admin_notes"] as const;
const toForm = (o: Order): Form => Object.fromEntries(FIELDS.map((k) => [k, (o[k] as string | null) ?? ""])) as Form;

export function OrderDetail({ orders, invoices, kind, onChanged }: {
  orders: Order[]; invoices: Invoice[]; kind: Kind; onChanged: () => Promise<void>;
}) {
  const { id } = useParams();
  const o = orders.find((x) => x.id === id);
  if (!o) return <div className="space-y-4"><BackLink to={base(kind)} label="Retour" /><Empty>Élément introuvable (supprimé ?).</Empty></div>;
  return <Editor key={o.id} o={o} invoices={invoices.filter((i) => i.order_id === o.id)} kind={kind} onChanged={onChanged} />;
}

function Editor({ o, invoices, kind, onChanged }: { o: Order; invoices: Invoice[]; kind: Kind; onChanged: () => Promise<void> }) {
  const nav = useNavigate();
  const [f, setF] = useState<Form>(() => toForm(o));
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const [inv, setInv] = useState<{ edit: Invoice | null } | null>(null);
  const [addReview, setAddReview] = useState(false);

  const orig = toForm(o);
  const dirty = FIELDS.some((k) => f[k] !== orig[k]);
  const set = (k: keyof Form, v: string) => { setF((x) => ({ ...x, [k]: v })); setSaved(false); };
  const rv = reviewOf(o);
  const cur = f.budget_currency === "USD" ? "USD" : "XAF";

  const save = async () => {
    if (f.client_email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.client_email.trim())) return setErr("Adresse e-mail invalide.");
    setBusy(true); setErr("");
    const row: Record<string, string | null> = {};
    for (const k of FIELDS) row[k] = f[k].trim() === "" ? null : f[k].trim();
    row.budget_currency = cur;
    const { error } = await supabase.from("client_orders").update(row).eq("id", o.id);
    setBusy(false);
    if (error) return setErr("Enregistrement impossible.");
    await onChanged();
    setSaved(true);
  };

  const patch = async (values: Record<string, unknown>) => {
    await supabase.from("client_orders").update(values).eq("id", o.id);
    await onChanged();
  };
  const copy = async () => {
    try { await navigator.clipboard.writeText(linkOf(o.token)); } catch { /* ignore */ }
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };
  const remove = async () => {
    if (!confirm(`Supprimer ${o.reference} et ses factures / avis ?`)) return;
    const { error } = await supabase.from("client_orders").delete().eq("id", o.id);
    if (error) return setErr("Suppression impossible.");
    await onChanged();
    nav(base(kind));
  };

  const txt = (k: keyof Form, props: React.InputHTMLAttributes<HTMLInputElement> = {}) =>
    <input className={inputCls} value={f[k]} onChange={(e) => set(k, e.target.value)} {...props} />;
  const area = (k: keyof Form, rows = 3) =>
    <textarea rows={rows} className={inputCls} value={f[k]} onChange={(e) => set(k, e.target.value)} />;

  return (
    <div className="space-y-4 pb-24 sm:pb-0">
      <BackLink to={base(kind)} label={kind === "contact" ? "Tous les contacts" : "Toutes les commandes"} />
      <PageTitle title={nameOf(o)} sub={`${o.reference} · ${dateFr(o.submitted_at)}${o.form_completed ? "" : " · formulaire non rempli"}`} />

      <Panel title="Statut">
        <div className="-mx-1 px-1 flex gap-2 overflow-x-auto sm:flex-wrap pb-1 [scrollbar-width:none]">
          {STATUSES.map((s) => (
            <button key={s.value} type="button" onClick={() => patch({ status: s.value })} aria-pressed={o.status === s.value}
              className={`font-mono-label !text-[11px] whitespace-nowrap shrink-0 rounded-full px-3 py-1.5 border-2 transition ${
                o.status === s.value ? "bg-forest text-cream border-forest" : "border-ink/15 text-ink-soft hover:border-aun"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </Panel>

      <Panel title="Client">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Nom">{txt("client_name", { autoComplete: "off" })}</Field>
          <Field label="Entreprise">{txt("client_company")}</Field>
          <Field label="Email">{txt("client_email", { type: "email", inputMode: "email" })}</Field>
          <Field label="Téléphone">{txt("client_phone", { type: "tel", inputMode: "tel" })}</Field>
        </div>
      </Panel>

      <Panel title="Projet">
        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Type">
            <select className={inputCls} value={f.project_type} onChange={(e) => set("project_type", e.target.value)}>
              <option value="">—</option>
              {PROJECT_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>
          <Field label="Titre">{txt("project_title")}</Field>
          <Field label="Devise du budget">
            <select className={inputCls} value={cur} onChange={(e) => set("budget_currency", e.target.value)}>
              <option value="XAF">FCFA</option><option value="USD">USD</option>
            </select>
          </Field>
          <Field label="Budget">
            <select className={inputCls} value={f.budget_range} onChange={(e) => set("budget_range", e.target.value)}>
              <option value="">—</option>
              {BUDGETS[cur].map((b) => <option key={b.value} value={b.value}>{b.label}</option>)}
            </select>
          </Field>
          <Field label="Délai">
            <select className={inputCls} value={f.deadline} onChange={(e) => set("deadline", e.target.value)}>
              <option value="">—</option>
              {DEADLINES.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </Field>
          <Field label="Technos souhaitées">{txt("preferred_techs")}</Field>
          <Field label="Description" wide>{area("description", 4)}</Field>
          <Field label="Fonctionnalités" wide>{area("features")}</Field>
          <Field label="Références visuelles" wide>{area("visual_references", 2)}</Field>
          <Field label="Notes du client" wide>{area("additional_notes", 2)}</Field>
        </div>
      </Panel>

      <Panel title="Notes privées">{area("admin_notes", 3)}</Panel>

      {/* barre d'enregistrement : collée en bas sur mobile */}
      <div className={`fixed bottom-0 inset-x-0 z-30 sm:static sm:z-auto p-3 sm:p-0 bg-cream/95 sm:bg-transparent backdrop-blur border-t-2 border-ink/10 sm:border-0 ${dirty || err ? "" : "hidden sm:block"}`}>
        <div className="max-w-5xl mx-auto flex flex-wrap items-center gap-3">
          <button type="button" onClick={save} disabled={busy || !dirty} className={`keycap px-6 py-3 text-sm font-semibold disabled:opacity-60 ${keyGreen}`}>
            {busy ? <Loader2 size={15} className="animate-spin" /> : saved && !dirty ? <Check size={15} /> : <Save size={15} />}
            {saved && !dirty ? "Enregistré" : "Enregistrer"}
          </button>
          {dirty && <button type="button" onClick={() => { setF(orig); setErr(""); }} className={`keycap px-4 py-3 text-sm font-semibold ${keyWhite}`}>Annuler</button>}
          {err && <p className="text-sm text-red-600 basis-full sm:basis-auto" role="alert">{err}</p>}
        </div>
      </div>

      <Panel title="Avis du client">
        {rv && !addReview ? (
          <ReviewEditor orderId={o.id} review={rv} onSaved={onChanged} />
        ) : addReview ? (
          <ReviewEditor orderId={o.id} review={null} onSaved={() => { setAddReview(false); void onChanged(); }} />
        ) : (
          <button type="button" onClick={() => setAddReview(true)} className={`keycap px-4 py-2.5 text-xs font-semibold ${keyWhite}`}>
            <Plus size={14} /> Ajouter un avis
          </button>
        )}
      </Panel>

      <Panel title="Facturation">
        <div className="space-y-3">
          {invoices.map((i) => (
            <div key={i.id} className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm">
              <span className="font-semibold text-forest">{i.number}</span>
              <span className="text-ink-soft">{fcfa(invoiceTotal(i))}</span>
              <span className={`font-mono-label !text-[10px] rounded-md px-2 py-1 ${i.paid ? "bg-aun/15 text-aun" : "bg-amber-100 text-amber-700"}`}>
                {i.paid ? "Payée" : "À payer"}
              </span>
              <button type="button" onClick={() => setInv({ edit: i })} className={`keycap ml-auto px-4 py-2 text-xs font-semibold ${keyWhite}`}>Ouvrir / PDF</button>
            </div>
          ))}
          {o.status === "livre" || invoices.length > 0 ? (
            <button type="button" onClick={() => setInv({ edit: null })} className={`keycap px-5 py-2.5 text-sm font-semibold ${keyGreen}`}>
              <FileText size={15} /> {invoices.length ? "Nouvelle facture" : "Générer la facture"}
            </button>
          ) : <p className="text-xs text-ink-mute">La facture se génère quand le statut passe à « Livré ».</p>}
        </div>
      </Panel>
      {inv && <InvoiceEditor order={o} invoice={inv.edit} onClose={() => setInv(null)} onSaved={() => void onChanged()} />}

      <div className="flex flex-wrap gap-3">
        {kind === "lien" && (
          <button type="button" onClick={copy} className={`keycap px-5 py-2.5 text-sm font-semibold ${keyGreen}`}>
            {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Lien copié" : "Copier le lien client"}
          </button>
        )}
        <button type="button" onClick={remove} className={`keycap px-5 py-2.5 text-sm font-semibold ${keyWhite}`}>
          <Trash2 size={15} /> Supprimer
        </button>
      </div>
    </div>
  );
}