import { useState } from "react";
import { Mail, Phone, MapPin, Send, Linkedin, Github, CheckCircle, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

// ─── ⚙️  CONFIGURATION EMAILJS ───────────────────────────────────────────────
// Remplacez ces valeurs par vos identifiants EmailJS
// 1. Créez un compte sur https://emailjs.com
// 2. Créez un service (Gmail, Outlook…) → copiez le Service ID
// 3. Créez un Email Template        → copiez le Template ID
// 4. Allez dans Account → API Keys  → copiez la Public Key
const EMAILJS_SERVICE_ID  = "service_g1bupfs";   // ex: "service_abc123"
const EMAILJS_TEMPLATE_ID = "template_6wnehip";  // ex: "template_xyz789"
const EMAILJS_PUBLIC_KEY  = "thwBzJSO7Ntifo4PK";   // ex: "aBcDeFgHiJkLmNoPq"

// Template variables attendues dans votre template EmailJS :
//   {{from_name}}    → nom de l'expéditeur
//   {{from_email}}   → email de l'expéditeur
//   {{subject}}      → sujet
//   {{message}}      → corps du message
// ─────────────────────────────────────────────────────────────────────────────

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: EASE },
});

const contactItems = [
  {
    icon: Mail,
    label: "Email",
    value: "aaronmouele11@gmail.com",
    href: "mailto:aaronmouele11@gmail.com",
    color: "#7c3aed",
    bg: "#f5f3ff",
  },
  {
    icon: Phone,
    label: "Téléphone",
    value: "+237 670 464 488",
    href: "tel:+237670464488",
    color: "#2563eb",
    bg: "#eff6ff",
  },
  {
    icon: MapPin,
    label: "Localisation",
    value: "Yaoundé, Cameroun",
    href: null,
    color: "#059669",
    bg: "#ecfdf5",
  },
];

const socials = [
  { icon: Github,   href: "https://github.com/AaronKAME200308",                        label: "GitHub"   },
  { icon: Linkedin, href: "https://www.linkedin.com/in/aaron-kame-mouele-b82619289/",  label: "LinkedIn" },
];

type Status = "idle" | "loading" | "success" | "error";

export default function Contact() {
  const [form, setForm]     = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
  const [focus, setFocus]   = useState<string | null>(null);
  const [errMsg, setErrMsg] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrMsg("");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:  form.name,
          from_email: form.email,
          subject:    form.subject,
          message:    form.message,
        },
        EMAILJS_PUBLIC_KEY
      );

      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });

      // Retour au formulaire après 4 s
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err: unknown) {
      console.error("EmailJS error:", err);
      setErrMsg("Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.");
      setStatus("error");
    }
  };

  const fieldStyle = (name: string): React.CSSProperties => ({
    width: "100%",
    padding: "11px 14px",
    borderRadius: 12,
    fontSize: 14,
    border: `1.5px solid ${focus === name ? "#7c3aed" : "#e2e8f0"}`,
    background: focus === name ? "#faf8ff" : "#f8fafc",
    fontFamily: "inherit",
    color: "#0f172a",
    outline: "none",
    transition: "all 0.2s ease",
    boxSizing: "border-box" as const,
  });

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    color: "#94a3b8",
    marginBottom: 6,
  };

  return (
    <section id="contact" className="py-28 overflow-hidden" style={{ background: "#f8fafc" }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Header ── */}
        <motion.div {...fadeUp(0)}>
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-12" style={{ background: "#7c3aed", opacity: 0.4 }} />
            <span className="font-semibold text-sm uppercase tracking-widest" style={{ color: "#7c3aed" }}>
              Contact
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* ══ LEFT — Info + timeline ══ */}
          <div>
            <motion.h2
              {...fadeUp(0.1)}
              className="font-black leading-tight mb-4"
              style={{
                fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
                color: "#0f172a",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              Travaillons{" "}
              <span style={{
                background: "linear-gradient(90deg, #7c3aed, #2563eb)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                ensemble
              </span>
            </motion.h2>

            <motion.p {...fadeUp(0.2)} className="text-slate-600 leading-relaxed mb-10 max-w-sm">
              Un projet en tête ? Une mission freelance ? Je réponds sous 24h.
            </motion.p>

            {/* Timeline contact infos */}
            <div className="relative">
              <div
                className="absolute left-5 top-5 bottom-5 w-px"
                style={{ background: "linear-gradient(180deg, #7c3aed33, #2563eb22, transparent)" }}
              />
              <div className="flex flex-col gap-5">
                {contactItems.map(({ icon: Icon, label, value, href, color, bg }, i) => (
                  <motion.div key={label} {...fadeUp(0.25 + i * 0.1)} className="flex items-center gap-4 relative">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10"
                      style={{ background: bg, border: `1.5px solid ${color}22`, boxShadow: `0 2px 10px ${color}14` }}
                    >
                      <Icon size={16} style={{ color }} />
                    </div>
                    <div className="flex-1 p-4 rounded-2xl" style={{ background: "#fff", border: "1.5px solid #e2e8f0" }}>
                      <p className="text-xs font-semibold uppercase tracking-wide mb-0.5" style={{ color: "#94a3b8" }}>
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-sm font-semibold transition-colors duration-200"
                          style={{ color: "#0f172a", textDecoration: "none" }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = color}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#0f172a"}
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm font-semibold" style={{ color: "#0f172a" }}>{value}</p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Socials */}
            <motion.div {...fadeUp(0.6)} className="flex items-center gap-3 mt-8">
              <span className="text-xs font-medium tracking-wide uppercase" style={{ color: "#94a3b8" }}>Réseaux</span>
              <div className="h-px flex-1" style={{ background: "#e2e8f0" }} />
              {socials.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "#fff", border: "1.5px solid #e2e8f0", color: "#94a3b8", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.color = "#7c3aed";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.3)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.color = "#94a3b8";
                    (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
                  }}
                >
                  <Icon size={17} />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* ══ RIGHT — Form ══ */}
          <motion.div
            {...fadeUp(0.2)}
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "#fff",
              border: "1.5px solid #e2e8f0",
              boxShadow: "0 4px 32px rgba(124,58,237,0.07)",
            }}
          >
            {/* Left accent bar */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 rounded-l-3xl"
              style={{ background: "linear-gradient(180deg, #7c3aed, #3b82f6, #059669)" }}
            />

            <div className="p-8 pl-10">
              <AnimatePresence mode="wait">

                {/* ── SUCCESS ── */}
                {status === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="flex flex-col items-center justify-center text-center py-16 gap-4"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                      className="w-16 h-16 rounded-full flex items-center justify-center"
                      style={{ background: "#ecfdf5" }}
                    >
                      <CheckCircle size={32} style={{ color: "#059669" }} />
                    </motion.div>
                    <h3 className="font-black text-xl" style={{ color: "#0f172a", fontFamily: "'Syne', sans-serif" }}>
                      Message envoyé !
                    </h3>
                    <p className="text-sm" style={{ color: "#64748b" }}>
                      Je vous répondrai dans les plus brefs délais.
                    </p>
                  </motion.div>
                )}

                {/* ── FORM (idle / loading / error) ── */}
                {status !== "success" && (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    <div>
                      <h3 className="font-black text-xl mb-1" style={{ color: "#0f172a", fontFamily: "'Syne', sans-serif" }}>
                        Envoyez un message
                      </h3>
                      <p className="text-xs" style={{ color: "#94a3b8" }}>Tous les champs marqués * sont requis</p>
                    </div>

                    {/* Error banner */}
                    <AnimatePresence>
                      {status === "error" && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          className="flex items-start gap-3 p-3 rounded-xl"
                          style={{ background: "#fef2f2", border: "1.5px solid #fecaca" }}
                        >
                          <AlertCircle size={16} style={{ color: "#dc2626", flexShrink: 0, marginTop: 1 }} />
                          <p className="text-xs leading-relaxed" style={{ color: "#b91c1c" }}>{errMsg}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Name + Email */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label style={labelStyle}>Nom *</label>
                        <input
                          type="text" name="name" required placeholder="Votre nom"
                          value={form.name} onChange={handleChange}
                          onFocus={() => setFocus("name")} onBlur={() => setFocus(null)}
                          style={fieldStyle("name")}
                          disabled={status === "loading"}
                        />
                      </div>
                      <div>
                        <label style={labelStyle}>Email *</label>
                        <input
                          type="email" name="email" required placeholder="votre@email.com"
                          value={form.email} onChange={handleChange}
                          onFocus={() => setFocus("email")} onBlur={() => setFocus(null)}
                          style={fieldStyle("email")}
                          disabled={status === "loading"}
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label style={labelStyle}>Sujet *</label>
                      <input
                        type="text" name="subject" required placeholder="Sujet de votre message"
                        value={form.subject} onChange={handleChange}
                        onFocus={() => setFocus("subject")} onBlur={() => setFocus(null)}
                        style={fieldStyle("subject")}
                        disabled={status === "loading"}
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label style={labelStyle}>Message *</label>
                      <textarea
                        name="message" required rows={5}
                        placeholder="Décrivez votre projet ou votre demande..."
                        value={form.message} onChange={handleChange}
                        onFocus={() => setFocus("message")} onBlur={() => setFocus(null)}
                        style={{ ...fieldStyle("message"), resize: "vertical", lineHeight: 1.65 }}
                        disabled={status === "loading"}
                      />
                    </div>

                    {/* Submit */}
                    <motion.button
                      type="submit"
                      whileHover={status !== "loading" ? { scale: 1.02, y: -1 } : {}}
                      whileTap={status !== "loading" ? { scale: 0.97 } : {}}
                      disabled={status === "loading"}
                      className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-bold text-white"
                      style={{
                        background: status === "loading"
                          ? "linear-gradient(135deg, #a78bfa, #93c5fd)"
                          : "linear-gradient(135deg, #7c3aed, #3b82f6)",
                        border: "none",
                        cursor: status === "loading" ? "not-allowed" : "pointer",
                        boxShadow: "0 6px 20px rgba(124,58,237,0.28)",
                        transition: "background 0.3s ease",
                      }}
                    >
                      {status === "loading" ? (
                        <>
                          <Loader2 size={14} className="animate-spin" />
                          Envoi en cours…
                        </>
                      ) : (
                        <>
                          <Send size={14} />
                          Envoyer le message
                          <ArrowRight size={13} />
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}