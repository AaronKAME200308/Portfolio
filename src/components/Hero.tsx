import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useLang } from "../lib/i18n";

// ── Fichiers du dossier public/ : adapte les noms si besoin ──
const CUTOUT_SRC = "/aaron-cutout.png"; // photo détourée (PNG transparent), le nom doit être exact
const LOGO_SRC = "/aun-symbole-vert.svg"; // affiché si la photo est introuvable

const EASE = [0.22, 1, 0.36, 1] as const;

const WORD = "PORTFOLIO".split("");

const TXT = {
  fr: {
    role: "Développeur web & mobile", hello: "Bonjour, je suis", note1: "du pixel", note2: "au serveur",
    sr: ", développeur web et mobile freelance", cta1: "Faisons pousser votre projet",
    cta2: "Découvrir mes réalisations", logoAlt: "Logo Aun",
  },
  en: {
    role: "Web & mobile developer", hello: "Hi, I'm", note1: "from pixel", note2: "to server",
    sr: ", freelance web and mobile developer", cta1: "Let's grow your project",
    cta2: "See my work", logoAlt: "Aun logo",
  },
};

// ── Doodles dessinés à la main (SVG) ──────────────────────
const Sparkle = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M20 3 C21 13, 27 19, 37 20 C27 21, 21 27, 20 37 C19 27, 13 21, 3 20 C13 19, 19 13, 20 3 Z" />
  </svg>
);

const CurvedArrow = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 80 70" className={className} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M74 6 C50 4, 22 14, 14 52" />
    <path d="M4 42 L14 54 L26 44" />
  </svg>
);

const Scribble = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 180 14" className={className} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true" preserveAspectRatio="none">
    <path d="M3 9 C30 2, 56 13, 88 6 S146 10, 177 4" />
  </svg>
);

// Bord de papier déchiré qui ouvre sur la section suivante (crème, comme À propos)
function TornEdge({ fill = "#f6f4ec" }: { fill?: string }) {
  const d = useMemo(() => {
    const w = 1440, h = 40, steps = 80;
    let p = `M0 ${h} L0 14`;
    for (let i = 1; i <= steps; i++) {
      const r = Math.abs((Math.sin(i * 127.1) * 43758.5453) % 1);
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

export default function Hero() {
  const reduce = useReducedMotion();
  const [photoOk, setPhotoOk] = useState(true);
  const { lang } = useLang();
  const T = TXT[lang];

  const pop = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay, ease: EASE },
  });

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="hero" className="relative overflow-hidden bg-forest">
      {/* ── Décor : grand cercle vert derrière la photo ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-aun/30 border border-moss/20"
          style={{ width: "min(78vw, 700px)", aspectRatio: "1" }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-24 lg:pt-28 pb-16 lg:pb-20">
        {/* ══ SCÈNE ══ */}
        <div className="relative lg:h-[min(84vh,780px)] lg:min-h-[640px]">
          {/* Titre géant (décoratif), prénom manuscrit, étiquette de fonction */}
          <div className="relative lg:absolute lg:inset-x-0 lg:top-[4%] z-[1] pt-10 pb-14 lg:pt-0 lg:pb-0">
            <div
              aria-hidden="true"
              className="flex justify-center select-none leading-[0.82]"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 800,
                fontSize: "clamp(2.7rem, 14.2vw, 13.5rem)",
                letterSpacing: "-0.04em",
                color: "#f6f4ec",
                textShadow: "0.045em 0.045em 0 #1e7b4a",
              }}
            >
              {WORD.map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={reduce ? false : { y: "55%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.1 + i * 0.05, ease: EASE }}
                >
                  {ch}
                </motion.span>
              ))}
            </div>

            {/* Badge « Aaron » en écriture manuscrite, par-dessus le titre */}
            <motion.div
              initial={reduce ? false : { opacity: 0, rotate: -12, scale: 0.9 }}
              animate={{ opacity: 1, rotate: -6, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.6, ease: EASE }}
              aria-hidden="true"
              className="absolute left-0 top-0 lg:-top-8 lg:left-[1%] z-20 text-moss leading-none"
              style={{
                fontFamily: "'Caveat', cursive",
                fontWeight: 700,
                fontSize: "clamp(2.4rem, 8vw, 7.2rem)",
                WebkitTextStroke: "0.12em #0e2f20",
                paintOrder: "stroke fill",
              }}
            >
              Aun
            </motion.div>

            {/* Fonction */}
            <motion.div
              initial={reduce ? false : { opacity: 0, scale: 0.8, rotate: 6 }}
              animate={{ opacity: 1, scale: 1, rotate: 3 }}
              transition={{ delay: 1.1, duration: 0.5, ease: "backOut" }}
              className="absolute right-0 bottom-1 lg:-bottom-9 lg:right-[1%] z-20"
            >
              <div className="bg-cream text-forest px-4 py-2 lg:px-5 lg:py-2.5 font-display font-semibold uppercase tracking-[0.12em] text-[11px] sm:text-sm lg:text-base shadow-[3px_3px_0_#6baf7b]">
                {T.role}
              </div>
              <Scribble className="w-full h-3 mt-1 text-moss" />
            </motion.div>
          </div>

          {/* Photo détourée qui chevauche le titre */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.8, ease: EASE }}
            className="relative z-10 flex justify-center items-end -mt-6 lg:mt-0 lg:absolute lg:inset-x-0 lg:bottom-0 lg:h-[88%] pointer-events-none"
          >
            {photoOk ? (
              <img
                src={CUTOUT_SRC}
                alt="Aaron KAME MOUELE"
                width={800}
                height={1000}
                fetchPriority="high"
                decoding="async"
                onError={() => setPhotoOk(false)}
                className="h-[340px] sm:h-[420px] lg:h-full w-auto max-w-none object-contain object-bottom"
                style={{ filter: "drop-shadow(0 18px 22px rgba(0,0,0,0.35))" }}
              />
            ) : (
              <img
                src={LOGO_SRC}
                alt={T.logoAlt}
                className="h-[260px] sm:h-[320px] lg:h-[70%] w-auto self-center opacity-80"
              />
            )}
          </motion.div>

          {/* Note manuscrite + flèche, à droite de la photo */}
          <motion.div
            {...pop(1.2)}
            aria-hidden="true"
            className="hidden lg:flex absolute right-[19%] top-[47%] z-20 items-start gap-1 rotate-[4deg] text-sage"
          >
            <CurvedArrow className="w-12 h-10 mt-6 -mr-1 -scale-x-100 rotate-[-12deg] text-moss" />
            <span style={{ fontFamily: "'Caveat', cursive", fontSize: "1.9rem", lineHeight: 1 }}>
              {T.note1}
              <br />
              {T.note2}
            </span>
            <Sparkle className="w-6 h-6 text-moss" />
          </motion.div>

          {/* ── Gauche : nom ── */}
          <motion.div
            {...pop(0.8)}
            className="relative z-20 mt-8 lg:mt-0 lg:absolute lg:bottom-4 lg:left-0 lg:w-[400px]"
          >
            <p className="font-mono-label text-moss mb-3">{T.hello}</p>
            <h1
              className="font-display font-bold leading-[1.02] text-cream"
              style={{ fontSize: "clamp(2.2rem, 3.3vw, 3.1rem)", letterSpacing: "-0.03em" }}
            >
              Aaron
              <br />
              <span className="text-moss whitespace-nowrap">KAME MOUELE</span>
              <span className="sr-only">{T.sr}</span>
            </h1>
          </motion.div>

          {/* ── Droite : deux boutons ── */}
          <motion.div
            {...pop(1.0)}
            className="relative z-20 mt-8 lg:mt-0 lg:absolute lg:bottom-4 lg:right-0 lg:w-[310px] flex flex-col gap-5"
          >
            <button
              onClick={() => scrollTo("contact")}
              data-k="↵"
              className="keycap group w-full justify-between px-6 py-4 font-semibold text-base [--key-face:#6baf7b] [--key-edge:#3a7549] [--key-text:#0e2f20]"
            >
              {T.cta1}
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => scrollTo("projects")}
              data-k="⌘"
              className="keycap w-full px-6 py-4 font-semibold text-base [--key-face:#1c4a34] [--key-edge:#06150e] [--key-text:#f6f4ec]"
            >
              {T.cta2}
            </button>
          </motion.div>
        </div>
      </div>

      <TornEdge />
    </section>
  );
}