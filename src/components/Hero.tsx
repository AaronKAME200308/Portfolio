import { ArrowDown, Github, Linkedin, Mail, Download } from "lucide-react";
import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE },
});

const skills = [
  { name: "React Native", color: "#7c3aed", dot: "#8b5cf6", angle: -10, x: "80%", y: "12%" },
  { name: "FastAPI + IA",  color: "#059669", dot: "#10b981", angle:   7, x: "82%", y: "68%" },
  { name: "Tailwind CSS",  color: "#2563eb", dot: "#3b82f6", angle:  -5, x: "62%", y: "90%" },
];

export default function Hero() {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#f8fafc" }}
    >
      {/* ── Background decorative ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Diagonal color wash */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #f8fafc 54%, #eef2ff 54%)",
          }}
        />
        {/* Dot grid top-left */}
        <svg className="absolute top-20 left-8 opacity-[0.07]" width="180" height="180">
          {Array.from({ length: 6 }, (_, r) =>
            Array.from({ length: 6 }, (_, c) => (
              <circle key={`${r}-${c}`} cx={c * 28 + 14} cy={r * 28 + 14} r="2.5" fill="#7c3aed" />
            ))
          )}
        </svg>
        {/* Dot grid bottom-right */}
        <svg className="absolute bottom-20 right-12 opacity-[0.07]" width="140" height="140">
          {Array.from({ length: 5 }, (_, r) =>
            Array.from({ length: 5 }, (_, c) => (
              <circle key={`${r}-${c}`} cx={c * 28 + 14} cy={r * 28 + 14} r="2.5" fill="#059669" />
            ))
          )}
        </svg>
        {/* Decorative rings around photo zone */}
        <div
          className="absolute hidden md:block"
          style={{
            width: 480,
            height: 480,
            borderRadius: "50%",
            border: "1.5px dashed rgba(124,58,237,0.12)",
            right: "calc(50% - 520px)",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <div
          className="absolute hidden md:block"
          style={{
            width: 340,
            height: 340,
            borderRadius: "50%",
            border: "1px solid rgba(124,58,237,0.07)",
            right: "calc(50% - 450px)",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        />
      </div>

      {/* ── MAIN GRID ── */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-24 pb-20 w-full grid md:grid-cols-5 gap-12 items-center">

        {/* ══ LEFT — Text (3 cols) ══ */}
        <div className="md:col-span-3 space-y-7">

          {/* Available badge */}
          <motion.div {...fadeUp(0.1)}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
              style={{
                background: "#fff",
                border: "1.5px solid rgba(124,58,237,0.15)",
                color: "#7c3aed",
                boxShadow: "0 2px 12px rgba(124,58,237,0.08)",
              }}>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Développeur Freelance disponible
            </div>
          </motion.div>

          {/* Name */}
          <motion.div {...fadeUp(0.3)} className="relative">
            {/* Vertical accent bar */}
            <div className="absolute hidden md:block"
              style={{
                width: 5,
                height: "115%",
                background: "linear-gradient(180deg, #7c3aed, #059669)",
                borderRadius: 3,
                left: -24,
                top: -8,
              }}
            />
            <p className="text-slate-500 font-medium text-base mb-2">Bonjour, je suis</p>
            <h1
              className="font-black leading-[0.9] tracking-tight"
              style={{
                fontSize: "clamp(2.8rem, 6.5vw, 5rem)",
                color: "#0f172a",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              Aaron<br />
              <span style={{
                background: "linear-gradient(90deg, #7c3aed, #2563eb, #059669)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}>
                KAME MOUELE
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.p {...fadeUp(0.55)} className="text-slate-600 text-base leading-relaxed max-w-md">
            Développeur Web & Mobile Full-Stack passionné par la création
            d'interfaces élégantes et d'APIs robustes. Spécialisé en{" "}
            <strong style={{ color: "#7c3aed" }}>React</strong>,{" "}
            <strong style={{ color: "#2563eb" }}>FastAPI</strong> &{" "}
            <strong style={{ color: "#059669" }}>IA/ML</strong>.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div {...fadeUp(0.75)} className="flex flex-wrap gap-3 pt-1">
            <motion.button
              onClick={() => scrollTo("projects")}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-6 py-3.5 rounded-2xl font-bold text-sm text-white"
              style={{
                background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                boxShadow: "0 6px 20px rgba(124,58,237,0.3)",
              }}
            >
              Voir mes projets
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-6 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2"
              onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/cv.pdf";
                  link.download = "Aaron_Kame_Mouele_CV.pdf";
                  link.click();
                }}
              style={{
                background: "#fff",
                color: "#475569",
                border: "1.5px solid #e2e8f0",
                boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                cursor: "pointer",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.background = "linear-gradient(135deg, #7c3aed, #2563eb)";
                (e.currentTarget as HTMLElement).style.color = "#fff";
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(124,58,237,0.3)";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(124,58,237,0.3)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.background = "#fff";
                (e.currentTarget as HTMLElement).style.color = "#475569";
                (e.currentTarget as HTMLElement).style.borderColor = "#e2e8f0";
                (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.05)";
              }}
            >
              <Download size={14} /> Télécharger CV
            </motion.button>
          </motion.div>

          {/* Socials */}
          <motion.div {...fadeUp(0.9)} className="flex items-center gap-3 pt-1">
            <span className="text-slate-400 text-xs font-medium tracking-wide uppercase">
              Retrouvez-moi
            </span>
            <div className="h-px w-8" style={{ background: "#e2e8f0" }} />
            {[
              { icon: Github,   href: "#",        label: "GitHub"   },
              { icon: Linkedin, href: "#",        label: "LinkedIn" },
              { icon: Mail,     href: "#contact", label: "Email"    },
            ].map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-200"
                style={{
                  background: "#fff",
                  border: "1.5px solid #e2e8f0",
                  color: "#94a3b8",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                }}
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

        {/* ══ RIGHT — Photo (2 cols) ══ */}
        <div className="md:col-span-2 relative flex items-center justify-center md:justify-end">

          {/* Floating skill tags */}
          {skills.map(({ name, color, dot, angle, x, y }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1 + i * 0.15, duration: 0.4, ease: "backOut" }}
              className="absolute z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold"
              style={{
                left: x,
                top: y,
                transform: `rotate(${angle}deg) translateX(-50%)`,
                background: "#fff",
                color,
                border: `1.5px solid ${color}22`,
                boxShadow: `0 4px 16px ${color}18`,
                whiteSpace: "nowrap",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} />
              {name}
            </motion.div>
          ))}

          {/* Photo frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.7, ease: EASE }}
            className="relative z-10"
            style={{ width: 300, height: 360 }}
          >
            {/* Offset shadow */}
            <div
              className="absolute"
              style={{
                inset: 0,
                borderRadius: "38% 62% 52% 48% / 44% 38% 62% 56%",
                background: "rgba(124,58,237,0.08)",
                transform: "translate(14px, 14px)",
              }}
            />
            {/* Gradient border */}
            <div
              className="absolute"
              style={{
                inset: -3,
                borderRadius: "38% 62% 52% 48% / 44% 38% 62% 56%",
                background: "linear-gradient(135deg, rgba(124,58,237,0.35), rgba(5,150,105,0.25))",
                zIndex: -1,
              }}
            />
            {/* Photo */}
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: "38% 62% 52% 48% / 44% 38% 62% 56%",
                overflow: "hidden",
                background: "linear-gradient(135deg, #ede9fe, #dbeafe)",
                position: "relative",
              }}
            >
              <img
                src="/photo.jpg"
                alt="Aaron KAME MOUELE"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top center",
                  display: "block",
                }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
              {/* Fallback initials */}
              <div
                className="absolute inset-0 flex items-center justify-center font-black text-7xl select-none"
                style={{
                  color: "#7c3aed",
                  opacity: 0.12,
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                AK
              </div>
            </div>
          </motion.div>

          {/* Stats floating card */}
          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.3, duration: 0.5, ease: EASE }}
            className="absolute bottom-2 -left-2 z-20 px-4 py-3 rounded-2xl"
            style={{
              background: "#fff",
              border: "1.5px solid rgba(124,58,237,0.1)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            <div className="flex gap-5">
              {[
                { v: "5+",  l: "Projets",    color: "#7c3aed" },
                { v: "3+",  l: "Ans exp.",   color: "#2563eb" },
                { v: "∞",   l: "Lignes",     color: "#059669" },
              ].map(({ v, l, color }) => (
                <div key={l} className="text-center">
                  <div className="font-black text-lg leading-none mb-0.5"
                    style={{ color, fontFamily: "'Syne', sans-serif" }}>
                    {v}
                  </div>
                  <div className="text-[10px] font-medium" style={{ color: "#94a3b8" }}>{l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.button
        onClick={() => scrollTo("about")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 transition-colors duration-200"
        style={{ color: "#cbd5e1" }}
        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "#7c3aed"}
        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "#cbd5e1"}
      >
        <span className="text-[10px] font-semibold tracking-widest uppercase">Scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}>
          <ArrowDown size={15} />
        </motion.div>
      </motion.button>
    </section>
  );
}