import { useMemo, useRef, useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Linkedin,
  Github,
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Globe,
  AppWindow,
  Smartphone,
  Server,
  Brain,
  Sparkles,
  Check,
  type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import supabase from "../services/supabase";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: EASE },
});

/* ── Données modifiables ── */
const TYPES: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "web", label: "Site web", icon: Globe },
  { id: "app", label: "Application web", icon: AppWindow },
  { id: "mobile", label: "Application mobile", icon: Smartphone },
  { id: "api", label: "API / Back-end", icon: Server },
  { id: "ia", label: "IA / Vision", icon: Brain },
  { id: "autre", label: "Autre idée", icon: Sparkles },
];

// La base n'accepte qu'un type principal : on prend le premier choisi.
// La liste complète des types reste dans la description du brief.
const TYPE_MAP: Record<string, string> = {
  web: "site_vitrine",
  app: "application_web",
  mobile: "application_mobile",
  api: "application_web",
  ia: "autre",
  autre: "autre",
};

// Mêmes paliers que la page /order : seul le libellé est affiché au visiteur
const BUDGETS = [
  { label: "Moins de 300 000 FCFA", value: "palier_1" },
  { label: "300 000 – 600 000 FCFA", value: "palier_2" },
  { label: "600 000 – 1 800 000 FCFA", value: "palier_3" },
  { label: "1 800 000 – 3 000 000 FCFA", value: "palier_4" },
  { label: "Plus de 3 000 000 FCFA", value: "palier_5" },
  { label: "À discuter", value: "a_discuter" },
];

const DELAIS = [
  { label: "Urgent (moins de 2 semaines)", value: "urgent_2sem" },
  { label: "Environ 1 mois", value: "1mois" },
  { label: "2 à 3 mois", value: "2_3mois" },
  { label: "Plus de 3 mois", value: "plus_3mois" },
  { label: "Je suis flexible", value: "flexible" },
];

const STEPS = ["Type de projet", "Budget et délai", "Tes coordonnées"];

const contactItems = [
  { icon: Mail, label: "Email", value: "aaronmouele11pro@gmail.com", href: "mailto:aaronmouele11pro@gmail.com" },
  { icon: Phone, label: "Téléphone", value: "+237 670 464 488", href: "tel:+237670464488" },
  { icon: MapPin, label: "Localisation", value: "Yaoundé, Cameroun", href: null as string | null },
];

const socials = [
  { icon: Github, href: "https://github.com/AaronKAME200308", label: "GitHub" },
  { icon: Linkedin, href: "https://www.linkedin.com/in/aaron-kame-mouele-b82619289/", label: "LinkedIn" },
];

type Status = "idle" | "loading" | "success" | "error";

/* Sur mobile/tablette (< 1024 px) le ticket est sous le formulaire : on fait défiler la page vers un élément */
const scrollOnSmall = (el: HTMLElement | null, block: ScrollLogicalPosition) => {
  if (!el || !window.matchMedia("(max-width: 1023px)").matches) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block });
};

/* Traduit les erreurs levées par la fonction SQL submit_contact */
const contactError = (err: unknown) => {
  const m = String((err as { message?: string })?.message ?? "");
  if (m.includes("rate_limited")) return "Trop d'envois récents. Réessayez dans une heure ou écrivez-moi directement par email.";
  if (m.includes("invalid_email")) return "Adresse email invalide.";
  if (m.includes("invalid_name")) return "Nom invalide.";
  if (m.includes("invalid_description")) return "Message trop court (10 caractères minimum).";
  return "Une erreur est survenue. Veuillez réessayer ou me contacter directement par email.";
};

/* Bord de papier déchiré (crème) vers le footer */
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
    <svg
      viewBox="0 0 1440 40"
      preserveAspectRatio="none"
      className="absolute bottom-0 left-0 w-full h-7 lg:h-10 z-30"
      style={{ filter: "drop-shadow(0 -2px 3px rgba(0,0,0,0.25))" }}
      aria-hidden="true"
    >
      <path d={d} fill={fill} />
    </svg>
  );
}

/* ── Encoches du ticket (masques) ── */
const NOTCH = 11;
const notchMask = (edge: "bottom" | "top"): React.CSSProperties => {
  const y = edge === "bottom" ? "100%" : "0";
  const g = (x: string) => `radial-gradient(circle ${NOTCH}px at ${x} ${y}, #0000 98%, #000)`;
  return {
    WebkitMaskImage: `${g("0")}, ${g("100%")}`,
    maskImage: `${g("0")}, ${g("100%")}`,
    WebkitMaskComposite: "source-in",
    maskComposite: "intersect",
  };
};

/* ── Touche de clavier à bascule ── */
function Key({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      style={
        on
          ? {
              transform: "translateY(4px)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25), 0 1px 0 var(--key-edge), 0 3px 6px rgba(0,0,0,0.25)",
            }
          : undefined
      }
      className={`keycap px-4 py-3 text-sm font-semibold text-left justify-start ${
        on
          ? "[--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#ffffff]"
          : "[--key-face:#ffffff] [--key-edge:#a9bcae] [--key-text:#0e2f20]"
      }`}
    >
      {children}
    </button>
  );
}

const field =
  "w-full px-3.5 py-3 rounded-xl text-sm text-ink bg-white border-[1.5px] border-sage outline-none transition-all duration-200 placeholder:text-ink-mute/60 focus:border-aun focus:ring-4 focus:ring-aun/15 disabled:opacity-60";
const label = "block font-mono-label !text-[10px] text-ink-mute mb-2";

type Brief = { types: string[]; budget: string; delai: string; name: string; email: string; message: string };

const EMPTY_BRIEF: Brief = { types: [], budget: "", delai: "", name: "", email: "", message: "" };

/* ── Aperçu live : le ticket se compose pendant la saisie ── */
function Preview({ brief, status }: { brief: Brief; status: Status }) {
  const reduce = useReducedMotion();
  const typeLabels = brief.types.map((id) => TYPES.find((t) => t.id === id)?.label ?? id);
  const today = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

  const Row = ({ k, children, filled }: { k: string; children: React.ReactNode; filled: boolean }) => (
    <div className="flex gap-4 py-2.5 border-b border-dashed border-[#c9d5c9] last:border-0">
      <span className="font-mono-label !text-[10px] text-ink-mute w-16 shrink-0 pt-0.5">{k}</span>
      <div className={`text-sm min-w-0 flex-1 transition-colors ${filled ? "text-forest font-semibold" : "text-ink-mute/40"}`}>
        {children}
      </div>
    </div>
  );

  return (
    <div className="relative" style={{ filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.35))" }}>
      <div className="bg-cream rounded-t-[1.25rem] px-6 pt-5 pb-6" style={notchMask("bottom")}>
        <div className="flex items-center justify-between mb-4">
          <span className="font-mono-label !text-[10px] text-aun">Aperçu · brief de projet</span>
          <span className="font-mono text-[10px] text-ink-mute">{today}</span>
        </div>

        <Row k="De" filled={!!brief.name}>{brief.name || "Ton nom"}</Row>
        <Row k="Email" filled={!!brief.email}><span className="break-all">{brief.email || "ton@email.com"}</span></Row>
        <Row k="Projet" filled={typeLabels.length > 0}>
          {typeLabels.length ? (
            <span className="flex flex-wrap gap-1.5">
              {typeLabels.map((t) => (
                <span key={t} className="px-2 py-0.5 rounded-md bg-sage font-mono text-[11px] text-forest font-medium">{t}</span>
              ))}
            </span>
          ) : (
            "Type de projet"
          )}
        </Row>
        <Row k="Budget" filled={!!brief.budget}>{brief.budget || "Ta fourchette"}</Row>
        <Row k="Délai" filled={!!brief.delai}>{brief.delai || "Ton délai"}</Row>
        <Row k="Message" filled={!!brief.message}>
          <span className="line-clamp-5 whitespace-pre-line font-normal">{brief.message || "Ton message apparaîtra ici…"}</span>
        </Row>
      </div>

      <div className="relative bg-[#e6eee4] rounded-b-[1.25rem] px-6 py-4" style={notchMask("top")}>
        <div className="absolute top-0 left-[14px] right-[14px] border-t-2 border-dashed border-[#b9c9bb]" aria-hidden="true" />
        <p className="m-0 font-mono text-[11px] text-ink-mute leading-relaxed">
          → Aaron KAME MOUELE · Yaoundé
          <br />→ Réponse sous 24h
        </p>
      </div>

      {/* Tampon à l'envoi */}
      <AnimatePresence>
        {status === "success" && (
          <motion.div
            key="stamp"
            initial={reduce ? { opacity: 0.92 } : { opacity: 0, scale: 2.4, rotate: -4 }}
            animate={{ opacity: 0.92, scale: 1, rotate: -14 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 380, damping: 16 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            aria-hidden="true"
          >
            <div
              className="px-6 py-2 rounded-xl font-display font-extrabold text-4xl text-aun border-[5px] border-aun bg-cream/50"
              style={{ letterSpacing: "0.08em", boxShadow: "inset 0 0 0 3px #f6f4ec, 0 0 0 2px rgba(30,123,74,0.4)" }}
            >
              ENVOYÉ
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const [step, setStep] = useState(0);
  const [brief, setBrief] = useState<Brief>(EMPTY_BRIEF);
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");
  const [hint, setHint] = useState("");
  const [hp, setHp] = useState(""); // champ piège anti-robots (doit rester vide)
  const formRef = useRef<HTMLDivElement>(null);   // fenêtre du formulaire
  const ticketRef = useRef<HTMLDivElement>(null); // ticket d'aperçu

  const set = <K extends keyof Brief>(k: K, v: Brief[K]) => setBrief((b) => ({ ...b, [k]: v }));
  const toggleType = (id: string) =>
    set("types", brief.types.includes(id) ? brief.types.filter((t) => t !== id) : [...brief.types, id]);

  const canNext = step === 0 ? brief.types.length > 0 : step === 1 ? !!brief.budget && !!brief.delai : true;

  const next = () => {
    if (!canNext) {
      setHint(step === 0 ? "Choisis au moins un type de projet." : "Choisis un budget et un délai (« À discuter » convient).");
      return;
    }
    setHint("");
    setStep((s) => s + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) return; // garde-fou : on n'envoie qu'à la dernière étape
    setStatus("loading");
    setErrMsg("");

    const typeLabels = brief.types.map((id) => TYPES.find((t) => t.id === id)?.label ?? id).join(", ");
    const fullMessage = [
      `Type de projet : ${typeLabels}`,
      `Budget : ${brief.budget}`,
      `Délai : ${brief.delai}`,
      "",
      "Message :",
      brief.message,
    ].join("\n");

    const budget = BUDGETS.find((b) => b.label === brief.budget)?.value;
    const deadline = DELAIS.find((d) => d.label === brief.delai)?.value;

    try {
      const { error } = await supabase.rpc("submit_contact", {
        p: {
          client_name: brief.name,
          client_email: brief.email,
          project_type: TYPE_MAP[brief.types[0]],
          project_title: `Contact : ${typeLabels}`,
          description: fullMessage,
          budget_range: budget,
          budget_currency: "XAF",
          deadline,
          website: hp,
        },
      });
      if (error) throw error;

      setStatus("success");
      // Mobile : on descend vers le ticket, centré, pour voir le tampon ENVOYÉ
      setTimeout(() => scrollOnSmall(ticketRef.current, "center"), 120);

      // Retour au début après 7 s, puis on remonte vers le formulaire
      setTimeout(() => {
        setBrief(EMPTY_BRIEF);
        setStep(0);
        setStatus("idle");
        setTimeout(() => scrollOnSmall(formRef.current, "start"), 50);
      }, 7000);
    } catch (err: unknown) {
      console.error("Contact error:", err);
      setErrMsg(contactError(err));
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-forest pt-24 pb-32 lg:pt-32 lg:pb-40">
      {/* Halo vert discret */}
      <div
        className="absolute -bottom-48 -left-40 w-[560px] h-[560px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{ background: "radial-gradient(circle, rgba(30,123,74,0.35), transparent 70%)" }}
      />

      <div className="relative max-w-6xl mx-auto px-6">
        {/* ══ EN-TÊTE ══ */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div>
            <motion.p {...fadeUp(0)} className="font-mono-label text-sage mb-5">
              <span className="text-moss">04 /</span> Contact
            </motion.p>
            <motion.h2
              {...fadeUp(0.1)}
              className="font-display font-extrabold leading-[1.05] mb-5 !text-cream"
              style={{ fontSize: "clamp(2.2rem, 4.6vw, 3.6rem)", letterSpacing: "-0.03em" }}
            >
              Faisons pousser <span className="text-moss">votre projet.</span>
            </motion.h2>
            <motion.p {...fadeUp(0.2)} className="text-sage/75 leading-relaxed max-w-md m-0">
              Trois petites étapes pour me décrire ton idée : je reviens vers toi avec une proposition sous 24h.
            </motion.p>
          </div>

          <motion.div {...fadeUp(0.3)} className="flex items-center gap-3">
            <span className="font-mono-label !text-[10px] text-moss">Réseaux</span>
            {socials.map(({ icon: Icon, href, label: l }) => (
              <a
                key={l}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={l}
                className="keycap w-11 h-11 [--key-face:#1c4a34] [--key-edge:#06150e] [--key-text:#f6f4ec]"
              >
                <Icon size={17} />
              </a>
            ))}
          </motion.div>
        </div>

        {/* ══ COORDONNÉES ══ */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {contactItems.map(({ icon: Icon, label: l, value, href }, i) => (
            <motion.div
              key={l}
              {...fadeUp(0.25 + i * 0.08)}
              className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl bg-white/[0.05] border border-white/10 min-w-0"
            >
              <span className="w-10 h-10 rounded-xl bg-moss flex items-center justify-center shrink-0">
                <Icon size={16} className="text-forest" />
              </span>
              <div className="min-w-0">
                <p className="font-mono-label !text-[10px] text-moss mb-0.5">{l}</p>
                {href ? (
                  <a href={href} className="text-sm font-semibold text-cream no-underline transition-colors hover:text-moss break-all">
                    {value}
                  </a>
                ) : (
                  <p className="text-sm font-semibold text-cream m-0">{value}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* ══ BRIEF GUIDÉ + APERÇU ══ */}
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-10 items-start">
          {/* ── Fenêtre : brief en 3 étapes ── */}
          <motion.div
            ref={formRef}
            {...fadeUp(0.2)}
            className="relative min-w-0 scroll-mt-20 rounded-[1.5rem] overflow-hidden bg-cream shadow-[0_24px_50px_-12px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-2 px-5 py-3 bg-sage border-b border-[#c3d6c6]">
              <i className="w-2.5 h-2.5 rounded-full bg-forest/25" />
              <i className="w-2.5 h-2.5 rounded-full bg-forest/25" />
              <i className="w-2.5 h-2.5 rounded-full bg-forest/25" />
              <span className="ml-3 font-mono text-[11px] text-forest/70">nouveau-projet.eml</span>
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8">
              {/* Progression */}
              <div className="mb-6">
                <div className="flex gap-2 mb-3" role="progressbar" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step + 1}>
                  {STEPS.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= step ? "bg-aun" : "bg-sage"}`}
                    />
                  ))}
                </div>
                <p className="m-0 font-mono-label !text-[10px] text-ink-mute">
                  Étape {step + 1}/3 · <span className="text-aun">{STEPS[step]}</span>
                </p>
              </div>

              <div className="min-h-[300px]">
                <AnimatePresence mode="wait" initial={false}>
                  {/* ÉTAPE 1 */}
                  {step === 0 && (
                    <motion.div
                      key="s1"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      <h3 className="font-display font-bold text-xl mb-1">Qu'est-ce qu'on construit ?</h3>
                      <p className="text-xs text-ink-mute mb-5">Tu peux en choisir plusieurs.</p>
                      <div className="grid sm:grid-cols-2 gap-x-4 gap-y-5 pb-2">
                        {TYPES.map(({ id, label: l, icon: Icon }) => (
                          <Key key={id} on={brief.types.includes(id)} onClick={() => toggleType(id)}>
                            <Icon size={16} />
                            {l}
                            {brief.types.includes(id) && <Check size={14} className="ml-auto" />}
                          </Key>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ÉTAPE 2 */}
                  {step === 1 && (
                    <motion.div
                      key="s2"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25, ease: EASE }}
                    >
                      <h3 className="font-display font-bold text-xl mb-1">Budget et délai</h3>
                      <p className="text-xs text-ink-mute mb-5">Une estimation suffit, on affinera ensemble.</p>

                      <p className={label}>Budget</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-4 mb-6 pb-1">
                        {BUDGETS.map((b) => (
                          <Key key={b.value} on={brief.budget === b.label} onClick={() => set("budget", b.label)}>
                            {b.label}
                          </Key>
                        ))}
                      </div>

                      <p className={label}>Délai souhaité</p>
                      <div className="flex flex-wrap gap-x-3 gap-y-4 pb-1">
                        {DELAIS.map((d) => (
                          <Key key={d.value} on={brief.delai === d.label} onClick={() => set("delai", d.label)}>
                            {d.label}
                          </Key>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* ÉTAPE 3 */}
                  {step === 2 && (
                    <motion.div
                      key="s3"
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -16 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="font-display font-bold text-xl mb-1">Où te répondre ?</h3>
                        <p className="text-xs text-ink-mute m-0">Tous les champs sont requis.</p>
                      </div>

                      <AnimatePresence>
                        {status === "error" && (
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -8 }}
                            role="alert"
                            className="flex items-start gap-3 p-3 rounded-xl bg-[#fef2f2] border-[1.5px] border-[#fecaca]"
                          >
                            <AlertCircle size={16} className="text-[#dc2626] shrink-0 mt-px" />
                            <p className="text-xs leading-relaxed text-[#b91c1c] m-0">{errMsg}</p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="c-name" className={label}>Nom *</label>
                          <input
                            id="c-name" type="text" required placeholder="Votre nom"
                            value={brief.name} onChange={(e) => set("name", e.target.value)}
                            disabled={status === "loading" || status === "success"} className={field}
                          />
                        </div>
                        <div>
                          <label htmlFor="c-email" className={label}>Email *</label>
                          <input
                            id="c-email" type="email" required placeholder="votre@email.com"
                            value={brief.email} onChange={(e) => set("email", e.target.value)}
                            disabled={status === "loading" || status === "success"} className={field}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="c-message" className={label}>Message *</label>
                        <textarea
                          id="c-message" required rows={5} minLength={10} placeholder="Décrivez votre projet en quelques lignes..."
                          value={brief.message} onChange={(e) => set("message", e.target.value)}
                          disabled={status === "loading" || status === "success"}
                          className={`${field} resize-y leading-relaxed`}
                        />
                      </div>

                      {/* Champ piège : invisible pour les humains, rempli par les robots */}
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        value={hp}
                        onChange={(e) => setHp(e.target.value)}
                        style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0, width: 0 }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {hint && (
                <p role="alert" className="mt-4 mb-0 text-xs text-[#b45309] font-semibold">{hint}</p>
              )}

              {/* Navigation */}
              <div className="flex gap-4 mt-6 pb-1">
                {step > 0 && status !== "success" && (
                  <button
                    type="button"
                    onClick={() => { setHint(""); setStep((s) => s - 1); }}
                    className="keycap px-5 py-3.5 text-sm font-semibold [--key-face:#ffffff] [--key-edge:#a9bcae] [--key-text:#0e2f20]"
                  >
                    <ArrowLeft size={15} /> Retour
                  </button>
                )}
                {step < 2 ? (
                  <button
                    key="next"
                    type="button"
                    onClick={next}
                    className="keycap flex-1 py-3.5 text-sm font-semibold [--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#ffffff]"
                  >
                    Suivant <ArrowRight size={15} />
                  </button>
                ) : (
                  <button
                    key="send"
                    type="submit"
                    disabled={status === "loading" || status === "success"}
                    className="keycap flex-1 py-3.5 text-sm font-semibold disabled:opacity-70 disabled:cursor-not-allowed [--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#ffffff]"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Envoi en cours…
                      </>
                    ) : status === "success" ? (
                      <>
                        <Check size={15} />
                        Message envoyé !
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        Envoyer le brief
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* ── Aperçu live ── */}
          <motion.div ref={ticketRef} {...fadeUp(0.3)} className="min-w-0 lg:sticky lg:top-24">
            <Preview brief={brief} status={status} />
          </motion.div>
        </div>
      </div>

      <TornEdge />
    </section>
  );
}