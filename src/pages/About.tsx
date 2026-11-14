import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, animate, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { C, F, EASE, LOGO } from "../components/brand";
import { useLang, type Lang } from "../lib/i18n";

/* ── Réglages ── */
const PHOTO_SRC = "/aaron-cutout.png"; // photo détourée (PNG transparent) ; repli : logo
const STACK = ["React", "FastAPI", "Node.js", "IA / ML"];
const STATS = [
  { to: 5, key: "projects" as const },
  { to: 3, key: "years" as const },
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

const UI = {
  fr: {
    kicker: "À propos",
    facts: [
      ["Statut", "Freelance disponible"],
      ["Base", "Yaoundé, Cameroun"],
      ["Formation", "Licence en Génie Informatique"],
    ],
    stats: { projects: "Projets", years: "Ans d'exp." },
    cta: "Me contacter",
    badgeAria: "Badge d'Aaron KAME MOUELE, développeur web et mobile",
    role: "Développeur web & mobile",
    place: "Freelance · Yaoundé",
    prompt: "visiteur@aun:~$",
    termAria: "Présentation d'Aaron KAME MOUELE, affichée comme un terminal",
    status: "3 fichiers · UTF-8",
  },
  en: {
    kicker: "About",
    facts: [
      ["Status", "Freelance, available"],
      ["Based in", "Yaoundé, Cameroon"],
      ["Education", "Bachelor's in Computer Engineering"],
    ],
    stats: { projects: "Projects", years: "Yrs exp." },
    cta: "Contact me",
    badgeAria: "Badge of Aaron KAME MOUELE, web and mobile developer",
    role: "Web & mobile developer",
    place: "Freelance · Yaoundé",
    prompt: "visitor@aun:~$",
    termAria: "Introduction to Aaron KAME MOUELE, displayed as a terminal",
    status: "3 files · UTF-8",
  },
};

/* ───────── Contenu du terminal ─────────
   b = texte en gras. Chaque bloc = une commande `cat fichier` + son résultat. */
type Seg = { t: string; b?: boolean };
type Block =
  | { id: string; file: string; title: string; kind: "text"; segs: Seg[] }
  | { id: string; file: string; title: string; kind: "list"; items: { k: string; segs: Seg[] }[] };

const BLOCKS_BY_LANG: Record<Lang, Block[]> = {
  fr: [
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
        { t: "J'aime le code propre, les projets qui ont du sens, et les collaborations où chaque détail compte." },
      ],
    },
  ],
  en: [
    {
      id: "parcours",
      file: "story.md",
      title: "My story",
      kind: "text",
      segs: [
        { t: "I'm " },
        { t: "Aaron KAME MOUELE", b: true },
        {
          t: ", a freelance Web & Mobile developer based in Yaoundé. With a Bachelor's degree in Computer Engineering, I've built a complete skill set: ",
        },
        { t: "from pixel to server.", b: true },
      ],
    },
    {
      id: "chemin",
      file: "path.md",
      title: "My path",
      kind: "list",
      items: [
        { k: "01", segs: [{ t: "Bachelor's in Computer Engineering", b: true }] },
        { k: "02", segs: [{ t: "First web and mobile projects", b: true }] },
        { k: "03", segs: [{ t: "Freelancing, for real clients", b: true }] },
        { k: "04", segs: [{ t: "Today: AI and mobile", b: true }] },
      ],
    },
    {
      id: "methode",
      file: "method.md",
      title: "How I work",
      kind: "text",
      segs: [
        { t: "I like clean code, projects that make sense, and collaborations where every detail matters." },
      ],
    },
  ],
};

const segsLen = (segs: Seg[]) => segs.reduce((n, s) => n + s.t.length, 0);
const contentLen = (b: Block) =>
  b.kind === "text" ? segsLen(b.segs) : b.items.reduce((n, it) => n + segsLen(it.segs), 0);

/* Positions de départ (en caractères) de chaque commande et de son résultat */
const CMD_PAUSE = 5; // petite pause « Entrée » entre la commande et son résultat
const BLOCK_GAP = 10; // pause entre deux blocs
function layoutBlocks(blocks: Block[]) {
  let pos = 0;
  const starts = blocks.map((b) => {
    const cmd = `cat ${b.file}`;
    const cmdStart = pos;
    const contentStart = cmdStart + cmd.length + CMD_PAUSE;
    pos = contentStart + contentLen(b) + BLOCK_GAP;
    return { cmd, cmdStart, contentStart };
  });
  return { starts, total: pos - BLOCK_GAP };
}

/* ───────── Frappe : nombre de caractères visibles ───────── */
function useTyping(total: number, run: boolean, resetKey: string, reduce: boolean | null) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (reduce) {
      setN(total);
      return;
    }
    setN(0);
    if (!run) return;
    let i = 0;
    const id = setInterval(() => {
      i += 2;
      if (i >= total) {
        setN(total);
        clearInterval(id);
      } else setN(i);
    }, 16);
    return () => clearInterval(id);
  }, [resetKey, total, run, reduce]);
  return n;
}

const Cursor = ({ reduce }: { reduce: boolean | null }) => (
  <motion.span
    aria-hidden="true"
    animate={reduce ? undefined : { opacity: [1, 1, 0, 0] }}
    transition={{ repeat: Infinity, duration: 1.1, times: [0, 0.5, 0.5, 1] }}
    style={{
      display: "inline-block",
      width: 9,
      height: "1em",
      background: C.sauge,
      marginLeft: 2,
      marginRight: -11,
      verticalAlign: "text-bottom",
    }}
  />
);

/* Affiche les segments : la partie tapée est visible, le reste réserve la place (pas de saut de ligne) */
function Typed({
  segs,
  start,
  n,
  reduce,
  last,
  boldColor,
}: {
  segs: Seg[];
  start: number;
  n: number;
  reduce: boolean | null;
  last: boolean;
  boldColor?: string;
}) {
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
          <span key={i} style={s.b ? { fontWeight: 600, color: boldColor } : undefined}>
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

/* ───────── Terminal (affichage seul : les 3 sections tapées l'une après l'autre) ───────── */
function Terminal({ blocks, lang, reduce }: { blocks: Block[]; lang: Lang; reduce: boolean | null }) {
  const U = UI[lang];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const { starts, total } = layoutBlocks(blocks);
  const n = useTyping(total, inView, lang, reduce);
  const boldColor = C.creme;

  return (
    <div
      ref={ref}
      role="region"
      aria-label={U.termAria}
      className="flex flex-col flex-1"
      style={{
        background: C.noir,
        color: C.sauge,
        fontFamily: F.mono,
        fontSize: "clamp(0.78rem, 1.7vw, 1.02rem)",
        minHeight: 420,
      }}
    >
      <div className="flex items-center gap-2 px-4 shrink-0" style={{ height: 34, borderBottom: "1px solid rgba(107,175,123,0.25)" }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} aria-hidden="true" style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.85 }} />
        ))}
        <span style={{ ...mono, fontSize: 10, color: C.mousse, marginLeft: 8 }}>bash · ~/about</span>
      </div>

      <div className="flex-1 px-5 py-5" style={{ lineHeight: 1.75 }}>
        {blocks.map((b, i) => {
          const { cmd, cmdStart, contentStart } = starts[i];
          const isLast = i === blocks.length - 1;
          let listStart = contentStart;
          return (
            <div
              key={b.id}
              style={{ visibility: n >= cmdStart ? "visible" : "hidden", marginTop: i ? 22 : 0 }}
            >
              <div style={{ overflowWrap: "anywhere" }}>
                <span style={{ color: C.mousse }}>{UI[lang].prompt} </span>
                <span style={{ color: C.creme }}>
                  <Typed segs={[{ t: cmd }]} start={cmdStart} n={n} reduce={reduce} last={false} />
                </span>
              </div>

              <div style={{ visibility: n >= contentStart ? "visible" : "hidden", marginTop: 6 }}>
                <div style={{ fontWeight: 700, color: C.mousse }}>
                  <span style={{ marginRight: 10 }}>##</span>
                  {b.title}
                </div>

                {b.kind === "text" ? (
                  <p style={{ margin: "4px 0 0", overflowWrap: "anywhere" }}>
                    <Typed segs={b.segs} start={contentStart} n={n} reduce={reduce} last={isLast} boldColor={boldColor} />
                  </p>
                ) : (
                  <ul style={{ margin: "4px 0 0", padding: 0, listStyle: "none" }}>
                    {b.items.map((it, idx) => {
                      const s0 = listStart;
                      listStart += segsLen(it.segs);
                      return (
                        <li key={it.k}>
                          <span style={{ fontWeight: 700, color: C.mousse, marginRight: 10 }}>{it.k}</span>
                          <Typed
                            segs={it.segs}
                            start={s0}
                            n={n}
                            reduce={reduce}
                            last={isLast && idx === b.items.length - 1}
                            boldColor={boldColor}
                          />
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="flex items-center justify-between gap-4 px-4 shrink-0"
        style={{ ...mono, fontSize: 11, height: 36, background: C.sauge, color: C.foret }}
      >
        <span>{U.status}</span>
        <span className="hidden sm:inline">bash</span>
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
  const { lang } = useLang();
  const U = UI[lang];
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
        aria-label={U.badgeAria}
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
            {U.role}
            <div style={{ color: C.aun, marginTop: 2 }}>{U.place}</div>
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

export default function About() {
  const reduce = useReducedMotion();
  const { lang } = useLang();
  const U = UI[lang];
  const BLOCKS = BLOCKS_BY_LANG[lang];

  const scrollToContact = () =>
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="about" className="relative py-28 overflow-hidden" style={{ background: C.creme, fontFamily: F.body }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between gap-4 mb-8">
          <motion.p {...fadeUp(0)} className="font-mono-label text-aun m-0">
            <span className="text-moss">01 /</span> {U.kicker}
          </motion.p>
          <div className="hidden md:block" style={{ ...mono, fontSize: 11, color: C.aun }}>
            Yaoundé · 3.87° N · 11.52° E
          </div>
        </div>

        <motion.div {...fadeUp(0.05)} className="relative">
          {/* ── Corps du dossier ── */}
          <div
            className="relative"
            style={{
              background: C.foret,
              borderRadius: 28,
              padding: "clamp(18px, 2.8vw, 34px)",
            }}
          >
            <Cross pos={{ top: 8, left: 10 }} />
            <Cross pos={{ top: 8, right: 10 }} />
            <Cross pos={{ bottom: 8, left: 10 }} />
            <Cross pos={{ bottom: 8, right: 10 }} />

            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
              {/* ══ TERMINAL : parcours · chemin · méthode ══ */}
              <div className="flex flex-col min-w-0" style={{ borderRadius: 16, overflow: "hidden" }}>
                <Terminal key={lang} blocks={BLOCKS} lang={lang} reduce={reduce} />
              </div>

              {/* ══ PANNEAU : badge + données clés ══ */}
              <motion.aside
                {...fadeUp(0.2)}
                className="flex flex-col justify-center gap-6"
                style={{ border: "1px solid rgba(107,175,123,0.35)", borderRadius: 16, padding: 24 }}
              >
                <Badge />

                <dl className="flex flex-col gap-4 m-0" style={{ borderTop: "1px dashed rgba(107,175,123,0.3)", paddingTop: 20 }}>
                  {U.facts.map(([k, v]) => (
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
                {STATS.map(({ to, key }) => (
                  <div key={key} className="flex items-baseline gap-2.5">
                    <span style={{ fontFamily: F.title, fontWeight: 700, fontSize: 30, lineHeight: 1, color: C.creme }}>
                      <CountUp to={to} />
                    </span>
                    <span style={{ ...mono, fontSize: 10, color: C.mousse }}>{U.stats[key]}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={scrollToContact}
                className="keycap px-6 py-3.5 text-sm font-semibold [--key-face:#f6f4ec] [--key-edge:#6f8f7a] [--key-text:#0e2f20]"
              >
                {U.cta} <ArrowRight size={14} />
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}