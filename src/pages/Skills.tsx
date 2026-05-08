import { useState } from "react";
import { Code2, Server, Database, Brain, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

// ── Data ──────────────────────────────────────────────────
const categories = [
  {
    id: "frontend",
    icon: Code2,
    label: "Front-end",
    color: "#7c3aed",
    bg: "#f5f3ff",
    border: "rgba(124,58,237,0.15)",
    gradient: "linear-gradient(90deg, #7c3aed, #2563eb)",
    skills: [
      { name: "React JS",       level: 95 },
      { name: "React Native",   level: 90 },
      { name: "Tailwind CSS",   level: 95 },
      { name: "HTML / CSS",     level: 98 },
      { name: "JavaScript",     level: 90 },
    ],
  },
  {
    id: "backend",
    icon: Server,
    label: "Back-end",
    color: "#2563eb",
    bg: "#eff6ff",
    border: "rgba(37,99,235,0.15)",
    gradient: "linear-gradient(90deg, #2563eb, #0ea5e9)",
    skills: [
      { name: "FastAPI (Python)", level: 85 },
      { name: "Node.js / Express",level: 80 },
      { name: "PHP / Symfony",    level: 75 },
      { name: "Java",             level: 70 },
      { name: "REST API",         level: 88 },
    ],
  },
  {
    id: "database",
    icon: Database,
    label: "Bases de données",
    color: "#059669",
    bg: "#ecfdf5",
    border: "rgba(5,150,105,0.15)",
    gradient: "linear-gradient(90deg, #059669, #14b8a6)",
    skills: [
      { name: "PostgreSQL", level: 85 },
      { name: "Supabase",   level: 82 },
      { name: "SQL",        level: 88 },
    ],
  },
  {
    id: "ai",
    icon: Brain,
    label: "IA / ML",
    color: "#e11d48",
    bg: "#fff1f2",
    border: "rgba(225,29,72,0.15)",
    gradient: "linear-gradient(90deg, #e11d48, #f97316)",
    skills: [
      { name: "Python",              level: 82 },
      { name: "TensorFlow / Keras",  level: 70 },
      { name: "Computer Vision",     level: 68 },
    ],
  },
  {
    id: "methods",
    icon: Layers,
    label: "Conception",
    color: "#d97706",
    bg: "#fffbeb",
    border: "rgba(217,119,6,0.15)",
    gradient: "linear-gradient(90deg, #d97706, #f59e0b)",
    skills: [
      { name: "UML / Merise",           level: 85 },
      { name: "Architecture logicielle", level: 80 },
      { name: "Git / GitHub",            level: 90 },
    ],
  },
];

const allTags = [
  "React JS", "React Native", "Tailwind CSS", "JavaScript",
  "TypeScript", "HTML5", "CSS3",
  "FastAPI", "Node.js", "Express", "PHP", "Symfony", "Java",
  "Python", "TensorFlow",
  "PostgreSQL", "Supabase", "MySQL",
  "Git", "GitHub", "Figma", "VS Code",
  "UML", "Merise", "REST API",
];

// ── Animated progress bar ─────────────────────────────────
const Bar = ({ level, gradient, delay }: { level: number; gradient: string; delay: number }) => (
  <motion.div
    className="h-full rounded-full"
    style={{ background: gradient }}
    initial={{ width: 0 }}
    whileInView={{ width: `${level}%` }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.7, delay, ease: EASE }}
  />
);

// ═══════════════════════════════════════════════════════════
export default function Skills() {
  const [active, setActive] = useState("frontend");
  const current = categories.find((c) => c.id === active)!;

  return (
    <section id="skills" className="py-28 overflow-hidden" style={{ background: "#f8fafc" }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-12" style={{ background: "#7c3aed", opacity: 0.4 }} />
            <span className="font-semibold text-sm uppercase tracking-widest" style={{ color: "#7c3aed" }}>
              Compétences
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
            <h2
              className="font-black leading-tight"
              style={{
                fontSize: "clamp(2.2rem, 4.5vw, 3.5rem)",
                color: "#0f172a",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              Mon stack<br />
              <span style={{
                background: "linear-gradient(90deg, #7c3aed, #2563eb)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                technique
              </span>
            </h2>
            <p className="text-sm max-w-xs" style={{ color: "#94a3b8" }}>
              Technologies maîtrisées du frontend au déploiement, en passant par l'IA.
            </p>
          </div>
        </motion.div>

        {/* ── MAIN LAYOUT : sidebar + panel ── */}
        <div className="grid md:grid-cols-4 gap-8 mb-14">

          {/* ══ SIDEBAR — vertical category nav ══ */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, ease: EASE }}
            className="md:col-span-1 flex flex-row md:flex-col  gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0"
          >
            {categories.map(({ id, icon: Icon, label, color, bg, border }) => {
              const isActive = id === active;
              return (
                <motion.button
                  key={id}
                  onClick={() => setActive(id)}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 shrink-0 md:shrink hover:cursor-pointer"
                  style={{
                    background: isActive ? bg : "#fff",
                    border: `1.5px solid ${isActive ? border : "#e2e8f0"}`,
                    boxShadow: isActive ? `0 4px 16px ${color}18` : "0 1px 4px rgba(0,0,0,0.04)",
                    minWidth: 140,
                  }}
                >
                  {/* Active indicator bar */}
                  <div
                    className="hidden md:block w-0.5 h-6 rounded-full transition-all duration-200"
                    style={{
                      background: isActive ? color : "transparent",
                      opacity: isActive ? 1 : 0,
                    }}
                  />
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: isActive ? `${color}15` : "#f1f5f9" }}
                  >
                    <Icon size={15} style={{ color: isActive ? color : "#94a3b8" }} />
                  </div>
                  <span
                    className="text-xs font-bold leading-tight"
                    style={{
                      color: isActive ? color : "#64748b",
                      fontFamily: "'Syne', sans-serif",
                    }}
                  >
                    {label}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>

          {/* ══ PANEL — progress bars ══ */}
          <div className="md:col-span-3">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="rounded-3xl p-8"
                style={{
                  background: "#fff",
                  border: `1.5px solid ${current.border}`,
                  boxShadow: `0 4px 24px ${current.color}0e`,
                }}
              >
                {/* Panel header */}
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{ background: current.bg }}
                  >
                    <current.icon size={22} style={{ color: current.color }} />
                  </div>
                  <div>
                    <h3
                      className="font-black text-xl"
                      style={{ color: "#0f172a", fontFamily: "'Syne', sans-serif" }}
                    >
                      {current.label}
                    </h3>
                    <p className="text-xs" style={{ color: "#94a3b8" }}>
                      {current.skills.length} technologies
                    </p>
                  </div>
                </div>

                {/* Skill bars */}
                <div className="space-y-5">
                  {current.skills.map(({ name, level }, i) => (
                    <div key={name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold" style={{ color: "#334155" }}>
                          {name}
                        </span>
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full"
                          style={{ background: current.bg, color: current.color }}
                        >
                          {level}%
                        </span>
                      </div>
                      <div
                        className="h-2.5 rounded-full overflow-hidden"
                        style={{ background: `${current.color}12` }}
                      >
                        <Bar level={level} gradient={current.gradient} delay={i * 0.07} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── ALL TAGS ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: EASE }}
          className="rounded-3xl p-8"
          style={{
            background: "#fff",
            border: "1.5px solid #e2e8f0",
            boxShadow: "0 2px 16px rgba(0,0,0,0.04)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className="font-black text-lg"
              style={{ color: "#0f172a", fontFamily: "'Syne', sans-serif" }}
            >
              Toutes mes technologies
            </h3>
            <span
              className="text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: "#f5f3ff", color: "#7c3aed" }}
            >
              {allTags.length} outils
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {allTags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.025, duration: 0.3, ease: "backOut" }}
                className="px-3 py-1.5 rounded-xl text-xs font-medium cursor-default transition-all duration-200"
                style={{
                  background: "#f8fafc",
                  border: "1.5px solid #e2e8f0",
                  color: "#475569",
                }}
                whileHover={{
                  background: "#f5f3ff",
                  borderColor: "rgba(124,58,237,0.3)",
                  color: "#7c3aed",
                  y: -2,
                } as any}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}