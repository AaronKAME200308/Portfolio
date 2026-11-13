import { useState } from "react";
import { Mail, Phone, MapPin, Send, Linkedin, Github, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import emailjs from "@emailjs/browser";

// ─── ⚙️  CONFIGURATION EMAILJS ───────────────────────────────────────────────
// Remplacez ces valeurs par vos identifiants EmailJS
// 1. Créez un compte sur https://emailjs.com
// 2. Créez un service (Gmail, Outlook…) → copiez le Service ID
// 3. Créez un Email Template        → copiez le Template ID
// 4. Allez dans Account → API Keys  → copiez la Public Key
const EMAILJS_SERVICE_ID  = "service_g1bupfs";
const EMAILJS_TEMPLATE_ID = "template_6wnehip";
const EMAILJS_PUBLIC_KEY  = "thwBzJSO7Ntifo4PK";

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
  { icon: Mail, label: "Email", value: "aaronmouele11@gmail.com", href: "mailto:aaronmouele11@gmail.com" },
  { icon: Phone, label: "Téléphone", value: "+237 670 464 488", href: "tel:+237670464488" },
  { icon: MapPin, label: "Localisation", value: "Yaoundé, Cameroun", href: null },
];

const socials = [
  { icon: Github, href: "https://github.com/AaronKAME200308", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/aaron-kame-mouele-b82619289/", label: "LinkedIn" },
];

type Status = "idle" | "loading" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-sage bg-cream px-3.5 py-3 text-sm text-forest placeholder:text-ink-mute/70 outline-none transition-colors duration-200 focus:border-aun focus:bg-white disabled:opacity-60";

const labelClass = "block font-mono-label !text-[10px] text-ink-mute mb-2";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status>("idle");
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
          from_name: form.name,
          from_email: form.email,
          subject: form.subject,
          message: form.message,
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

  const loading = status === "loading";

  return (
    <section id="contact" className="relative overflow-hidden bg-forest pt-24 pb-24 lg:pt-32 lg:pb-28">
      {/* Halo vert discret */}
      <div
        className="absolute -top-40 -left-40 w-[560px] h-[560px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{ background: "radial-gradient(circle, rgba(30,123,74,0.35), transparent 70%)" }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* ── En-tête ── */}
        <div className="mb-14">
          <motion.p {...fadeUp(0)} className="font-mono-label text-sage mb-5">
            <span className="text-moss">04 /</span> Contact
          </motion.p>
          <motion.h2
            {...fadeUp(0.1)}
            className="font-display font-extrabold leading-[1.05] max-w-2xl !text-cream"
            style={{ fontSize: "clamp(2.2rem, 4.6vw, 3.6rem)", letterSpacing: "-0.03em" }}
          >
            Faisons <span className="text-moss">pousser</span> votre projet.
          </motion.h2>
        </div>

        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-16 items-start">
          {/* ══ GAUCHE — Infos ══ */}
          <div>
            <motion.p {...fadeUp(0.15)} className="text-base leading-relaxed text-sage/80 mb-6 max-w-sm">
              Un projet en tête ? Une mission freelance ? Je réponds sous 24h.
            </motion.p>

            {/* Disponibilité */}
            <motion.span
              {...fadeUp(0.2)}
              className="inline-flex items-center gap-2.5 mb-8 px-3.5 py-2 rounded-full border border-moss/40 font-mono-label !text-[10px] text-moss"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-moss animate-ping opacity-60" />
                <span className="relative w-2 h-2 rounded-full bg-moss" />
              </span>
              Disponible pour de nouvelles missions
            </motion.span>

            <div className="flex flex-col gap-3">
              {contactItems.map(({ icon: Icon, label, value, href }, i) => (
                <motion.div
                  key={label}
                  {...fadeUp(0.25 + i * 0.08)}
                  className="flex items-center gap-4 rounded-[1.25rem] border border-white/10 bg-white/[0.04] p-4 transition-colors duration-300 hover:border-moss"
                >
                  <span className="w-11 h-11 shrink-0 rounded-xl bg-moss flex items-center justify-center">
                    <Icon size={18} className="text-forest" />
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono-label !text-[10px] text-moss m-0 mb-1">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        className="text-[15px] font-semibold text-cream no-underline break-all transition-colors duration-200 hover:text-moss"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-[15px] font-semibold text-cream m-0">{value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Réseaux */}
            <motion.div {...fadeUp(0.5)} className="flex items-center gap-4 mt-8">
              <span className="font-mono-label !text-[10px] text-sage/70">Réseaux</span>
              <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="keycap w-11 h-11 justify-center no-underline [--key-face:#f6f4ec] [--key-edge:#6f8f7a] [--key-text:#0e2f20]"
                >
                  <Icon size={17} />
                </a>
              ))}
            </motion.div>
          </div>

          {/* ══ DROITE — Formulaire (fenêtre) ══ */}
          <motion.div
            {...fadeUp(0.2)}
            className="rounded-[1.5rem] overflow-hidden bg-white border border-sage shadow-[0_20px_50px_-20px_rgba(0,0,0,0.5)]"
          >
            {/* Barre de fenêtre */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-sage/70 border-b border-sage">
              <span className="flex gap-1.5 shrink-0" aria-hidden="true">
                <i className="w-2.5 h-2.5 rounded-full bg-forest/20" />
                <i className="w-2.5 h-2.5 rounded-full bg-forest/20" />
                <i className="w-2.5 h-2.5 rounded-full bg-forest/20" />
              </span>
              <span className="flex-1 min-w-0 truncate rounded-md bg-white/80 px-3 py-1 font-mono text-[10.5px] text-ink-mute">
                nouveau-message.md
              </span>
            </div>

            <div className="p-7 md:p-9">
              <AnimatePresence mode="wait">
                {/* ── SUCCÈS ── */}
                {status === "success" && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="flex flex-col items-center justify-center text-center py-16 gap-4"
                  >
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
                      className="w-16 h-16 rounded-full bg-sage flex items-center justify-center"
                    >
                      <CheckCircle size={30} className="text-aun" />
                    </motion.span>
                    <h3 className="font-display font-bold text-2xl text-forest m-0" style={{ letterSpacing: "-0.01em" }}>
                      Message envoyé !
                    </h3>
                    <p className="text-sm text-ink-mute m-0">Je vous répondrai dans les plus brefs délais.</p>
                  </motion.div>
                )}

                {/* ── FORMULAIRE (idle / loading / error) ── */}
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
                      <h3 className="font-display font-bold text-2xl text-forest m-0 mb-1" style={{ letterSpacing: "-0.01em" }}>
                        Envoyez un message
                      </h3>
                      <p className="font-mono-label !text-[10px] text-ink-mute m-0">Tous les champs * sont requis</p>
                    </div>

                    <AnimatePresence>
                      {status === "error" && (
                        <motion.div
                          initial={{ opacity: 0, y: -8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          role="alert"
                          className="flex items-start gap-3 p-3.5 rounded-xl border border-[#8c2f1f]/25 bg-[#8c2f1f]/[0.07]"
                        >
                          <AlertCircle size={16} className="shrink-0 mt-0.5 text-[#8c2f1f]" />
                          <p className="text-xs leading-relaxed text-[#8c2f1f] m-0">{errMsg}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="c-name" className={labelClass}>Nom *</label>
                        <input
                          id="c-name" type="text" name="name" required placeholder="Votre nom"
                          value={form.name} onChange={handleChange} disabled={loading}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="c-email" className={labelClass}>Email *</label>
                        <input
                          id="c-email" type="email" name="email" required placeholder="votre@email.com"
                          value={form.email} onChange={handleChange} disabled={loading}
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="c-subject" className={labelClass}>Sujet *</label>
                      <input
                        id="c-subject" type="text" name="subject" required placeholder="Sujet de votre message"
                        value={form.subject} onChange={handleChange} disabled={loading}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label htmlFor="c-message" className={labelClass}>Message *</label>
                      <textarea
                        id="c-message" name="message" required rows={5}
                        placeholder="Décrivez votre projet ou votre demande..."
                        value={form.message} onChange={handleChange} disabled={loading}
                        className={`${inputClass} resize-y leading-relaxed`}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="keycap w-full justify-center gap-2 px-6 py-4 text-sm font-semibold disabled:opacity-60 disabled:cursor-not-allowed [--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#ffffff]"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={15} className="animate-spin" />
                          Envoi en cours…
                        </>
                      ) : (
                        <>
                          <Send size={15} />
                          Envoyer le message
                        </>
                      )}
                    </button>
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