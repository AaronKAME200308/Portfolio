import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Route, Routes } from "react-router-dom";
import { Loader2, LogOut, RefreshCw } from "lucide-react";
import type { Session } from "@supabase/supabase-js";
import supabase from "../services/supabase";
import StatsPanel from "../components/admin/StatsPanel";
import type { Invoice } from "../components/admin/InvoiceEditor";
import { OrderDetail, OrdersList } from "../components/admin/OrdersView";
import { InvoicePage, InvoicesList } from "../components/admin/InvoicesView";
import { ReviewPage, ReviewsList } from "../components/admin/ReviewsView";
import { VisitsList } from "../components/admin/VisitsView";
import { inputCls, keyGreen, reviewOf, type Order } from "../lib/adminData";
import { fcfa, invoiceTotal, isContact, type StatVisit } from "../lib/stats";

const LOGO_SRC = "/Aun/aun-symbole-vert.svg";

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

/* ── Tableau de bord ── */
function Dashboard({ session }: { session: Session }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [visits, setVisits] = useState<StatVisit[]>([]);
  const [visitsReady, setVisitsReady] = useState(false);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const loadCore = useCallback(async () => {
    const { data, error } = await supabase
      .from("client_orders")
      .select("*, client_reviews(id, rating, comment, approved, submitted_at)")
      .order("submitted_at", { ascending: false });
    if (error) setErr("Lecture impossible : ce compte n'est pas autorisé.");
    else { setErr(""); setOrders((data ?? []) as Order[]); }
    const inv = await supabase.from("invoices").select("*");
    if (!inv.error) setInvoices((inv.data ?? []) as Invoice[]);
  }, []);

  // visites : lecture par pages de 1000 (limite Supabase), 20 000 max
  const loadVisits = useCallback(async () => {
    const all: StatVisit[] = [];
    let ok = true;
    for (let from = 0; from < 20000; from += 1000) {
      const r = await supabase.from("site_visits").select("id, created_at, visitor_id, page, referrer, lang, device, kind")
        .order("created_at", { ascending: false }).range(from, from + 999);
      if (r.error) { ok = false; break; }
      all.push(...((r.data ?? []) as StatVisit[]));
      if ((r.data?.length ?? 0) < 1000) break;
    }
    setVisits(all);
    setVisitsReady(ok);
  }, []);

  const loadAll = useCallback(async () => {
    await Promise.all([loadCore(), loadVisits()]);
    setLoading(false);
  }, [loadCore, loadVisits]);

  useEffect(() => { void loadAll(); }, [loadAll]);

  // Ce navigateur est le vôtre : ses visites du portfolio seront marquées « owner » et masquées
  useEffect(() => { try { localStorage.setItem("aun-owner", "1"); } catch { /* ignore */ } }, []);

  const contacts = orders.filter(isContact);
  const commandes = orders.filter((o) => !isContact(o));
  const reviews = orders.filter((o) => reviewOf(o));
  const pendingReviews = reviews.filter((o) => !reviewOf(o)!.approved).length;
  const unpaid = invoices.filter((i) => !i.paid);
  const newContacts = contacts.filter((o) => o.status === "nouveau").length;

  const tabs: { to: string; label: string; n?: number; end?: boolean }[] = [
    { to: "/admin", label: "Aperçu", end: true },
    { to: "/admin/commandes", label: "Commandes", n: commandes.length },
    { to: "/admin/contacts", label: "Contacts", n: contacts.length },
    { to: "/admin/factures", label: "Factures", n: invoices.length },
    { to: "/admin/avis", label: "Avis", n: reviews.length },
    { to: "/admin/visites", label: "Visites", n: visitsReady ? visits.filter((v) => !v.kind || v.kind === "human").length : undefined },
  ];

  const shortcuts = [
    { to: "/admin/contacts", n: newContacts, label: "nouveau(x) contact(s)" },
    { to: "/admin/avis", n: pendingReviews, label: "avis à valider" },
    { to: "/admin/factures", n: unpaid.length, label: `facture(s) à payer${unpaid.length ? ` · ${fcfa(unpaid.reduce((a, x) => a + invoiceTotal(x), 0))}` : ""}` },
  ];

  return (
    <div className="min-h-screen bg-cream font-body text-ink">
      <header className="bg-forest text-cream sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-3 sm:pt-4 flex items-center justify-between gap-3">
          <Link to="/admin" className="flex items-center gap-2.5 min-w-0">
            <img src={LOGO_SRC} alt="" className="h-7 w-7 object-contain brightness-0 invert shrink-0" />
            <span className="font-display font-bold text-base sm:text-lg truncate">Tableau de bord</span>
          </Link>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => void loadAll()} aria-label="Actualiser" className="p-2 rounded-lg hover:bg-white/10"><RefreshCw size={17} /></button>
            <button onClick={() => supabase.auth.signOut()} aria-label="Se déconnecter" className="flex items-center gap-2 text-sm px-2.5 py-2 rounded-lg hover:bg-white/10">
              <LogOut size={16} /> <span className="hidden md:inline">{session.user.email}</span>
            </button>
          </div>
        </div>
        <nav aria-label="Sections" className="max-w-5xl mx-auto px-4 sm:px-6 mt-2 flex gap-1 overflow-x-auto [scrollbar-width:none]">
          {tabs.map((t) => (
            <NavLink key={t.to} to={t.to} end={t.end}
              className={({ isActive }) => `whitespace-nowrap shrink-0 px-3.5 py-2.5 text-sm font-semibold border-b-[3px] transition ${
                isActive ? "border-moss text-white" : "border-transparent text-cream/65 hover:text-white"}`}>
              {t.label}{t.n !== undefined && <span className="ml-1.5 text-[11px] opacity-60">{t.n}</span>}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {err && <p className="mb-4 text-sm text-red-600" role="alert">{err}</p>}
        {loading ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-aun" /></div>
        ) : (
          <Routes>
            <Route index element={
              <div className="space-y-6">
                <div className="grid sm:grid-cols-3 gap-3">
                  {shortcuts.map((s) => (
                    <Link key={s.to} to={s.to} className="flex items-center gap-4 sm:block rounded-2xl bg-white border-2 border-ink/10 p-4 transition hover:border-aun">
                      <p className="font-display font-extrabold text-3xl text-forest leading-none min-w-[2ch]">{s.n}</p>
                      <p className="text-sm text-ink-soft sm:mt-1.5">{s.label}</p>
                    </Link>
                  ))}
                </div>
                <StatsPanel orders={orders} visits={visits} invoices={invoices} visitsReady={visitsReady} />
              </div>
            } />
            <Route path="commandes" element={<OrdersList orders={orders} kind="lien" onChanged={loadCore} />} />
            <Route path="commandes/:id" element={<OrderDetail orders={orders} invoices={invoices} kind="lien" onChanged={loadCore} />} />
            <Route path="contacts" element={<OrdersList orders={orders} kind="contact" onChanged={loadCore} />} />
            <Route path="contacts/:id" element={<OrderDetail orders={orders} invoices={invoices} kind="contact" onChanged={loadCore} />} />
            <Route path="factures" element={<InvoicesList invoices={invoices} orders={orders} onChanged={loadCore} />} />
            <Route path="factures/:id" element={<InvoicePage invoices={invoices} orders={orders} onChanged={loadCore} />} />
            <Route path="avis" element={<ReviewsList orders={orders} onChanged={loadCore} />} />
            <Route path="avis/:id" element={<ReviewPage orders={orders} onChanged={loadCore} />} />
            <Route path="visites" element={<VisitsList visits={visits} ready={visitsReady} onChanged={loadVisits} />} />
            <Route path="*" element={<p className="text-center text-ink-mute py-16">Page introuvable. <Link to="/admin" className="text-aun font-semibold">Retour à l'aperçu</Link></p>} />
          </Routes>
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