import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Loader2, Send, Star } from "lucide-react";
import supabase from "../services/supabase";
import {
  BUDGETS, DEADLINES, PROJECT_TYPES, STATUSES, labelOf, budgetLabel, type Currency,
} from "../lib/orderConfig";

const LOGO_SRC = "/Aun/aun-symbole-vert.svg";
const EASE = [0.22, 1, 0.36, 1] as const;

type Order = {
  reference: string;
  client_name: string | null;
  client_email: string | null;
  status: string;
  form_completed: boolean;
  has_review: boolean;
};

type Form = {
  client_name: string; client_email: string; client_phone: string; client_company: string;
  project_type: string; project_title: string; description: string; features: string;
  preferred_techs: string; visual_references: string;
  budget_range: string; budget_currency: Currency; deadline: string; additional_notes: string;
};

const EMPTY: Form = {
  client_name: "", client_email: "", client_phone: "", client_company: "",
  project_type: "", project_title: "", description: "", features: "",
  preferred_techs: "", visual_references: "",
  budget_range: "", budget_currency: "XAF", deadline: "", additional_notes: "",
};

const STEPS = ["Vous", "Projet", "Budget", "Envoi"];

/* ── Bord déchiré (bas du bandeau forêt) ── */
function TornEdge({ fill = "#f6f4ec" }: { fill?: string }) {
  const d = useMemo(() => {
    const w = 1440, h = 40, steps = 80;
    let p = `M0 ${h} L0 14`;
    for (let i = 1; i <= steps; i++) {
      const r = Math.abs((Math.sin(i * 33.9) * 43758.5453) % 1);
      p += ` L${((w / steps) * i).toFixed(1)} ${(6 + r * 18).toFixed(1)}`;
    }
    return p + ` L${w} ${h} Z`;
  }, []);
  return (
    <svg viewBox="0 0 1440 40" preserveAspectRatio="none"
      className="absolute bottom-0 left-0 w-full h-7 lg:h-10 z-30"
      style={{ filter: "drop-shadow(0 -2px 3px rgba(0,0,0,0.25))" }} aria-hidden="true">
      <path d={d} fill={fill} />
    </svg>
  );
}

/* ── Champs ── */
const inputCls =
  "w-full rounded-xl border-2 border-ink/10 bg-white px-4 py-3 text-[15px] text-ink font-body outline-none transition focus:border-aun focus:ring-4 focus:ring-aun/15 placeholder:text-ink-mute/60";

function Field({ label, required, error, hint, children }: {
  label: string; required?: boolean; error?: string; hint?: string; children: React.ReactNode;
}) {
  return (
    <div className="mb-5">
      <label className="font-mono-label text-ink-soft block mb-2">
        {label} {required && <span className="text-aun">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-ink-mute mt-1.5">{hint}</p>}
      {error && (
        <p className="text-xs text-red-600 mt-1.5 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </p>
      )}
    </div>
  );
}

/* Touche à bascule (choix unique) */
function Key({ on, onClick, children, className = "" }: {
  on: boolean; onClick: () => void; children: React.ReactNode; className?: string;
}) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on}
      className={`keycap px-4 py-3 text-sm font-semibold text-left justify-start ${className} ${
        on
          ? "[--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#ffffff]"
          : "[--key-face:#ffffff] [--key-edge:#b9c8bd] [--key-text:#0e2f20]"
      }`}
      style={on ? { transform: "translateY(3px)", boxShadow: "0 2px 0 #0d4527" } : undefined}>
      {on && <Check size={15} className="shrink-0" />}
      <span>{children}</span>
    </button>
  );
}

/* Note en étoiles */
function Stars({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" aria-label={`${n} sur 5`}
          onClick={() => onChange(n)} onMouseEnter={() => setHover(n)}
          className="p-1 transition-transform hover:scale-110 active:scale-95">
          <Star size={30} strokeWidth={1.6}
            fill={(hover || value) >= n ? "#f59e0b" : "none"}
            stroke={(hover || value) >= n ? "#f59e0b" : "#b9c8bd"} />
        </button>
      ))}
    </div>
  );
}

/* Message d'erreur lisible depuis les RPC */
const rpcMessage = (e: { message?: string } | null) => {
  const m = e?.message ?? "";
  if (m.includes("order_unavailable")) return "Ce lien n'est plus valide ou a déjà été utilisé.";
  if (m.includes("duplicate") || m.includes("23505")) return "Vous avez déjà laissé votre avis, merci !";
  return "Une erreur est survenue. Réessayez dans un instant.";
};

/* ═══════════════════════════════════════════════════════════ */
export default function ClientOrderPage() {
  const { token = "" } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [state, setState] = useState<"loading" | "ok" | "missing">("loading");
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [sending, setSending] = useState(false);
  const [fatal, setFatal] = useState("");

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [reviewErr, setReviewErr] = useState("");
  const [reviewBusy, setReviewBusy] = useState(false);
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      const { data, error } = await supabase.rpc("get_order", { p_token: token });
      if (!live) return;
      if (error || !data) { setState("missing"); return; }
      const o = data as Order;
      setOrder(o);
      setForm((f) => ({ ...f, client_name: o.client_name ?? "", client_email: o.client_email ?? "" }));
      setReviewed(o.has_review);
      setState("ok");
    })();
    return () => { live = false; };
  }, [token]);

  const set = <K extends keyof Form>(k: K, v: Form[K]) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (s: number) => {
    const e: Partial<Record<keyof Form, string>> = {};
    if (s === 0) {
      if (form.client_name.trim().length < 2) e.client_name = "Votre nom, s'il vous plaît.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client_email.trim())) e.client_email = "Email invalide.";
    }
    if (s === 1) {
      if (!form.project_type) e.project_type = "Choisissez un type de projet.";
      if (form.description.trim().length < 30)
        e.description = `Encore ${30 - form.description.trim().length} caractères au minimum.`;
    }
    if (s === 2) {
      if (!form.budget_range) e.budget_range = "Choisissez une fourchette.";
      if (!form.deadline) e.deadline = "Choisissez un délai.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validate(step)) setStep((s) => s + 1); };

  const submit = async () => {
    if (step < 3) return;
    setSending(true); setFatal("");
    const { error } = await supabase.rpc("submit_order", { p_token: token, p: form });
    setSending(false);
    if (error) { setFatal(rpcMessage(error)); return; }
    setOrder((o) => (o ? { ...o, form_completed: true } : o));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const sendReview = async () => {
    if (!rating) return setReviewErr("Choisissez une note.");
    if (comment.trim().length < 10) return setReviewErr("Quelques mots de plus (10 caractères minimum).");
    setReviewBusy(true); setReviewErr("");
    const { error } = await supabase.rpc("submit_review", { p_token: token, p_rating: rating, p_comment: comment });
    setReviewBusy(false);
    if (error) return setReviewErr(rpcMessage(error));
    setReviewed(true);
  };

  const done = order?.form_completed;
  const status = STATUSES.find((s) => s.value === order?.status);

  return (
    <div className="font-body bg-cream min-h-screen text-ink overflow-x-hidden">
      {/* ── Bandeau forêt ── */}
      <header className="relative bg-forest text-cream pt-8 pb-24 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3" aria-label="Retour au portfolio">
            <img src={LOGO_SRC} alt="" className="h-9 w-9 object-contain brightness-0 invert" />
            <span className="font-display font-bold text-xl">Aun</span>
          </a>
          {order && (
            <span className="font-mono-label text-moss border border-moss/40 rounded-md px-3 py-1.5">
              {order.reference}
            </span>
          )}
        </div>
        <div className="max-w-3xl mx-auto mt-10">
          <p className="font-mono-label text-moss mb-3">Brief projet</p>
          <h1 className="font-display font-extrabold leading-[1.05] text-cream" style={{ fontSize: "clamp(2rem, 6vw, 3.4rem)" }}>
            {state === "missing" ? "Lien introuvable" :
              done ? <>Merci{order?.client_name ? `, ${order.client_name.split(" ")[0]}` : ""}.</> :
              <>Racontez-moi<br />votre projet.</>}
          </h1>
        </div>
        <TornEdge />
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-8 pb-24 relative z-40">
        {state === "loading" && (
          <div className="flex justify-center py-20"><Loader2 className="animate-spin text-aun" /></div>
        )}

        {state === "missing" && (
          <div className="rounded-3xl bg-white border-2 border-ink/10 p-8 text-center">
            <p className="text-ink-soft mb-6">
              Ce lien est invalide ou a expiré. Contactez-moi pour en recevoir un nouveau.
            </p>
            <a href="/#contact"
              className="keycap inline-flex px-6 py-3.5 text-sm font-semibold [--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#fff]">
              Me contacter
            </a>
          </div>
        )}

        {state === "ok" && order && !done && (
          <>
            {/* progression */}
            <ol className="flex items-center gap-2 mb-8" aria-label="Progression">
              {STEPS.map((s, i) => (
                <li key={s} className="flex-1">
                  <div className={`h-1.5 rounded-full transition-colors ${i <= step ? "bg-aun" : "bg-ink/10"}`} />
                  <span className={`font-mono-label block mt-2 !text-[10px] ${i === step ? "text-aun" : "text-ink-mute"}`}>
                    0{i + 1} {s}
                  </span>
                </li>
              ))}
            </ol>

            <form onSubmit={(e) => e.preventDefault()}
              className="rounded-3xl bg-white/70 border-2 border-ink/10 p-6 sm:p-8 shadow-[0_18px_40px_-24px_rgba(14,47,32,0.35)]">
              <AnimatePresence mode="wait">
                <motion.div key={step}
                  initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -18 }}
                  transition={{ duration: 0.28, ease: EASE }}>

                  {step === 0 && (
                    <>
                      <Field label="Nom complet" required error={errors.client_name}>
                        <input className={inputCls} value={form.client_name} autoComplete="name"
                          onChange={(e) => set("client_name", e.target.value)} />
                      </Field>
                      <Field label="Email" required error={errors.client_email}>
                        <input type="email" className={inputCls} value={form.client_email} autoComplete="email"
                          onChange={(e) => set("client_email", e.target.value)} />
                      </Field>
                      <div className="grid sm:grid-cols-2 gap-x-4">
                        <Field label="Téléphone / WhatsApp">
                          <input className={inputCls} value={form.client_phone} autoComplete="tel"
                            onChange={(e) => set("client_phone", e.target.value)} />
                        </Field>
                        <Field label="Entreprise">
                          <input className={inputCls} value={form.client_company} autoComplete="organization"
                            onChange={(e) => set("client_company", e.target.value)} />
                        </Field>
                      </div>
                    </>
                  )}

                  {step === 1 && (
                    <>
                      <Field label="Type de projet" required error={errors.project_type}>
                        <div className="grid sm:grid-cols-2 gap-3 pb-1">
                          {PROJECT_TYPES.map((t) => (
                            <Key key={t.value} on={form.project_type === t.value}
                              onClick={() => set("project_type", t.value)}>
                              <span className="block">
                                {t.label}
                                <span className="block text-[11px] font-normal opacity-70">{t.desc}</span>
                              </span>
                            </Key>
                          ))}
                        </div>
                      </Field>
                      <Field label="Titre du projet">
                        <input className={inputCls} value={form.project_title} placeholder="Ex : Boutique de vêtements"
                          onChange={(e) => set("project_title", e.target.value)} />
                      </Field>
                      <Field label="Description" required error={errors.description}
                        hint={`${form.description.trim().length} / 30 caractères minimum`}>
                        <textarea rows={5} className={inputCls} value={form.description}
                          placeholder="Que voulez-vous réaliser ? Pour qui ? Quel problème cela résout-il ?"
                          onChange={(e) => set("description", e.target.value)} />
                      </Field>
                      <Field label="Fonctionnalités souhaitées">
                        <textarea rows={3} className={inputCls} value={form.features}
                          placeholder="Paiement mobile, espace client, catalogue…"
                          onChange={(e) => set("features", e.target.value)} />
                      </Field>
                      <div className="grid sm:grid-cols-2 gap-x-4">
                        <Field label="Technos préférées">
                          <input className={inputCls} value={form.preferred_techs} placeholder="Facultatif"
                            onChange={(e) => set("preferred_techs", e.target.value)} />
                        </Field>
                        <Field label="Sites de référence">
                          <input className={inputCls} value={form.visual_references} placeholder="Liens qui vous inspirent"
                            onChange={(e) => set("visual_references", e.target.value)} />
                        </Field>
                      </div>
                    </>
                  )}

                  {step === 2 && (
                    <>
                      <Field label="Devise d'affichage">
                        <div className="flex gap-3 pb-1">
                          {(["XAF", "USD"] as Currency[]).map((c) => (
                            <Key key={c} on={form.budget_currency === c} className="min-w-[110px]"
                              onClick={() => set("budget_currency", c)}>
                              {c === "XAF" ? "FCFA" : "Dollars $"}
                            </Key>
                          ))}
                        </div>
                      </Field>
                      <Field label="Budget estimé" required error={errors.budget_range}>
                        <div className="grid sm:grid-cols-2 gap-3 pb-1">
                          {BUDGETS[form.budget_currency].map((b) => (
                            <Key key={b.value} on={form.budget_range === b.value}
                              onClick={() => set("budget_range", b.value)}>{b.label}</Key>
                          ))}
                        </div>
                      </Field>
                      <Field label="Délai souhaité" required error={errors.deadline}>
                        <div className="grid sm:grid-cols-2 gap-3 pb-1">
                          {DEADLINES.map((d) => (
                            <Key key={d.value} on={form.deadline === d.value}
                              onClick={() => set("deadline", d.value)}>{d.label}</Key>
                          ))}
                        </div>
                      </Field>
                      <Field label="Autre chose à me dire ?">
                        <textarea rows={3} className={inputCls} value={form.additional_notes}
                          onChange={(e) => set("additional_notes", e.target.value)} />
                      </Field>
                    </>
                  )}

                  {step === 3 && (
                    <dl className="divide-y divide-ink/10 text-sm">
                      {([
                        ["Nom", form.client_name],
                        ["Email", form.client_email],
                        ["Téléphone", form.client_phone],
                        ["Entreprise", form.client_company],
                        ["Type", labelOf(PROJECT_TYPES, form.project_type)],
                        ["Titre", form.project_title],
                        ["Description", form.description],
                        ["Fonctionnalités", form.features],
                        ["Budget", budgetLabel(form.budget_range, form.budget_currency)],
                        ["Délai", labelOf(DEADLINES, form.deadline)],
                        ["Notes", form.additional_notes],
                      ] as [string, string][]).filter(([, v]) => v && v.trim()).map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[110px_1fr] gap-3 py-2.5">
                          <dt className="font-mono-label text-ink-mute !text-[11px] pt-0.5">{k}</dt>
                          <dd className="font-semibold text-forest whitespace-pre-line break-words min-w-0">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  )}
                </motion.div>
              </AnimatePresence>

              {fatal && (
                <p className="mt-4 text-sm text-red-600 flex items-center gap-2" role="alert">
                  <AlertCircle size={15} /> {fatal}
                </p>
              )}

              <div className="flex gap-3 mt-6 pt-2">
                {step > 0 && (
                  <button key="back" type="button" onClick={() => setStep((s) => s - 1)}
                    className="keycap px-5 py-3.5 text-sm font-semibold [--key-face:#ffffff] [--key-edge:#b9c8bd] [--key-text:#0e2f20]">
                    <ArrowLeft size={16} /> Retour
                  </button>
                )}
                {step < 3 ? (
                  <button key="next" type="button" onClick={next}
                    className="keycap flex-1 py-3.5 text-sm font-semibold [--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#fff]">
                    Continuer <ArrowRight size={16} />
                  </button>
                ) : (
                  <button key="send" type="button" onClick={submit} disabled={sending}
                    className="keycap flex-1 py-3.5 text-sm font-semibold disabled:opacity-70 disabled:cursor-not-allowed [--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#fff]">
                    {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {sending ? "Envoi…" : "Envoyer mon brief"}
                  </button>
                )}
              </div>
            </form>
          </>
        )}

        {state === "ok" && order && done && (
          <div className="space-y-6">
            {/* ticket de confirmation */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}
              className="rounded-3xl bg-white border-2 border-ink/10 p-6 sm:p-8 shadow-[0_18px_40px_-24px_rgba(14,47,32,0.35)]">
              <div className="flex items-center gap-4">
                <span className="grid place-items-center h-12 w-12 rounded-full bg-aun text-white"><Check /></span>
                <div>
                  <p className="font-display font-bold text-xl text-forest">Brief bien reçu</p>
                  <p className="text-sm text-ink-mute">Je reviens vers vous très vite par email.</p>
                </div>
              </div>
              <div className="mt-6 border-t-2 border-dashed border-ink/15 pt-5 flex flex-wrap items-center justify-between gap-3">
                <span className="font-mono-label text-ink-mute">Référence · {order.reference}</span>
                {status && (
                  <span className="inline-flex items-center gap-2 font-mono-label text-forest">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: status.dot }} />
                    {status.label}
                  </span>
                )}
              </div>
            </motion.div>

            {/* avis */}
            <div className="rounded-3xl bg-sage/60 border-2 border-aun/20 p-6 sm:p-8">
              {reviewed ? (
                <p className="font-semibold text-forest flex items-center gap-2">
                  <Check size={18} className="text-aun" /> Merci pour votre avis, il sera publié après relecture.
                </p>
              ) : (
                <>
                  <h2 className="font-display font-bold text-xl text-forest mb-1">Un mot sur cette expérience ?</h2>
                  <p className="text-sm text-ink-soft mb-4">
                    Votre avis m'aide à m'améliorer. Il apparaîtra sur le portfolio après ma validation (prénom seulement).
                  </p>
                  <Stars value={rating} onChange={(n) => { setRating(n); setReviewErr(""); }} />
                  <textarea rows={4} className={`${inputCls} mt-4`} value={comment} placeholder="Ce que vous avez apprécié…"
                    onChange={(e) => { setComment(e.target.value); setReviewErr(""); }} />
                  {reviewErr && (
                    <p className="text-xs text-red-600 mt-2 flex items-center gap-1"><AlertCircle size={12} /> {reviewErr}</p>
                  )}
                  <button type="button" onClick={sendReview} disabled={reviewBusy}
                    className="keycap mt-5 px-6 py-3.5 text-sm font-semibold disabled:opacity-70 [--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#fff]">
                    {reviewBusy ? <Loader2 size={16} className="animate-spin" /> : <Star size={16} />} Publier mon avis
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}