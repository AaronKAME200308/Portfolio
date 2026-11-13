import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2, Monitor, ShoppingCart, AppWindow, Smartphone,
  LayoutDashboard, HelpCircle, CheckCircle2, Star,
  Send, AlertCircle, Clock, Banknote, Wrench, FileText,
  Link, ChevronRight, ChevronLeft, Sparkles, MessageSquare
} from "lucide-react";
import supabase from "../services/supabase";

// ── Types ─────────────────────────────────────────────────
type ProjectType = "site_vitrine" | "site_ecommerce" | "application_web" | "application_mobile" | "dashboard_admin" | "autre";
type BudgetRange = "moins_500" | "500_1000" | "1000_3000" | "3000_5000" | "plus_5000" | "a_discuter";
type Deadline    = "urgent_2sem" | "1mois" | "2_3mois" | "plus_3mois" | "flexible";

interface OrderForm {
  client_name:       string;
  client_email:      string;
  client_phone:      string;
  client_company:    string;
  project_type:      ProjectType | "";
  project_title:     string;
  description:       string;
  features:          string;
  preferred_techs:   string;
  visual_references: string;
  budget_range:      BudgetRange | "";
  deadline:          Deadline    | "";
  additional_notes:  string;
}

interface Order {
  id:             string;
  token:          string;
  reference:      string;
  client_name:    string;
  client_email:   string;
  status:         string;
  form_completed: boolean;
  submitted_at:   string;
}

interface Review {
  id:          string;
  rating:      number;
  comment:     string;
  submitted_at: string;
}

// ── Config ────────────────────────────────────────────────
const EASE = [0.22, 1, 0.36, 1] as const;

const PROJECT_TYPES: { value: ProjectType; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: "site_vitrine",      label: "Site vitrine",       icon: <Monitor size={18} />,       desc: "Présenter votre activité en ligne" },
  { value: "site_ecommerce",    label: "E-commerce",         icon: <ShoppingCart size={18} />,  desc: "Vendre des produits en ligne" },
  { value: "application_web",   label: "Application web",    icon: <AppWindow size={18} />,     desc: "App complexe avec logique métier" },
  { value: "application_mobile",label: "App mobile",         icon: <Smartphone size={18} />,    desc: "iOS et/ou Android" },
  { value: "dashboard_admin",   label: "Dashboard / Admin",  icon: <LayoutDashboard size={18}/>, desc: "Interface de gestion de données" },
  { value: "autre",             label: "Autre",              icon: <HelpCircle size={18} />,    desc: "Décrivez votre besoin" },
];

const BUDGETS: { value: BudgetRange; label: string }[] = [
  { value: "moins_500",  label: "< 500 $"         },
  { value: "500_1000",   label: "500 $ – 1 000 $" },
  { value: "1000_3000",  label: "1 000 $ – 3 000 $" },
  { value: "3000_5000",  label: "3 000 $ – 5 000 $" },
  { value: "plus_5000",  label: "> 5 000 $"        },
  { value: "a_discuter", label: "À discuter"       },
];

const DEADLINES: { value: Deadline; label: string }[] = [
  { value: "urgent_2sem", label: "Urgent (< 2 semaines)" },
  { value: "1mois",       label: "1 mois"                },
  { value: "2_3mois",     label: "2 à 3 mois"            },
  { value: "plus_3mois",  label: "Plus de 3 mois"        },
  { value: "flexible",    label: "Flexible"              },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  nouveau:       { label: "Nouveau",        color: "#7c3aed", bg: "#f5f3ff" },
  en_etude:      { label: "En étude",       color: "#2563eb", bg: "#eff6ff" },
  devis_envoye:  { label: "Devis envoyé",   color: "#d97706", bg: "#fffbeb" },
  en_cours:      { label: "En cours",       color: "#059669", bg: "#ecfdf5" },
  livre:         { label: "Livré ✓",        color: "#059669", bg: "#ecfdf5" },
  annule:        { label: "Annulé",         color: "#dc2626", bg: "#fef2f2" },
};

// ── Styles communs ────────────────────────────────────────
const fieldBase: React.CSSProperties = {
  width: "100%", padding: "11px 14px", borderRadius: 12, fontSize: 14,
  fontFamily: "'Syne', sans-serif", color: "#0f172a", outline: "none",
  transition: "all 0.2s ease", boxSizing: "border-box",
};

const Field = ({
  label, required, error, children,
}: { label: string; required?: boolean; error?: string; children: React.ReactNode }) => (
  <div className="mb-5">
    <label className="block text-xs font-bold uppercase tracking-wider mb-2"
      style={{ color: "#64748b", fontFamily: "'Syne', sans-serif" }}>
      {label} {required && <span style={{ color: "#7c3aed" }}>*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "#dc2626" }}>
        <AlertCircle size={11} /> {error}
      </p>
    )}
  </div>
);

// ── Star Rating ───────────────────────────────────────────
const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.button
          key={n} type="button"
          whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.9 }}
          onClick={() => onChange(n)}
          onMouseEnter={() => setHover(n)}
          onMouseLeave={() => setHover(0)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}
        >
          <Star
            size={28}
            fill={(hover || value) >= n ? "#f59e0b" : "none"}
            stroke={(hover || value) >= n ? "#f59e0b" : "#d1d5db"}
            strokeWidth={1.5}
          />
        </motion.button>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════
export default function ClientOrderPage() {
  const { token } = useParams<{ token: string }>();

  const [order,       setOrder]       = useState<Order | null>(null);
  const [_review,      setReview]      = useState<Review | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [notFound,    setNotFound]    = useState(false);
  const [step,        setStep]        = useState<1 | 2 | 3>(1); // 1=form, 2=review, 3=done
  const [saving,      setSaving]      = useState(false);
  const [saveError,   setSaveError]   = useState("");
  const [focusField,  setFocusField]  = useState<string | null>(null);
  const [errors,      setErrors]      = useState<Partial<Record<keyof OrderForm, string>>>({});

  // Review state
  const [rating,      setRating]      = useState(0);
  const [comment,     setComment]     = useState("");
  const [reviewSent,  setReviewSent]  = useState(false);
  const [reviewError, setReviewError] = useState("");

  const [form, setForm] = useState<OrderForm>({
    client_name: "", client_email: "", client_phone: "", client_company: "",
    project_type: "", project_title: "", description: "", features: "",
    preferred_techs: "", visual_references: "", budget_range: "", deadline: "",
    additional_notes: "",
  });

  // ── Fetch order by token ──────────────────────────────
  useEffect(() => {
    if (!token) { setNotFound(true); setLoading(false); return; }
    const load = async () => {
      const { data: ord, error } = await supabase
        .from("client_orders")
        .select("*")
        .eq("token", token)
        .single();

      if (error || !ord) { setNotFound(true); setLoading(false); return; }
      setOrder(ord as Order);

      // Prefill form if already partially filled
      if (ord.client_name)    setForm(f => ({ ...f, client_name:   ord.client_name   }));
      if (ord.client_email)   setForm(f => ({ ...f, client_email:  ord.client_email  }));

      // Check existing review
      const { data: rev } = await supabase
        .from("client_reviews")
        .select("*")
        .eq("order_id", ord.id)
        .maybeSingle();

      if (rev) { setReview(rev as Review); setReviewSent(true); }

      // If form already completed, skip to review step (unless review done)
      if (ord.form_completed && !rev) setStep(2);
      if (ord.form_completed && rev)  setStep(3);

      setLoading(false);
    };
    load();
  }, [token]);

  const update = (k: keyof OrderForm, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  const fieldStyle = (name: string): React.CSSProperties => ({
    ...fieldBase,
    background: focusField === name ? "#faf8ff" : "#f8fafc",
    border: `1.5px solid ${errors[name as keyof OrderForm] ? "#dc2626" : focusField === name ? "#7c3aed" : "#e2e8f0"}`,
  });

  // ── Validate ──────────────────────────────────────────
  const validate = (): boolean => {
    const e: Partial<Record<keyof OrderForm, string>> = {};
    if (!form.client_name.trim())  e.client_name  = "Nom requis";
    if (!form.client_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.client_email))
      e.client_email = "Email valide requis";
    if (!form.project_type)        e.project_type  = "Type de projet requis";
    if (!form.description.trim() || form.description.trim().length < 30)
      e.description = "Description requise (min. 30 caractères)";
    if (!form.budget_range)        e.budget_range  = "Budget requis";
    if (!form.deadline)            e.deadline      = "Délai requis";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit order ──────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate() || !order) return;
    setSaving(true); setSaveError("");
    try {
      const { error } = await supabase
        .from("client_orders")
        .update({
          client_name:       form.client_name.trim(),
          client_email:      form.client_email.trim().toLowerCase(),
          client_phone:      form.client_phone  || null,
          client_company:    form.client_company || null,
          project_type:      form.project_type,
          project_title:     form.project_title  || null,
          description:       form.description.trim(),
          features:          form.features       || null,
          preferred_techs:   form.preferred_techs || null,
          visual_references: form.visual_references || null,
          budget_range:      form.budget_range,
          deadline:          form.deadline,
          additional_notes:  form.additional_notes || null,
          form_completed:    true,
        })
        .eq("token", token);

      if (error) throw error;
      setOrder(o => o ? { ...o, form_completed: true } : o);
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSaveError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  // ── Submit review ─────────────────────────────────────
  const handleReview = async () => {
    if (!rating)    { setReviewError("Veuillez donner une note."); return; }
    if (!comment.trim() || comment.trim().length < 10)
      { setReviewError("Commentaire trop court (min. 10 caractères)."); return; }
    if (!order) return;
    setSaving(true); setReviewError("");
    try {
      const { error } = await supabase
        .from("client_reviews")
        .insert({ order_id: order.id, token, rating, comment: comment.trim() });
      if (error) throw error;
      setReviewSent(true);
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setReviewError("Erreur lors de l'envoi. Réessayez.");
    } finally {
      setSaving(false);
    }
  };

  // ── Loading ───────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "#f8fafc" }}>
      <div className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: "#e2e8f0", borderTopColor: "#7c3aed" }} />
    </div>
  );

  // ── Not found ─────────────────────────────────────────
  if (notFound || !order) return (
    <div className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "#f8fafc", fontFamily: "'Syne', sans-serif" }}>
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-4">🔗</div>
        <h2 className="font-black text-2xl mb-2" style={{ color: "#0f172a" }}>Lien invalide</h2>
        <p className="text-sm" style={{ color: "#94a3b8" }}>
          Ce lien de commande est invalide ou a expiré. Contactez-moi pour en obtenir un nouveau.
        </p>
      </div>
    </div>
  );

  const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.nouveau;

  return (
    <div className="min-h-screen" style={{ background: "#f8fafc", fontFamily: "'Syne', sans-serif" }}>

      {/* ── HEADER ── */}
      <div className="sticky top-0 z-50"
        style={{
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.65)",
          boxShadow: "0 1px 24px rgba(124,58,237,0.06)",
        }}>
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", boxShadow: "0 2px 10px rgba(124,58,237,0.3)" }}>
              <Code2 size={15} color="white" />
            </div>
            <div>
              <div className="font-black text-sm" style={{ color: "#0f172a" }}>
                Aaron KAME<span style={{ color: "#7c3aed" }}>.</span>
              </div>
              <div className="text-[10px]" style={{ color: "#94a3b8" }}>Commande · {order.reference}</div>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: statusCfg.bg, color: statusCfg.color }}>
            {statusCfg.label}
          </span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">

        {/* ── Step indicator ── */}
        {step < 3 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-10"
          >
            {[
              { n: 1, label: "Votre projet",  icon: <FileText size={14} /> },
              { n: 2, label: "Votre avis",    icon: <Star size={14} /> },
            ].map(({ n, label, icon }, i) => {
              const active = step >= n;
              const done   = step > n;
              return (
                <div key={n} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm mb-1.5"
                      style={{
                        background: active ? "linear-gradient(135deg,#7c3aed,#3b82f6)" : "#fff",
                        color: active ? "#fff" : "#94a3b8",
                        border: active ? "none" : "1.5px solid #e2e8f0",
                        boxShadow: active ? "0 4px 14px rgba(124,58,237,0.3)" : "none",
                      }}
                    >
                      {done ? <CheckCircle2 size={16} /> : icon}
                    </div>
                    <span className="text-[11px] font-semibold" style={{ color: active ? "#7c3aed" : "#94a3b8" }}>
                      {label}
                    </span>
                  </div>
                  {i === 0 && (
                    <div className="mx-4 mb-5 h-px w-16 rounded-full"
                      style={{ background: step > 1 ? "#7c3aed" : "#e2e8f0" }} />
                  )}
                </div>
              );
            })}
          </motion.div>
        )}

        <AnimatePresence mode="wait">

          {/* ══ STEP 1 — Formulaire commande ══ */}
          {step === 1 && !order.form_completed && (
            <motion.div key="form"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {/* Hero card */}
              <div className="rounded-3xl overflow-hidden mb-6"
                style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 8px 32px rgba(124,58,237,0.25)" }}>
                <div className="p-8 relative overflow-hidden">
                  <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full opacity-10"
                    style={{ background: "white" }} />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles size={14} color="rgba(255,255,255,0.7)" />
                      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.6)" }}>
                        Nouvelle commande
                      </span>
                    </div>
                    <h1 className="font-black text-2xl text-white mb-1">Décrivez votre projet</h1>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                      Remplissez ce formulaire avec le maximum de détails. Je vous répondrai sous 24h avec un devis.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── Section 1 : Contact ── */}
              <div className="rounded-3xl p-8 mb-5"
                style={{ background: "#fff", border: "1.5px solid #e2e8f0", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "#f5f3ff" }}>
                    <Code2 size={15} style={{ color: "#7c3aed" }} />
                  </div>
                  <h2 className="font-black text-base" style={{ color: "#0f172a" }}>Vos informations</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                  <Field label="Nom complet" required error={errors.client_name}>
                    <input type="text" placeholder="Jean Dupont" value={form.client_name}
                      onChange={e => update("client_name", e.target.value)}
                      onFocus={() => setFocusField("client_name")} onBlur={() => setFocusField(null)}
                      style={fieldStyle("client_name")} />
                  </Field>
                  <Field label="Email" required error={errors.client_email}>
                    <input type="email" placeholder="jean@exemple.com" value={form.client_email}
                      onChange={e => update("client_email", e.target.value)}
                      onFocus={() => setFocusField("client_email")} onBlur={() => setFocusField(null)}
                      style={fieldStyle("client_email")} />
                  </Field>
                  <Field label="Téléphone">
                    <input type="tel" placeholder="+1 (555) 000-0000" value={form.client_phone}
                      onChange={e => update("client_phone", e.target.value)}
                      onFocus={() => setFocusField("client_phone")} onBlur={() => setFocusField(null)}
                      style={fieldStyle("client_phone")} />
                  </Field>
                  <Field label="Entreprise / Organisation">
                    <input type="text" placeholder="Mon entreprise SARL" value={form.client_company}
                      onChange={e => update("client_company", e.target.value)}
                      onFocus={() => setFocusField("client_company")} onBlur={() => setFocusField(null)}
                      style={fieldStyle("client_company")} />
                  </Field>
                </div>
              </div>

              {/* ── Section 2 : Type de projet ── */}
              <div className="rounded-3xl p-8 mb-5"
                style={{ background: "#fff", border: "1.5px solid #e2e8f0", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "#eff6ff" }}>
                    <Monitor size={15} style={{ color: "#2563eb" }} />
                  </div>
                  <h2 className="font-black text-base" style={{ color: "#0f172a" }}>Type de projet</h2>
                </div>

                {errors.project_type && (
                  <p className="text-xs mb-3 flex items-center gap-1" style={{ color: "#dc2626" }}>
                    <AlertCircle size={11} /> {errors.project_type}
                  </p>
                )}

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
                  {PROJECT_TYPES.map(({ value, label, icon, desc }) => {
                    const sel = form.project_type === value;
                    return (
                      <motion.button
                        key={value} type="button"
                        whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                        onClick={() => update("project_type", value)}
                        className="p-4 rounded-2xl text-left transition-all duration-200"
                        style={{
                          background: sel ? "#f5f3ff" : "#f8fafc",
                          border: `1.5px solid ${sel ? "#7c3aed" : "#e2e8f0"}`,
                          boxShadow: sel ? "0 4px 14px rgba(124,58,237,0.15)" : "none",
                        }}
                      >
                        <div className="mb-2" style={{ color: sel ? "#7c3aed" : "#94a3b8" }}>{icon}</div>
                        <div className="font-bold text-xs mb-0.5" style={{ color: sel ? "#7c3aed" : "#0f172a" }}>{label}</div>
                        <div className="text-[10px]" style={{ color: "#94a3b8" }}>{desc}</div>
                      </motion.button>
                    );
                  })}
                </div>

                <Field label="Titre du projet">
                  <input type="text" placeholder="ex: Site de gestion de stock pour mon restaurant"
                    value={form.project_title}
                    onChange={e => update("project_title", e.target.value)}
                    onFocus={() => setFocusField("project_title")} onBlur={() => setFocusField(null)}
                    style={fieldStyle("project_title")} />
                </Field>
              </div>

              {/* ── Section 3 : Description & fonctionnalités ── */}
              <div className="rounded-3xl p-8 mb-5"
                style={{ background: "#fff", border: "1.5px solid #e2e8f0", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "#ecfdf5" }}>
                    <FileText size={15} style={{ color: "#059669" }} />
                  </div>
                  <h2 className="font-black text-base" style={{ color: "#0f172a" }}>Description du projet</h2>
                </div>

                <Field label="Description détaillée" required error={errors.description}>
                  <textarea rows={5} placeholder="Décrivez votre projet en détail : contexte, objectifs, public cible..."
                    value={form.description}
                    onChange={e => update("description", e.target.value)}
                    onFocus={() => setFocusField("description")} onBlur={() => setFocusField(null)}
                    style={{ ...fieldStyle("description"), resize: "vertical", lineHeight: 1.7 }} />
                </Field>

                <Field label="Fonctionnalités souhaitées">
                  <textarea rows={4}
                    placeholder="- Authentification utilisateur&#10;- Tableau de bord&#10;- Paiement en ligne&#10;- Notifications email..."
                    value={form.features}
                    onChange={e => update("features", e.target.value)}
                    onFocus={() => setFocusField("features")} onBlur={() => setFocusField(null)}
                    style={{ ...fieldStyle("features"), resize: "vertical", lineHeight: 1.7 }} />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                  <Field label="Technos préférées">
                    <div className="relative">
                      <Wrench size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "#94a3b8" }} />
                      <input type="text" placeholder="React, Supabase, Node.js..."
                        value={form.preferred_techs}
                        onChange={e => update("preferred_techs", e.target.value)}
                        onFocus={() => setFocusField("preferred_techs")} onBlur={() => setFocusField(null)}
                        style={{ ...fieldStyle("preferred_techs"), paddingLeft: 34 }} />
                    </div>
                  </Field>
                  <Field label="Sites de référence">
                    <div className="relative">
                      <Link size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: "#94a3b8" }} />
                      <input type="text" placeholder="https://exemple.com, https://..."
                        value={form.visual_references}
                        onChange={e => update("visual_references", e.target.value)}
                        onFocus={() => setFocusField("visual_references")} onBlur={() => setFocusField(null)}
                        style={{ ...fieldStyle("visual_references"), paddingLeft: 34 }} />
                    </div>
                  </Field>
                </div>
              </div>

              {/* ── Section 4 : Budget & Délai ── */}
              <div className="rounded-3xl p-8 mb-5"
                style={{ background: "#fff", border: "1.5px solid #e2e8f0", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>
                <div className="flex items-center gap-3 mb-6 pb-4" style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "#fffbeb" }}>
                    <Banknote size={15} style={{ color: "#d97706" }} />
                  </div>
                  <h2 className="font-black text-base" style={{ color: "#0f172a" }}>Budget & Délai</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-3"
                      style={{ color: "#64748b" }}>
                      Budget estimé <span style={{ color: "#7c3aed" }}>*</span>
                    </label>
                    {errors.budget_range && (
                      <p className="text-xs mb-2 flex items-center gap-1" style={{ color: "#dc2626" }}>
                        <AlertCircle size={11} /> {errors.budget_range}
                      </p>
                    )}
                    <div className="flex flex-col gap-2">
                      {BUDGETS.map(({ value, label }) => {
                        const sel = form.budget_range === value;
                        return (
                          <button key={value} type="button"
                            onClick={() => update("budget_range", value)}
                            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-150"
                            style={{
                              background: sel ? "#f5f3ff" : "#f8fafc",
                              border: `1.5px solid ${sel ? "#7c3aed" : "#e2e8f0"}`,
                              color: sel ? "#7c3aed" : "#475569",
                            }}>
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-3"
                      style={{ color: "#64748b" }}>
                      Délai souhaité <span style={{ color: "#7c3aed" }}>*</span>
                    </label>
                    {errors.deadline && (
                      <p className="text-xs mb-2 flex items-center gap-1" style={{ color: "#dc2626" }}>
                        <AlertCircle size={11} /> {errors.deadline}
                      </p>
                    )}
                    <div className="flex flex-col gap-2">
                      {DEADLINES.map(({ value, label }) => {
                        const sel = form.deadline === value;
                        return (
                          <button key={value} type="button"
                            onClick={() => update("deadline", value)}
                            className="px-4 py-2.5 rounded-xl text-sm font-semibold text-left transition-all duration-150"
                            style={{
                              background: sel ? "#fffbeb" : "#f8fafc",
                              border: `1.5px solid ${sel ? "#d97706" : "#e2e8f0"}`,
                              color: sel ? "#d97706" : "#475569",
                            }}>
                            <span className="flex items-center gap-2">
                              <Clock size={13} style={{ opacity: sel ? 1 : 0.4 }} />
                              {label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <Field label="Notes supplémentaires">
                    <textarea rows={3} placeholder="Toute information complémentaire utile..."
                      value={form.additional_notes}
                      onChange={e => update("additional_notes", e.target.value)}
                      onFocus={() => setFocusField("additional_notes")} onBlur={() => setFocusField(null)}
                      style={{ ...fieldStyle("additional_notes"), resize: "vertical", lineHeight: 1.7 }} />
                  </Field>
                </div>
              </div>

              {/* Error */}
              {saveError && (
                <div className="flex items-center gap-2 p-4 rounded-2xl mb-4 text-sm"
                  style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}>
                  <AlertCircle size={14} /> {saveError}
                </div>
              )}

              {/* Submit */}
              <motion.button
                onClick={handleSubmit} disabled={saving}
                whileHover={!saving ? { scale: 1.02, y: -1 } : {}}
                whileTap={!saving ? { scale: 0.98 } : {}}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-base text-white"
                style={{
                  background: saving ? "rgba(124,58,237,0.5)" : "linear-gradient(135deg, #7c3aed, #2563eb)",
                  border: "none", cursor: saving ? "not-allowed" : "pointer",
                  boxShadow: saving ? "none" : "0 6px 24px rgba(124,58,237,0.32)",
                }}
              >
                <Send size={16} />
                {saving ? "Envoi en cours..." : "Envoyer ma commande"}
                {!saving && <ChevronRight size={16} />}
              </motion.button>
            </motion.div>
          )}

          {/* ══ Already submitted — show summary ══ */}
          {step === 1 && order.form_completed && (
            <motion.div key="already"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="text-center py-10">
              <CheckCircle2 size={40} style={{ color: "#059669", margin: "0 auto 12px" }} />
              <h2 className="font-black text-xl mb-2" style={{ color: "#0f172a" }}>Formulaire déjà soumis</h2>
              <p className="text-sm mb-6" style={{ color: "#94a3b8" }}>Vous avez déjà envoyé votre commande.</p>
              <button onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm mx-auto"
                style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "#fff", border: "none", cursor: "pointer" }}>
                Laisser un avis <ChevronRight size={14} />
              </button>
            </motion.div>
          )}

          {/* ══ STEP 2 — Avis ══ */}
          {step === 2 && (
            <motion.div key="review"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {/* Hero */}
              <div className="rounded-3xl overflow-hidden mb-6"
                style={{ background: "linear-gradient(135deg, #059669, #0d9488)", boxShadow: "0 8px 32px rgba(5,150,105,0.22)" }}>
                <div className="p-8 relative overflow-hidden">
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 rounded-full opacity-10" style={{ background: "white" }} />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare size={14} color="rgba(255,255,255,0.7)" />
                      <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.6)" }}>
                        Votre avis
                      </span>
                    </div>
                    <h1 className="font-black text-2xl text-white mb-1">Partagez votre expérience</h1>
                    <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                      Votre retour m'aide à améliorer mes services. Merci pour votre confiance !
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl p-8 mb-5"
                style={{ background: "#fff", border: "1.5px solid #e2e8f0", boxShadow: "0 2px 16px rgba(0,0,0,0.04)" }}>

                {reviewSent ? (
                  <div className="text-center py-6">
                    <CheckCircle2 size={36} style={{ color: "#059669", margin: "0 auto 12px" }} />
                    <p className="font-bold text-lg mb-1" style={{ color: "#0f172a" }}>Avis déjà soumis</p>
                    <p className="text-sm" style={{ color: "#94a3b8" }}>Merci pour votre retour !</p>
                  </div>
                ) : (
                  <>
                    <div className="mb-6">
                      <label className="block text-xs font-bold uppercase tracking-wider mb-3"
                        style={{ color: "#64748b" }}>
                        Note globale <span style={{ color: "#7c3aed" }}>*</span>
                      </label>
                      <StarRating value={rating} onChange={setRating} />
                      {rating > 0 && (
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                          className="text-xs mt-2" style={{ color: "#f59e0b" }}>
                          {["", "Décevant", "Peut mieux faire", "Correct", "Très bien", "Excellent !"][rating]}
                        </motion.p>
                      )}
                    </div>

                    <Field label="Votre commentaire" required>
                      <textarea rows={5}
                        placeholder="Partagez votre expérience : qualité du travail, communication, respect des délais..."
                        value={comment} onChange={e => setComment(e.target.value)}
                        onFocus={() => setFocusField("comment")} onBlur={() => setFocusField(null)}
                        style={{ ...fieldStyle("comment"), resize: "vertical", lineHeight: 1.7 }} />
                    </Field>

                    {reviewError && (
                      <div className="flex items-center gap-2 p-3 rounded-xl mb-4 text-xs"
                        style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626" }}>
                        <AlertCircle size={12} /> {reviewError}
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button onClick={() => setStep(3)}
                        className="px-5 py-3 rounded-2xl text-sm font-semibold transition-colors"
                        style={{ background: "#f8fafc", color: "#64748b", border: "1.5px solid #e2e8f0", cursor: "pointer" }}>
                        <ChevronLeft size={14} style={{ display: "inline" }} /> Passer
                      </button>
                      <motion.button onClick={handleReview} disabled={saving}
                        whileHover={!saving ? { scale: 1.02 } : {}} whileTap={!saving ? { scale: 0.98 } : {}}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white"
                        style={{
                          background: saving ? "rgba(5,150,105,0.5)" : "linear-gradient(135deg,#059669,#0d9488)",
                          border: "none", cursor: saving ? "not-allowed" : "pointer",
                          boxShadow: saving ? "none" : "0 4px 16px rgba(5,150,105,0.28)",
                        }}>
                        <Send size={13} />
                        {saving ? "Envoi..." : "Soumettre mon avis"}
                      </motion.button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}

          {/* ══ STEP 3 — Confirmation finale ══ */}
          {step === 3 && (
            <motion.div key="done"
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="text-center py-10"
            >
              <motion.div
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: "linear-gradient(135deg, #7c3aed, #2563eb)", boxShadow: "0 8px 28px rgba(124,58,237,0.3)" }}
              >
                <CheckCircle2 size={36} color="white" />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "#7c3aed" }}>
                  Tout est bon !
                </div>
                <h2 className="font-black text-2xl mb-3" style={{ color: "#0f172a" }}>
                  Merci, {order.client_name.split(" ")[0]} !
                </h2>
                <div className="mx-auto mb-6" style={{ width: 40, height: 3, background: "linear-gradient(90deg,#7c3aed,#2563eb)", borderRadius: 2 }} />

                <div className="inline-block px-6 py-3 rounded-2xl mb-6"
                  style={{ background: "#f5f3ff", border: "1.5px solid rgba(124,58,237,0.15)" }}>
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#7c3aed" }}>
                    Référence
                  </div>
                  <div className="font-black text-xl tracking-widest" style={{ color: "#7c3aed" }}>
                    {order.reference}
                  </div>
                </div>

                <p className="text-sm mb-8 mx-auto max-w-sm" style={{ color: "#64748b", lineHeight: 1.8 }}>
                  Votre commande a bien été enregistrée. Je vous contacterai à <strong>{order.client_email}</strong> sous 24h avec un devis détaillé.
                </p>

                {/* Next steps */}
                <div className="text-left p-6 rounded-2xl max-w-sm mx-auto"
                  style={{ background: "#fff", border: "1.5px solid #e2e8f0" }}>
                  <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#94a3b8" }}>
                    Prochaines étapes
                  </div>
                  {[
                    { n: "1", text: "Analyse de votre besoin",         sub: "Sous 24h" },
                    { n: "2", text: "Envoi d'un devis personnalisé",   sub: "Avec délai et tarif" },
                    { n: "3", text: "Validation et démarrage",         sub: "Après votre accord" },
                  ].map(({ n, text, sub }) => (
                    <div key={n} className="flex items-start gap-3 mb-3 last:mb-0">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-black"
                        style={{ background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "#fff" }}>
                        {n}
                      </div>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: "#0f172a" }}>{text}</div>
                        <div className="text-xs" style={{ color: "#94a3b8" }}>{sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}