import { motion } from "framer-motion";
import { ArrowDown, Download } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: EASE },
});

const skills = [
  { name: "AI / ML", color: "#982598", angle: -12, x: "82%", y: "18%" },
  { name: "Frontend", color: "#E491C9", angle: 8, x: "78%", y: "72%" },
  { name: "Backend", color: "#15173D", angle: -5, x: "60%", y: "88%" },
];

const Home = () => {
  return (
    <section
      id="Accueil"
      className="relative w-full min-h-screen overflow-hidden flex items-center"
      style={{ background: "#EBF4F6" }}
    >
      {/* ── Diagonal accent background ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, #EBF4F6 55%, #d6eef5 55%)",
          zIndex: 0,
        }}
      />

      {/* ── Decorative circle ── */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 520,
          height: 520,
          borderRadius: "50%",
          border: "1.5px dashed rgba(0,114,255,0.13)",
          right: "calc(40% - 260px)",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 0,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          width: 380,
          height: 380,
          borderRadius: "50%",
          border: "1px solid rgba(0,114,255,0.08)",
          right: "calc(40% - 190px)",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 0,
        }}
      />

      {/* ── MAIN GRID ── */}
      <div
        className="relative w-full max-w-6xl mx-auto px-6 md:px-12 lg:px-16 py-20 md:py-0 z-10"
        style={{ minHeight: "100vh", display: "flex", alignItems: "center" }}
      >
        <div className="w-full grid md:grid-cols-5 gap-12 md:gap-0 items-center">

          {/* ══ LEFT — Text (3 cols) ══ */}
          <div className="md:col-span-3 space-y-8">

            {/* Portfolio label */}
            <motion.div {...fadeUp(0.1)}>
              <span
                className="font-caveat italic text-2xl md:text-3xl"
                style={{ color: "#0072FF", opacity: 0.7, fontWeight: 600 }}
              >
                {"Portfolio".split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.15 + i * 0.07, duration: 0.1 }}
                    style={{ display: "inline-block" }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </motion.div>

            {/* Name with diagonal accent bar */}
            <motion.div {...fadeUp(0.9)} className="relative">
              {/* Accent bar */}
              <div
                className="absolute hidden md:block"
                style={{
                  width: 6,
                  height: "110%",
                  background: "linear-gradient(180deg, #0072FF, #7AB2B2)",
                  borderRadius: 3,
                  left: -28,
                  top: -5,
                }}
              />
              <h1
                className="font-black leading-[0.92] tracking-tight"
                style={{
                  fontSize: "clamp(3rem, 7vw, 5.5rem)",
                  color: "#0F2854",
                  fontFamily: "'Syne', sans-serif",
                }}
              >
                Aaron<br />
                <span style={{ color: "#0072FF" }}>KAME</span><br />
                MOUELE
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div {...fadeUp(1.3)}>
              <div
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: "rgba(0,114,255,0.08)",
                  border: "1px solid rgba(0,114,255,0.2)",
                  color: "#0072FF",
                }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: "#0072FF" }}
                />
                Développeur Web & Mobile
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              {...fadeUp(1.6)}
              className="font-caveat italic text-xl md:text-2xl leading-relaxed max-w-md"
              style={{ color: "#0F2854", opacity: 0.75 }}
            >
              Du code à l'intelligence : je bâtis des apps complètes et smart.
            </motion.p>

            {/* Buttons */}
            <motion.div
              {...fadeUp(1.9)}
              className="flex flex-wrap gap-3 pt-2"
            >
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="px-7 py-3.5 rounded-2xl font-bold text-base shadow-lg"
                style={{
                  background: "#0072FF",
                  color: "#fff",
                  boxShadow: "0 8px 24px rgba(0,114,255,0.28)",
                }}
              >
                Voir mes projets
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = "/cv.pdf";
                  link.download = "Aaron_Kame_Mouele_CV.pdf";
                  link.click();
                }}
                className="px-7 py-3.5 rounded-2xl border-2 font-bold text-base flex items-center gap-2"
                style={{
                  borderColor: "#0072FF",
                  color: "#0072FF",
                  background: "rgba(255,255,255,0.5)",
                  backdropFilter: "blur(8px)",
                  cursor: "pointer",
                }}
              >
                <Download size={15} /> CV
              </motion.button>
            </motion.div>

            {/* Scroll hint */}
            <motion.div
              {...fadeUp(2.2)}
              className="flex items-center gap-2 pt-4"
              style={{ color: "#7AB2B2" }}
            >
              <ArrowDown size={14} />
              <span className="text-xs font-medium tracking-wider uppercase">
                Scroll pour découvrir
              </span>
            </motion.div>
          </div>

          {/* ══ RIGHT — Photo (2 cols) ══ */}
          <div className="md:col-span-2 relative flex items-center justify-center">

            {/* Floating skill tags */}
            {skills.map(({ name, color, angle, x, y }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.8 + i * 0.15, duration: 0.4, ease: "backOut" }}
                className="absolute z-20 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md"
                style={{
                  left: x,
                  top: y,
                  transform: `rotate(${angle}deg) translateX(-50%)`,
                  background: "#fff",
                  color,
                  border: `1.5px solid ${color}30`,
                  boxShadow: `0 4px 16px ${color}22`,
                  whiteSpace: "nowrap",
                }}
              >
                {name}
              </motion.div>
            ))}

            {/* Photo container — clipped hexagon-ish shape */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
              style={{ width: 320, height: 380 }}
            >
              {/* Offset shadow frame */}
              <div
                className="absolute"
                style={{
                  inset: 0,
                  borderRadius: "40% 60% 55% 45% / 45% 40% 60% 55%",
                  background: "rgba(0,114,255,0.1)",
                  transform: "translate(12px, 12px)",
                }}
              />
              {/* Accent border */}
              <div
                className="absolute"
                style={{
                  inset: -4,
                  borderRadius: "40% 60% 55% 45% / 45% 40% 60% 55%",
                  background: "linear-gradient(135deg, #0072FF40, #7AB2B240)",
                  zIndex: -1,
                }}
              />
              {/* Photo */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "40% 60% 55% 45% / 45% 40% 60% 55%",
                  overflow: "hidden",
                  background: "#c8dfe8",
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
                  }}
                  onError={(e) => {
                    // Fallback: initials
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Fallback overlay initials si pas de photo */}
                <div
                  className="absolute inset-0 flex items-center justify-center font-black text-6xl"
                  style={{ color: "#0072FF", opacity: 0.15, fontFamily: "'Syne', sans-serif" }}
                >
                  AKM
                </div>
              </div>
            </motion.div>

            {/* Stats floating card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2, duration: 0.5 }}
              className="absolute bottom-4 -left-4 z-20 px-4 py-3 rounded-2xl shadow-xl"
              style={{
                background: "#fff",
                border: "1.5px solid rgba(0,114,255,0.12)",
                minWidth: 160,
              }}
            >
              <div className="flex gap-4">
                {[
                  { v: "5+", l: "Projets" },
                  { v: "3+", l: "Ans" },
                ].map(({ v, l }) => (
                  <div key={l}>
                    <div
                      className="font-black text-xl"
                      style={{ color: "#0072FF", fontFamily: "'Syne', sans-serif" }}
                    >
                      {v}
                    </div>
                    <div className="text-xs" style={{ color: "#7AB2B2" }}>{l}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;