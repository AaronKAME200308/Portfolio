import { useCallback, useEffect, useState } from "react";
import { Check, Copy, FileText, Loader2, LogOut, Plus, RefreshCw, Star, Trash2 } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import supabase from "../services/supabase";
import {
  DEADLINES, PROJECT_TYPES, STATUSES, labelOf, budgetLabel,
} from "../lib/orderConfig";
import StatsPanel from "../components/admin/StatsPanel";
import InvoiceEditor, { type Invoice } from "../components/admin/InvoiceEditor";
import { fcfa, invoiceTotal, isContact, type StatVisit } from "../lib/stats";

const LOGO_SRC = "/Aun/aun-symbole-vert.svg";

type Review = { id: string; rating: number; comment: string; approved: boolean } | null;
type Order = {
  id: string; token: string; reference: string; status: string; form_completed: boolean;
  client_name: string | null; client_email: string | null; client_phone: string | null;
  client_company: string | null; project_type: string | null; project_title: string | null;
  description: string | null; features: string | null; preferred_techs: string | null;
  visual_references: string | null; budget_range: string | null; budget_currency: string;
  deadline: string | null; additional_notes: string | null; admin_notes: string | null;
  submitted_at: string; source?: string | null;
  client_reviews: Review[] | Review;
};

const inputCls =
  "w-full rounded-xl border-2 border-ink/10 bg-white px-4 py-3 text-[15px] text-ink outline-none transition focus:border-aun focus:ring-4 focus:ring-aun/15";
const keyGreen = "[--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#fff]";
const keyWhite = "[--key-face:#ffffff] [--key-edge:#b9c8bd] [--key-text:#0e2f20]";

const reviewOf = (o: Order): Review => (Array.isArray(o.client_reviews) ? o.client_reviews[0] ?? null : o.client_reviews);
const linkOf = (token: string) => `${window.location.origin}/order/${token}`;

/* ── Connexion ── */
function Login() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const go = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password: pwd });
    setBusy(false);
    if (error) setErr("Identifiants incorrects.");
  };

  return (
    <div className="min-h-screen bg-forest grid place-items-center px-6 font-body">
      <form onSubmit={go} className="w-full max-w-sm rounded-3xl bg-cream p-8 shadow-2xl">
        <img src={LOGO_SRC} alt="" className="h-10 w-10 object-contain mb-4" />
        <p className="font-mono-label text-aun mb-1">Accès privé</p>
        <h1 className="font-display font-extrabold text-2xl text-forest mb-6">Tableau de bord</h1>
        <input type="email" required placeholder="Email" autoComplete="username" className={`${inputCls} mb-3`}
          value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" required placeholder="Mot de passe" autoComplete="current-password" className={inputCls}
          value={pwd} onChange={(e) => setPwd(e.target.value)} />
        {err && <p className="text-xs text-red-600 mt-2" role="alert">{err}</p>}
        <button type="submit" disabled={busy} className={`keycap w-full mt-6 py-3.5 text-sm font-semibold disabled:opacity-70 ${keyGreen}`}>
          {busy && <Loader2 size={16} className="animate-spin" />} Entrer
        </button>
      </form>
    </div>
  );
}

/* ── Détail d'une commande ── */
function Detail({ o, invoices, onChange, onDelete }: { o: Order; invoices: Invoice[]; onChange: () => void; onDelete: () => void }) {
  const [notes, setNotes] = useState(o.admin_notes ?? "");
  const [copied, setCopied] = useState(false);
  const rv = reviewOf(o);
  const [inv, setInv] = useState<{ edit: Invoice | null } | null>(null);

  const patch = async (values: Record<string, unknown>) => {
    await supabase.from("client_orders").update(values).eq("id", o.id);
    onChange();
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(linkOf(o.token)); } catch { /* ignore */ }
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };

  const rows: [string, string | null][] = [
    ["Email", o.client_email], ["Téléphone", o.client_phone], ["Entreprise", o.client_company],
    ["Type", o.project_type ? labelOf(PROJECT_TYPES, o.project_type) : null], ["Titre", o.project_title],
    ["Budget", o.budget_range ? budgetLabel(o.budget_range, o.budget_currency) : null],
    ["Délai", o.deadline ? labelOf(DEADLINES, o.deadline) : null],
    ["Description", o.description], ["Fonctionnalités", o.features], ["Technos", o.preferred_techs],
    ["Références", o.visual_references], ["Notes client", o.additional_notes],
  ];

  return (
    <div className="mt-4 border-t-2 border-dashed border-ink/15 pt-5 space-y-5">
      <div className="flex flex-wrap gap-2">
        {STATUSES.map((s) => (
          <button key={s.value} onClick={() => patch({ status: s.value })} aria-pressed={o.status === s.value}
            className={`font-mono-label !text-[11px] rounded-full px-3 py-1.5 border-2 transition ${
              o.status === s.value ? "bg-forest text-cream border-forest" : "border-ink/15 text-ink-soft hover:border-aun"}`}>
            {s.label}
          </button>
        ))}
      </div>

      {o.form_completed ? (
        <dl className="divide-y divide-ink/10 text-sm">
          {rows.filter(([, v]) => v).map(([k, v]) => (
            <div key={k} className="grid grid-cols-[110px_1fr] gap-3 py-2">
              <dt className="font-mono-label text-ink-mute !text-[11px] pt-0.5">{k}</dt>
              <dd className="font-semibold text-forest whitespace-pre-line break-words min-w-0">{v}</dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="text-sm text-ink-mute">Le client n'a pas encore rempli le formulaire.</p>
      )}

      {rv && (
        <div className="rounded-2xl bg-sage/60 p-4">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="flex gap-0.5" aria-label={`${rv.rating} sur 5`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={16} fill={n <= rv.rating ? "#f59e0b" : "none"} stroke={n <= rv.rating ? "#f59e0b" : "#b9c8bd"} />
              ))}
            </span>
            <button onClick={async () => {
              await supabase.from("client_reviews")
                .update({ approved: !rv.approved, approved_at: rv.approved ? null : new Date().toISOString() })
                .eq("id", rv.id);
              onChange();
            }} className={`keycap px-4 py-2 text-xs font-semibold ${rv.approved ? keyWhite : keyGreen}`}>
              {rv.approved ? "Retirer du site" : "Publier sur le site"}
            </button>
          </div>
          <p className="text-sm text-ink-soft whitespace-pre-line">{rv.comment}</p>
          <p className="font-mono-label !text-[10px] mt-2 text-ink-mute">{rv.approved ? "Publié" : "En attente de validation"}</p>
        </div>
      )}

      <div>
        <label className="font-mono-label text-ink-soft block mb-2">Notes privées</label>
        <textarea rows={3} className={inputCls} value={notes} onChange={(e) => setNotes(e.target.value)}
          onBlur={() => notes !== (o.admin_notes ?? "") && patch({ admin_notes: notes })} />
      </div>

      {o.status === "livre" ? (
        <div className="rounded-2xl bg-sage/60 p-4 space-y-3">
          <p className="font-mono-label text-aun">Facturation</p>
          {invoices.map((i) => (
            <div key={i.id} className="flex flex-wrap items-center gap-3 text-sm">
              <span className="font-semibold text-forest">{i.number}</span>
              <span className="text-ink-soft">{fcfa(invoiceTotal(i))}</span>
              <span className={`font-mono-label !text-[10px] rounded-md px-2 py-1 ${i.paid ? "bg-aun/15 text-aun" : "bg-amber-100 text-amber-700"}`}>
                {i.paid ? "Payée" : "À payer"}
              </span>
              <button onClick={() => setInv({ edit: i })} className={`keycap ml-auto px-4 py-2 text-xs font-semibold ${keyWhite}`}>Ouvrir / PDF</button>
            </div>
          ))}
          <button onClick={() => setInv({ edit: null })} className={`keycap px-5 py-3 text-sm font-semibold ${keyGreen}`}>
            <FileText size={15} /> {invoices.length ? "Nouvelle facture" : "Générer la facture"}
          </button>
        </div>
      ) : (
        <p className="text-xs text-ink-mute">La facture se génère quand le statut passe à « Livré ».</p>
      )}
      {inv && <InvoiceEditor order={o} invoice={inv.edit} onClose={() => setInv(null)} onSaved={onChange} />}

      <div className="flex flex-wrap gap-3">
        <button onClick={copy} className={`keycap px-5 py-3 text-sm font-semibold ${keyGreen}`}>
          {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Lien copié" : "Copier le lien client"}
        </button>
        <button onClick={() => { if (confirm(`Supprimer ${o.reference} ?`)) onDelete(); }}
          className={`keycap px-5 py-3 text-sm font-semibold ${keyWhite}`}>
          <Trash2 size={15} /> Supprimer
        </button>
      </div>
    </div>
  );
}

/* ── Tableau de bord ── */
function Dashboard({ session }: { session: Session }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [origin, setOrigin] = useState<"all" | "contact" | "lien">("all");
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [visits, setVisits] = useState<StatVisit[]>([]);
  const [visitsReady, setVisitsReady] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [creating, setCreating] = useState(false);
  const [fresh, setFresh] = useState<{ ref: string; link: string } | null>(null);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("client_orders")
      .select("*, client_reviews(id, rating, comment, approved)")
      .order("submitted_at", { ascending: false });
    if (error) setErr("Lecture impossible : ce compte n'est pas autorisé.");
    else setOrders((data ?? []) as Order[]);

    const inv = await supabase.from("invoices").select("*");
    if (!inv.error) setInvoices((inv.data ?? []) as Invoice[]);

    // visites : lecture par pages de 1000 (limite Supabase), 20 000 max
    const all: StatVisit[] = [];
    let ok = true;
    for (let from = 0; from < 20000; from += 1000) {
      const r = await supabase.from("site_visits").select("created_at, visitor_id, lang, device, kind")
        .order("created_at", { ascending: false }).range(from, from + 999);
      if (r.error) { ok = false; break; }
      all.push(...((r.data ?? []) as StatVisit[]));
      if ((r.data?.length ?? 0) < 1000) break;
    }
    setVisits(all);
    setVisitsReady(ok);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Ce navigateur est le vôtre : ses visites du portfolio seront marquées « owner » et masquées
  useEffect(() => { try { localStorage.setItem("aun-owner", "1"); } catch { /* ignore */ } }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true); setErr("");
    const { data, error } = await supabase.from("client_orders")
      .insert({ client_name: name.trim() || null, client_email: email.trim() || null, reference: "" })
      .select("token, reference").single();
    setCreating(false);
    if (error || !data) return setErr("Création impossible.");
    setFresh({ ref: data.reference, link: linkOf(data.token) });
    try { await navigator.clipboard.writeText(linkOf(data.token)); } catch { /* ignore */ }
    setName(""); setEmail("");
    load();
  };

  const shown = orders.filter((o) => (filter === "all" || o.status === filter)
    && (origin === "all" || (origin === "contact") === isContact(o)));
  const pending = orders.filter((o) => reviewOf(o) && !reviewOf(o)!.approved).length;

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <header className="bg-forest text-cream">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={LOGO_SRC} alt="" className="h-8 w-8 object-contain brightness-0 invert" />
            <span className="font-display font-bold text-lg">Tableau de bord</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={load} aria-label="Actualiser" className="p-2 rounded-lg hover:bg-white/10"><RefreshCw size={17} /></button>
            <button onClick={() => supabase.auth.signOut()} className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg hover:bg-white/10">
              <LogOut size={16} /> <span className="hidden sm:inline">{session.user.email}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        {!loading && <StatsPanel orders={orders} visits={visits} invoices={invoices} visitsReady={visitsReady} />}

        {/* création */}
        <form onSubmit={create} className="rounded-3xl bg-white/70 border-2 border-ink/10 p-6">
          <p className="font-mono-label text-aun mb-4">Nouveau lien client</p>
          <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-3">
            <input className={inputCls} placeholder="Nom (facultatif)" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" className={inputCls} placeholder="Email (facultatif)" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button type="submit" disabled={creating} className={`keycap px-6 py-3 text-sm font-semibold disabled:opacity-70 ${keyGreen}`}>
              {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Créer
            </button>
          </div>
          {fresh && (
            <p className="mt-4 text-sm bg-sage/60 rounded-xl px-4 py-3 break-all">
              <b>{fresh.ref}</b> · lien copié : <span className="font-mono">{fresh.link}</span>
            </p>
          )}
          {err && <p className="mt-3 text-sm text-red-600" role="alert">{err}</p>}
        </form>

        {/* filtres */}
        <div className="flex flex-wrap items-center gap-2">
          {([["all", "Toutes origines"], ["contact", "Contacts du site"], ["lien", "Commandes (lien)"]] as const).map(([v, l]) => (
            <button key={v} onClick={() => setOrigin(v)} aria-pressed={origin === v}
              className={`font-mono-label !text-[11px] rounded-full px-3 py-1.5 border-2 transition ${
                origin === v ? "bg-aun text-white border-aun" : "border-ink/15 text-ink-soft hover:border-aun"}`}>
              {l}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {[{ value: "all", label: "Tous" }, ...STATUSES].map((s) => (
            <button key={s.value} onClick={() => setFilter(s.value)}
              className={`font-mono-label !text-[11px] rounded-full px-3 py-1.5 border-2 transition ${
                filter === s.value ? "bg-forest text-cream border-forest" : "border-ink/15 text-ink-soft hover:border-aun"}`}>
              {s.label}
            </button>
          ))}
          {pending > 0 && <span className="ml-auto font-mono-label !text-[11px] text-aun">{pending} avis à valider</span>}
        </div>

        {/* liste */}
        {loading ? (
          <div className="flex justify-center py-10"><Loader2 className="animate-spin text-aun" /></div>
        ) : shown.length === 0 ? (
          <p className="text-center text-ink-mute py-10">Aucune commande.</p>
        ) : (
          <ul className="space-y-3">
            {shown.map((o) => {
              const st = STATUSES.find((s) => s.value === o.status);
              const isOpen = open === o.id;
              return (
                <li key={o.id} className="rounded-2xl bg-white border-2 border-ink/10 p-4 sm:p-5">
                  <button className="w-full flex items-center gap-3 text-left" onClick={() => setOpen(isOpen ? null : o.id)} aria-expanded={isOpen}>
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ background: st?.dot }} title={st?.label} />
                    <span className="min-w-0 flex-1">
                      <span className="block font-display font-bold text-forest truncate">
                        {o.client_name || "Client sans nom"}
                        {o.project_title ? <span className="font-normal text-ink-mute"> · {o.project_title}</span> : null}
                      </span>
                      <span className="block font-mono-label !text-[10px] text-ink-mute">
                        {o.reference} · {new Date(o.submitted_at).toLocaleDateString("fr-FR")}
                      </span>
                    </span>
                    {isContact(o) && <span className="font-mono-label !text-[10px] rounded-md px-2 py-1 bg-moss/30 text-forest">Contact</span>}
                    <span className={`font-mono-label !text-[10px] rounded-md px-2 py-1 ${
                      o.form_completed ? "bg-aun/15 text-aun" : "bg-ink/5 text-ink-mute"}`}>
                      {o.form_completed ? "Reçu" : "En attente"}
                    </span>
                  </button>
                  {isOpen && (
                    <Detail o={o} invoices={invoices.filter((i) => i.order_id === o.id)} onChange={load}
                      onDelete={async () => { await supabase.from("client_orders").delete().eq("id", o.id); setOpen(null); load(); }} />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return <div className="min-h-screen bg-forest grid place-items-center"><Loader2 className="animate-spin text-moss" /></div>;
  }
  return session ? <Dashboard session={session} /> : <Login />;
}