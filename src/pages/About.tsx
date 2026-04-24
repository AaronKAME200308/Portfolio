import { GraduationCap, Briefcase, MapPin, Heart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: EASE },
});

const highlights = [
  {
    icon: GraduationCap,
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "rgba(124,58,237,0.15)",
    title: "Formation",
    text: "Licence en Génie Informatique",
  },
  {
    icon: Briefcase,
    color: "#2563eb",
    bg: "#eff6ff",
    border: "rgba(37,99,235,0.15)",
    title: "Statut",
    text: "Freelance disponible pour missions",
  },
  {
    icon: MapPin,
    color: "#059669",
    bg: "#ecfdf5",
    border: "rgba(5,150,105,0.15)",
    title: "Localisation",
    text: "Yaoundé, Cameroun",
  },
  {
    icon: Heart,
    color: "#e11d48",
    bg: "#fff1f2",
    border: "rgba(225,29,72,0.15)",
    title: "Passion",
    text: "IA, interfaces créatives & clean code",
  },
];

const stats = [
  { value: "5+",  label: "Projets livrés",   color: "#7c3aed" },
  { value: "3+",  label: "Ans d'expérience", color: "#2563eb" },
  { value: "∞",   label: "Lignes de code",   color: "#059669" },
];

export default function About() {
  return (
    <section id="about" className="py-28 overflow-hidden" style={{ background: "#fff" }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Section label ── */}
        <motion.div {...fadeUp(0)}>
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-12" style={{ background: "#7c3aed", opacity: 0.4 }} />
            <span className="font-semibold text-sm uppercase tracking-widest" style={{ color: "#7c3aed" }}>
              À propos
            </span>
          </div>
        </motion.div>

        {/* ── MAIN GRID ── */}
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* ══ LEFT — Text ══ */}
          <div>
            <motion.h2
              {...fadeUp(0.1)}
              className="font-black leading-tight mb-8"
              style={{
                fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
                color: "#0f172a",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              Passionné par le{" "}
              <span style={{
                background: "linear-gradient(90deg, #7c3aed, #2563eb)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                code
              </span>{" "}
              et le{" "}
              <span style={{
                background: "linear-gradient(90deg, #059669, #14b8a6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                design
              </span>
            </motion.h2>

            {/* Text paragraphs with left accent line */}
            <div className="relative pl-5 mb-8" style={{ borderLeft: "3px solid #ede9fe" }}>
              <motion.div {...fadeUp(0.2)} className="space-y-4 text-slate-600 leading-relaxed">
                <p>
                  Je suis <strong className="text-slate-800">Aaron KAME MOUELE</strong>, développeur
                  freelance Web & Mobile basé à Yaoundé. Titulaire d'une Licence en Génie Informatique,
                  j'ai construit une expertise complète :<strong className="text-slate-800"> du pixel au serveur.</strong> 
                </p>
                <p>
                  Ma spécialité ? Créer des interfaces React soignées et performantes, tout en
                  concevant des APIs solides avec FastAPI ou Node.js. J'ai même entraîné des modèles
                  d'IA pour la détection de maladies des plantes.
                </p>
                <p>
                  J'aime le code propre, les projets qui ont du sens, et les collaborations où chaque
                  détail compte.
                </p>
              </motion.div>
            </div>

            {/* Stats row */}
            <motion.div {...fadeUp(0.35)} className="flex gap-8 mb-8 pt-2">
              {stats.map(({ value, label, color }) => (
                <div key={label}>
                  <div
                    className="font-black text-3xl mb-0.5"
                    style={{ color, fontFamily: "'Syne', sans-serif" }}
                  >
                    {value}
                  </div>
                  <div className="text-xs font-medium" style={{ color: "#94a3b8" }}>{label}</div>
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div {...fadeUp(0.45)}>
              <button
                className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                  color: "#fff",
                  boxShadow: "0 6px 20px rgba(124,58,237,0.25)",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 28px rgba(124,58,237,0.38)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(124,58,237,0.25)"}
              >
                Me contacter <ArrowRight size={14} />
              </button>
            </motion.div>
          </div>

          {/* ══ RIGHT — Highlight cards (offset layout) ══ */}
          <div className="relative">

            {/* Top row — 2 cards normal */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {highlights.slice(0, 2).map(({ icon: Icon, color, bg, border, title, text }, i) => (
                <motion.div
                  key={title}
                  {...fadeUp(0.2 + i * 0.1)}
                  className="p-5 rounded-2xl cursor-default transition-all duration-200"
                  style={{
                    background: bg,
                    border: `1.5px solid ${border}`,
                  }}
                  whileHover={{ y: -4, boxShadow: `0 12px 28px ${color}18` } as any}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${color}15` }}
                  >
                    <Icon size={18} style={{ color }} />
                  </div>
                  <p className="font-bold text-sm mb-1" style={{ color: "#0f172a", fontFamily: "'Syne', sans-serif" }}>
                    {title}
                  </p>
                  <p className="text-xs leading-snug" style={{ color: "#64748b" }}>{text}</p>
                </motion.div>
              ))}
            </div>

            {/* Bottom row — 2 cards décalées (légèrement indentées) */}
            <div className="grid grid-cols-2 gap-4 ml-6 mr-0">
              {highlights.slice(2).map(({ icon: Icon, color, bg, border, title, text }, i) => (
                <motion.div
                  key={title}
                  {...fadeUp(0.4 + i * 0.1)}
                  className="p-5 rounded-2xl cursor-default transition-all duration-200"
                  style={{
                    background: bg,
                    border: `1.5px solid ${border}`,
                  }}
                  whileHover={{ y: -4, boxShadow: `0 12px 28px ${color}18` } as any}
                >
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${color}15` }}
                  >
                    <Icon size={18} style={{ color }} />
                  </div>
                  <p className="font-bold text-sm mb-1" style={{ color: "#0f172a", fontFamily: "'Syne', sans-serif" }}>
                    {title}
                  </p>
                  <p className="text-xs leading-snug" style={{ color: "#64748b" }}>{text}</p>
                </motion.div>
              ))}
            </div>

            {/* Decorative connecting line between rows */}
            <div
              className="absolute hidden md:block"
              style={{
                width: 2,
                height: 28,
                background: "linear-gradient(180deg, #7c3aed44, transparent)",
                borderRadius: 2,
                left: "50%",
                top: "calc(50% - 14px)",
                transform: "translateX(-50%)",
              }}
            />

            {/* Floating "Open to work" pill */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.4, ease: "backOut" }}
              className="absolute -bottom-5 right-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl"
              style={{
                background: "#fff",
                border: "1.5px solid rgba(5,150,105,0.2)",
                boxShadow: "0 8px 24px rgba(5,150,105,0.12)",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold" style={{ color: "#059669" }}>Open to work</span>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}