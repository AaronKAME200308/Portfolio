import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, animate, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { C, F, EASE, LOGO } from "../components/brand";

/* ── Réglages ── */
const PHOTO_SRC = "/aaron-cutout.png"; // photo détourée (PNG transparent) ; repli : logo
const FILLET = 24; // raccord concave des onglets
const TAB_H = 56; // hauteur de l'onglet actif
const STACK = ["React", "FastAPI", "Node.js", "IA / ML"];
const STATS = [
  { to: 5, label: "Projets" },
  { to: 3, label: "Ans d'exp." },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: EASE },
});

const mono = {
  fontFamily: F.mono,
  fontWeight: 500,
  letterSpacing: "0.12em",
  textTransform: "uppercase" as const,
};

/* ───────── Contenu des onglets ─────────
   b = texte en gras. Pour la frise, modifie les étapes (ajoute tes années si tu veux). */
type Seg = { t: string; b?: boolean };
type Tab =
  | { id: string; file: string; title: string; kind: "terminal" }
  | { id: string; file: string; title: string; kind: "text"; segs: Seg[] }
  | { id: string; file: string; title: string; kind: "list"; items: { k: string; segs: Seg[] }[] };

const TABS: Tab[] = [
  {
    id: "parcours",
    file: "parcours.md",
    title: "Mon parcours",
    kind: "text",
    segs: [
      { t: "Je suis " },
      { t: "Aaron KAME MOUELE", b: true },
      {
        t: ", développeur freelance Web & Mobile basé à Yaoundé. Titulaire d'une Licence en Génie Informatique, j'ai construit une expertise complète : ",
      },
      { t: "du pixel au serveur.", b: true },
    ],
  },
  {
    id: "chemin",
    file: "chemin.md",
    title: "Mon chemin",
    kind: "list",
    items: [
      { k: "01", segs: [{ t: "Licence en Génie Informatique", b: true }] },
      { k: "02", segs: [{ t: "Premiers projets web et mobiles", b: true }] },
      { k: "03", segs: [{ t: "Freelance, pour de vrais clients", b: true }] },
      { k: "04", segs: [{ t: "Aujourd'hui : IA et mobile", b: true }] },
    ],
  },
  {
    id: "methode",
    file: "methode.md",
    title: "Ma façon de travailler",
    kind: "text",
    segs: [
      {
        t: "J'aime le code propre, les projets qui ont du sens, et les collaborations où chaque détail compte.",
      },
    ],
  },
  { id: "terminal", file: "terminal.sh", title: "Terminal", kind: "terminal" },
];

const countChars = (tab: Tab) =>
  tab.kind === "terminal"
    ? 0
    : tab.kind === "text"
    ? tab.segs.reduce((n, s) => n + s.t.length, 0)
    : tab.items.reduce((n, it) => n + it.segs.reduce((m, s) => m + s.t.length, 0), 0);

/* ───────── Hauteur d'une rangée : 60 px (bureau) / 44 px (mobile) ───────── */
function useRow() {
  const [row, setRow] = useState(60);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const f = () => setRow(mq.matches ? 44 : 60);
    f();
    mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);
  return row;
}

/* ───────── Cases d'écriture, discrètes (repère de fond) ───────── */
const gridStyleFor = (row: number): React.CSSProperties => {
  const tile = `<svg xmlns='http://www.w3.org/2000/svg' width='48' height='${row}' viewBox='0 0 48 ${row}' shape-rendering='crispEdges'>
  <path d='M.5 4V${row - 4}M0 4.5H48M0 ${row - 4.5}H48' stroke='#1E7B4A' stroke-opacity='.22' fill='none'/>
  <path d='M24 4V${row - 4}M0 ${row / 2}H48' stroke='#1E7B4A' stroke-opacity='.14' stroke-dasharray='3 3' fill='none'/>
</svg>`;
  return {
    backgroundImage: `url("data:image/svg+xml,${encodeURIComponent(tile)}")`,
    backgroundSize: `48px ${row}px`,
    backgroundRepeat: "round repeat",
  };
};

/* ───────── Frappe : nombre de caractères visibles ───────── */
function useTyping(total: number, resetKey: string, reduce: boolean | null) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduce) {
      setN(total);
      return;
    }
    setN(0);
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      if (i >= total) {
        setN(total);
        clearInterval(id);
      } else setN(i);
    }, 16);
    return () => clearInterval(id);
  }, [resetKey, total, reduce]);
  return n;
}

const Cursor = ({ reduce }: { reduce: boolean | null }) => (
  <motion.span
    aria-hidden="true"
    animate={reduce ? undefined : { opacity: [1, 1, 0, 0] }}
    transition={{ repeat: Infinity, duration: 1.1, times: [0, 0.5, 0.5, 1] }}
    style={{
      display: "inline-block",
      width: 10,
      height: "0.9em",
      background: C.aun,
      marginLeft: 2,
      marginRight: -12,
      verticalAlign: "middle",
    }}
  />
);

/* Affiche les segments : la partie tapée est visible, le reste réserve la place (pas de saut de ligne) */
function Typed({ segs, start, n, reduce, last }: { segs: Seg[]; start: number; n: number; reduce: boolean | null; last: boolean }) {
  let remaining = n - start;
  let cursorDone = false;
  return (
    <>
      {segs.map((s, i) => {
        const take = Math.max(0, Math.min(s.t.length, remaining));
        remaining -= take;
        const shown = s.t.slice(0, take);
        const hidden = s.t.slice(take);
        const putCursor = !cursorDone && hidden.length > 0 && take > 0;
        const endCursor = !cursorDone && last && hidden.length === 0 && i === segs.length - 1;
        if (putCursor || endCursor) cursorDone = true;
        return (
          <span key={i} style={s.b ? { fontWeight: 600, color: C.foret } : undefined}>
            {shown}
            {(putCursor || endCursor) && <Cursor reduce={reduce} />}
            <span style={{ opacity: 0 }}>{hidden}</span>
          </span>
        );
      })}
    </>
  );
}

/* ───────── Compteur animé ───────── */
function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.4, ease: EASE, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}+</span>;
}

/* ───────── Terminal interactif ───────── */
const CONTACT_MAIL = "aaronmouele11@gmail.com";
const CONTACT_TEL = "+237 670 464 488";
const PROMPT = "visiteur@aun:~$";
const SUGGEST = ["help", "whoami", "skills", "stack", "projects", "contact"];

const COMMANDS: Record<string, string[]> = {
  help: [
    "Commandes disponibles :",
    "  whoami    qui suis-je",
    "  skills    ce que je sais faire",
    "  stack     mes outils",
    "  projects  mes réalisations",
    "  status    ma disponibilité",
    "  contact   me joindre",
    "  ls        lister les fichiers",
    "  clear     effacer l'écran",
  ],
  whoami: ["Aaron KAME MOUELE", "Développeur web & mobile, freelance, basé à Yaoundé.", "Du pixel au serveur."],
  skills: [
    "› API robustes (FastAPI, Node, Symfony)",
    "› Analyse, conception et réalisation de systèmes d'information",
    "› Conception, réalisation et déploiement de sites web",
    "› Applications mobiles (React Native)",
    "› IA et vision par ordinateur",
    "› Bases de données (PostgreSQL, Supabase)",
  ],
  stack: ["Front   React · TypeScript · Tailwind", "Back    FastAPI · Node.js · Symfony", "Mobile  React Native", "Data    PostgreSQL · Supabase · MySQL", "IA      Python · TensorFlow · Keras"],
  projects: ["PlantGuard AI", "Infinite Luxury Trips", "Portfolio JP Graphic Design", "Vitrine Pro Yapithe & Partners", "MenuQR"],
  status: ["● disponible pour de nouveaux projets", "  Yaoundé · UTC+1"],
  ls: ["parcours.md  chemin.md  methode.md  terminal.sh"],
};

type TLine = { kind: "in" | "out" | "err"; text: string };

function Terminal({ height, reduce }: { height: number; reduce: boolean | null }) {
  const [lines, setLines] = useState<TLine[]>([
    { kind: "out", text: "Bienvenue. Tape une commande, ou clique sur une suggestion." },
  ]);
  const [value, setValue] = useState("");
  const [hist, setHist] = useState<string[]>([]);
  const [hi, setHi] = useState(-1);
  const box = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    box.current?.scrollTo({ top: box.current.scrollHeight });
  }, [lines]);

  useEffect(() => {
    if (window.matchMedia("(hover: hover)").matches) input.current?.focus({ preventScroll: true });
  }, []);

  const goContact = () =>
    setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }), 900);

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase().replace(/\s+/g, " ");
    if (!cmd) return;
    setHist((h) => [...h, raw.trim()]);
    setHi(-1);
    if (cmd === "clear") return setLines([]);
    let out: TLine[];
    if (cmd === "contact") {
      out = [
        { kind: "out", text: `email  ${CONTACT_MAIL}` },
        { kind: "out", text: `tel    ${CONTACT_TEL}` },
        { kind: "out", text: "→ ouverture du formulaire…" },
      ];
      goContact();
    } else if (cmd === "sudo hire aaron") {
      out = [
        { kind: "out", text: "[sudo] mot de passe pour visiteur : ********" },
        { kind: "out", text: "✔ Excellente décision. Ouverture du formulaire…" },
      ];
      goContact();
    } else if (COMMANDS[cmd]) {
      out = COMMANDS[cmd].map((text) => ({ kind: "out" as const, text }));
    } else {
      out = [{ kind: "err", text: `${cmd.split(" ")[0]} : commande introuvable. Essaie « help ».` }];
    }
    setLines((l) => [...l, { kind: "in", text: raw.trim() }, ...out]);
  };

  const onKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      run(value);
      setValue("");
    } else if (e.key === "ArrowUp" && hist.length) {
      e.preventDefault();
      const i = hi < 0 ? hist.length - 1 : Math.max(0, hi - 1);
      setHi(i);
      setValue(hist[i]);
    } else if (e.key === "ArrowDown" && hi >= 0) {
      e.preventDefault();
      const i = hi + 1;
      if (i >= hist.length) {
        setHi(-1);
        setValue("");
      } else {
        setHi(i);
        setValue(hist[i]);
      }
    }
  };

  return (
    <div
      className="flex flex-col flex-1"
      style={{ height: "100%", minHeight: height, background: C.noir, color: C.sauge, fontFamily: F.mono, fontSize: "clamp(0.74rem, 1.6vw, 0.9rem)" }}
      onClick={() => input.current?.focus({ preventScroll: true })}
    >
      <div className="flex items-center gap-2 px-4 shrink-0" style={{ height: 34, borderBottom: "1px solid rgba(107,175,123,0.25)" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} aria-hidden="true" style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.85 }} />
        ))}
        <span style={{ ...mono, fontSize: 10, color: C.mousse, marginLeft: 8 }}>bash · 80×24</span>
      </div>

      <div ref={box} className="flex-1 overflow-y-auto px-4 py-3" style={{ lineHeight: 1.65 }} aria-live="polite">
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              color: l.kind === "err" ? "#ff8a80" : l.kind === "in" ? C.creme : C.sauge,
            }}
          >
            {l.kind === "in" && <span style={{ color: C.mousse }}>{PROMPT} </span>}
            {l.text}
          </div>
        ))}
        <label className="flex items-center gap-2" style={{ marginTop: 2 }}>
          <span style={{ color: C.mousse, whiteSpace: "nowrap" }}>{PROMPT}</span>
          <input
            ref={input}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            aria-label="Commande du terminal"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="flex-1 min-w-0 bg-transparent outline-none"
            style={{ color: C.creme, caretColor: C.mousse, font: "inherit", border: 0, padding: 0 }}
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-2 px-4 py-3 shrink-0" style={{ borderTop: "1px solid rgba(107,175,123,0.25)" }}>
        {SUGGEST.map((c) => (
          <button
            key={c}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              run(c);
            }}
            style={{
              fontFamily: F.mono,
              fontSize: 12,
              color: C.sauge,
              border: "1px solid rgba(220,234,221,0.35)",
              borderRadius: 8,
              padding: "4px 10px",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ───────── Badge de conférence suspendu à un lanyard (se balance, se tire à la souris / au doigt) ───────── */
const BARS = (() => {
  const out: { x: number; w: number }[] = [];
  let x = 0;
  for (let i = 0; i < 28; i++) {
    const w = 1 + Math.floor(Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1) * 3);
    out.push({ x, w });
    x += w + 1.4;
  }
  return { bars: out, width: x };
})();

function Badge() {
  const reduce = useReducedMotion();
  const [photo, setPhoto] = useState(true);
  const rot = useMotionValue(reduce ? -2 : 0);
  const idle = useRef<ReturnType<typeof animate> | null>(null);

  const startIdle = () => {
    if (reduce) return;
    idle.current?.stop();
    idle.current = animate(rot, [-3, 3], { repeat: Infinity, repeatType: "mirror", duration: 3.2, ease: "easeInOut" });
  };
  useEffect(() => {
    startIdle();
    return () => idle.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const W = 200;
  const CARD_W = 168;
  const CARD_X = (W - CARD_W) / 2;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4, duration: 0.5, ease: EASE }}
      className="relative mx-auto select-none"
      style={{ width: W, height: 300 }}
    >
      <motion.div
        role="img"
        aria-label="Badge d'Aaron KAME MOUELE, développeur web et mobile"
        className="absolute inset-0"
        style={{ rotate: rot, originX: 0.5, originY: 0, touchAction: "pan-y", cursor: reduce ? "default" : "grab" }}
        onPanStart={() => idle.current?.stop()}
        onPan={(_, info) => rot.set(Math.max(-22, Math.min(22, info.offset.x / 5)))}
        onPanEnd={() => {
          if (reduce) return rot.set(-2);
          animate(rot, 0, { type: "spring", stiffness: 55, damping: 4, onComplete: startIdle });
        }}
      >
        {/* sangles */}
        <svg viewBox={`0 0 ${W} 300`} className="absolute inset-0 w-full h-full" aria-hidden="true" style={{ overflow: "visible" }}>
          <polygon points="51.5,-22 69.5,-22 104,68 92,68" fill={C.aun} />
          <polygon points="148.5,-22 130.5,-22 96,68 108,68" fill={C.aun} />
          <line x1="60.5" y1="-22" x2="98" y2="68" stroke={C.creme} strokeOpacity=".55" strokeDasharray="4 4" />
          <line x1="139.5" y1="-22" x2="102" y2="68" stroke={C.creme} strokeOpacity=".55" strokeDasharray="4 4" />
          {/* mousqueton */}
          <rect x="88" y="60" width="24" height="26" rx="8" fill="none" stroke={C.sauge} strokeWidth="4" />
          <rect x="92" y="78" width="16" height="12" rx="3" fill={C.sauge} />
        </svg>

        {/* carte */}
        <div
          className="absolute"
          style={{
            left: CARD_X,
            top: 86,
            width: CARD_W,
            height: 206,
            background: C.creme,
            borderRadius: 16,
            boxShadow: "0 18px 30px -12px rgba(0,0,0,0.55), inset 0 0 0 1px rgba(14,47,32,0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ height: 6, background: C.aun }} />
          <span aria-hidden="true" style={{ position: "absolute", top: 12, left: "50%", marginLeft: -22, width: 44, height: 7, borderRadius: 4, background: C.foret, opacity: 0.85 }} />

          <div className="flex items-start gap-3" style={{ padding: "26px 14px 0" }}>
            <div className="relative shrink-0 overflow-hidden" style={{ width: 62, height: 74, borderRadius: 10, background: "rgba(30,123,74,0.35)" }}>
              {photo ? (
                <img
                  src={PHOTO_SRC}
                  alt=""
                  draggable={false}
                  onError={() => setPhoto(false)}
                  className="w-full h-full block"
                  style={{ objectFit: "cover", objectPosition: "50% 12%", transform: "scale(1.2)", transformOrigin: "50% 60%" }}
                />
              ) : (
                <div
                  className="absolute"
                  style={{
                    inset: "20%",
                    background: C.aun,
                    WebkitMaskImage: `url(${LOGO.vert})`,
                    maskImage: `url(${LOGO.vert})`,
                    WebkitMaskRepeat: "no-repeat",
                    maskRepeat: "no-repeat",
                    WebkitMaskPosition: "center",
                    maskPosition: "center",
                    WebkitMaskSize: "contain",
                    maskSize: "contain",
                  }}
                />
              )}
            </div>
            <div className="min-w-0">
              <div style={{ ...mono, fontSize: 8.5, color: C.aun }}>Pass · Dev</div>
              <div style={{ fontFamily: F.title, fontWeight: 800, fontSize: 17, lineHeight: 1.05, color: C.foret, marginTop: 4 }}>
                Aaron
                <br />
                Kame Mouele
              </div>
            </div>
          </div>

          <div style={{ padding: "10px 14px 0", fontFamily: F.mono, fontSize: 9.5, letterSpacing: "0.06em", color: C.foret, textTransform: "uppercase" }}>
            Développeur web &amp; mobile
            <div style={{ color: C.aun, marginTop: 2 }}>Freelance · Yaoundé</div>
          </div>

          <div className="absolute" style={{ left: 14, right: 14, bottom: 12 }}>
            <svg viewBox={`0 0 ${BARS.width} 22`} preserveAspectRatio="none" className="w-full" style={{ height: 22, display: "block" }} aria-hidden="true">
              {BARS.bars.map((b, i) => (
                <rect key={i} x={b.x} y={0} width={b.w} height={22} fill={C.foret} />
              ))}
            </svg>
            <div style={{ ...mono, fontSize: 8, color: "rgba(14,47,32,0.6)", marginTop: 3, letterSpacing: "0.2em" }}>AUN · 001</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* Repères en croix aux coins du dossier */
const Cross = ({ pos }: { pos: React.CSSProperties }) => (
  <span
    aria-hidden="true"
    className="absolute select-none"
    style={{ ...mono, fontSize: 14, lineHeight: 1, color: C.mousse, opacity: 0.55, ...pos }}
  >
    +
  </span>
);

/* Raccord concave entre l'onglet actif et le corps */
const Fillet = ({ side }: { side: "left" | "right" }) => (
  <span
    aria-hidden="true"
    className="absolute pointer-events-none"
    style={{
      bottom: 0,
      [side]: -FILLET,
      width: FILLET,
      height: FILLET,
      background: `radial-gradient(circle at ${side === "right" ? "100% 0" : "0 0"}, transparent ${FILLET - 0.5}px, ${C.foret} ${FILLET}px)`,
    }}
  />
);

export default function About() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const tab = TABS[active];
  const row = useRow();
  const zoneRows = row === 60 ? 8 : 10;
  const typed = useTyping(countChars(tab), tab.id, reduce);

  /* Centrage vertical du texte, calé sur les rangées de cases */
  const textRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const compute = () => {
      const free = row * zoneRows - el.offsetHeight;
      setOffset(Math.max(0, Math.floor(free / 2 / row) * row));
    };
    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [row, zoneRows, tab.kind]);

  const scrollToContact = () =>
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") setActive((a) => (a + 1) % TABS.length);
    if (e.key === "ArrowLeft") setActive((a) => (a - 1 + TABS.length) % TABS.length);
  };

  const bodySize = "clamp(0.98rem, 2.1vw, 1.75rem)";

  return (
    <section id="about" className="relative py-28 overflow-hidden" style={{ background: C.creme, fontFamily: F.body }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.p {...fadeUp(0)} className="font-mono-label text-aun mb-8">
          <span className="text-moss">01 /</span> À propos
        </motion.p>

        <motion.div {...fadeUp(0.05)} className="relative">
          {/* ── Bande d'onglets : l'onglet actif est plein et rejoint le corps ── */}
          <div className="flex items-end" style={{ height: TAB_H }}>
            <div role="tablist" aria-label="À propos" onKeyDown={onKeyDown} className="flex items-end">
              {TABS.map((t, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={t.id}
                    role="tab"
                    id={`tab-${t.id}`}
                    aria-selected={isActive}
                    aria-controls={`panel-${t.id}`}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => setActive(i)}
                    className="relative transition-colors duration-200"
                    style={{
                      height: isActive ? TAB_H : TAB_H - 12,
                      zIndex: isActive ? 2 : 1,
                      padding: "0 clamp(7px, 2.2vw, 26px)",
                      background: isActive ? C.foret : C.sauge,
                      color: isActive ? C.creme : C.foret,
                      border: "none",
                      borderRadius: "22px 22px 0 0",
                      cursor: "pointer",
                      fontFamily: F.mono,
                      fontWeight: isActive ? 600 : 500,
                      fontSize: "clamp(0.62rem, 1.5vw, 0.95rem)",
                      whiteSpace: "nowrap",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = C.blanc;
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = C.sauge;
                    }}
                  >
                    {t.file}
                    {isActive && i > 0 && <Fillet side="left" />}
                    {isActive && <Fillet side="right" />}
                  </button>
                );
              })}
            </div>

            <div
              className="hidden md:flex flex-1 items-center justify-end self-stretch"
              style={{ ...mono, fontSize: 11, color: C.aun, paddingRight: 8 }}
            >
              Yaoundé · 3.87° N · 11.52° E
            </div>
          </div>

          {/* ── Corps du dossier ── */}
          <div
            className="relative"
            style={{
              background: C.foret,
              borderRadius: "0 28px 28px 28px",
              padding: "clamp(18px, 2.8vw, 34px)",
            }}
          >
            <Cross pos={{ top: 8, left: 10 }} />
            <Cross pos={{ top: 8, right: 10 }} />
            <Cross pos={{ bottom: 8, left: 10 }} />
            <Cross pos={{ bottom: 8, right: 10 }} />

            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
              {/* ══ ÉDITEUR : texte centré, écrit sur les cases ══ */}
              <div className="flex flex-col min-w-0" style={{ background: C.blanc, borderRadius: 16, overflow: "hidden" }}>
                {tab.kind === "terminal" ? (
                  <div id={`panel-${tab.id}`} role="tabpanel" aria-labelledby={`tab-${tab.id}`} className="flex-1 flex flex-col" style={{ minHeight: row * zoneRows }}>
                    <Terminal height={row * zoneRows} reduce={reduce} />
                  </div>
                ) : (
                <div className="relative flex-1" style={{ ...gridStyleFor(row), minHeight: row * zoneRows }}>
                  {/* Gouttière : numéros de ligne alignés sur les rangées */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-y-0 left-0 overflow-hidden select-none"
                    style={{
                      width: 52,
                      background: C.creme,
                      borderRight: "1px solid rgba(30,123,74,0.25)",
                      fontFamily: F.mono,
                      fontSize: 12,
                      lineHeight: `${row}px`,
                      textAlign: "right",
                      paddingRight: 12,
                      color: "rgba(14,47,32,0.45)",
                    }}
                  >
                    {Array.from({ length: 40 }, (_, i) => (
                      <div key={i}>{i + 1}</div>
                    ))}
                  </div>

                  <div style={{ paddingTop: offset, paddingLeft: 52, transition: "padding-top .25s ease" }}>
                    <div ref={textRef}>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.div
                          key={tab.id}
                          role="tabpanel"
                          id={`panel-${tab.id}`}
                          aria-labelledby={`tab-${tab.id}`}
                          initial={reduce ? false : { opacity: 0, x: 14 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={reduce ? undefined : { opacity: 0, x: -14 }}
                          transition={{ duration: 0.25, ease: EASE }}
                          style={{
                            fontFamily: F.body,
                            fontSize: bodySize,
                            lineHeight: `${row}px`,
                            color: C.noir,
                            textAlign: "center",
                            padding: "0 clamp(12px, 3vw, 40px)",
                          }}
                        >
                          <h3
                            style={{
                              fontFamily: F.mono,
                              fontWeight: 700,
                              fontSize: "clamp(1.05rem, 2.2vw, 1.7rem)",
                              lineHeight: `${row}px`,
                              color: C.foret,
                              margin: 0,
                            }}
                          >
                            <span style={{ color: C.aun, marginRight: 10 }}>##</span>
                            {tab.title}
                          </h3>

                          {tab.kind === "text" ? (
                            <p style={{ margin: 0 }}>
                              <Typed segs={tab.segs} start={0} n={typed} reduce={reduce} last />
                            </p>
                          ) : (
                            <ul
                              style={{
                                margin: 0,
                                padding: 0,
                                listStyle: "none",
                                display: "inline-block",
                                textAlign: "left",
                                fontSize: "clamp(0.78rem, 1.9vw, 1.4rem)",
                              }}
                            >
                              {(() => {
                                let start = 0;
                                return tab.items.map((it, idx) => {
                                  const s0 = start;
                                  start += it.segs.reduce((m, s) => m + s.t.length, 0);
                                  return (
                                    <li key={it.k} style={{ lineHeight: `${row}px` }}>
                                      <span
                                        style={{
                                          fontFamily: F.mono,
                                          fontWeight: 700,
                                          color: C.aun,
                                          marginRight: 10,
                                        }}
                                      >
                                        {it.k}
                                      </span>
                                      <Typed
                                        segs={it.segs}
                                        start={s0}
                                        n={typed}
                                        reduce={reduce}
                                        last={idx === tab.items.length - 1}
                                      />
                                    </li>
                                  );
                                });
                              })()}
                            </ul>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
                )}

                {/* Barre d'état */}
                <div
                  className="flex items-center justify-between gap-4 px-4"
                  style={{ ...mono, fontSize: 11, height: 36, background: C.sauge, color: C.foret }}
                >
                  <span>{tab.file} · {tab.kind === "terminal" ? "bash" : "UTF-8"}</span>
                  <span className="hidden sm:inline">
                    {active + 1} / {TABS.length}
                  </span>
                </div>
              </div>

              {/* ══ PANNEAU : badge + données clés ══ */}
              <motion.aside
                {...fadeUp(0.2)}
                className="flex flex-col justify-center gap-6"
                style={{ border: "1px solid rgba(107,175,123,0.35)", borderRadius: 16, padding: 24 }}
              >
                <Badge />

                <dl className="flex flex-col gap-4 m-0" style={{ borderTop: "1px dashed rgba(107,175,123,0.3)", paddingTop: 20 }}>
                  {[
                    ["Statut", "Freelance disponible"],
                    ["Base", "Yaoundé, Cameroun"],
                    ["Formation", "Licence en Génie Informatique"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt style={{ ...mono, fontSize: 11, color: C.mousse }}>{k}</dt>
                      <dd style={{ margin: "4px 0 0", fontSize: 15, color: C.creme }}>{v}</dd>
                    </div>
                  ))}
                </dl>
              </motion.aside>
            </div>

            {/* ══ BARRE DU BAS : stack · chiffres · bouton ══ */}
            <motion.div
              {...fadeUp(0.3)}
              className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5 mt-5 pt-5"
              style={{ borderTop: "1px dashed rgba(107,175,123,0.3)" }}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span style={{ ...mono, fontSize: 11, color: C.mousse, marginRight: 6 }}>Stack</span>
                {STACK.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontFamily: F.mono,
                      fontWeight: 500,
                      fontSize: 12,
                      color: C.sauge,
                      border: "1px solid rgba(220,234,221,0.35)",
                      borderRadius: 8,
                      padding: "5px 10px",
                    }}
                  >
                    {s}
                  </span>
                ))}
              </div>

              <div className="flex gap-8">
                {STATS.map(({ to, label }) => (
                  <div key={label} className="flex items-baseline gap-2.5">
                    <span style={{ fontFamily: F.title, fontWeight: 700, fontSize: 30, lineHeight: 1, color: C.creme }}>
                      <CountUp to={to} />
                    </span>
                    <span style={{ ...mono, fontSize: 10, color: C.mousse }}>{label}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={scrollToContact}
                className="keycap px-6 py-3.5 text-sm font-semibold [--key-face:#f6f4ec] [--key-edge:#6f8f7a] [--key-text:#0e2f20]"
              >
                Me contacter <ArrowRight size={14} />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}