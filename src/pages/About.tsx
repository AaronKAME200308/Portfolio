import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion, AnimatePresence, animate, useInView, useReducedMotion } from "framer-motion";
import { C, F, EASE, LOGO } from "../components/brand";

/* ── Réglages ── */
const PHOTO_SRC = "/aaron-cutout.png"; // photo détourée (PNG transparent) ; repli : logo
const BADGE_TILT = -10; // inclinaison du badge (0 = droit)
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
];

const countChars = (tab: Tab) =>
  tab.kind === "text"
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

/* ───────── Badge : photo (ou logo) dans un anneau de texte qui tourne ───────── */
function Badge() {
  const reduce = useReducedMotion();
  const [photo, setPhoto] = useState(true);
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.5, duration: 0.5, ease: "backOut" }}
      className="relative mx-auto"
      style={{ width: 196, height: 196, rotate: BADGE_TILT }}
    >
      <motion.svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
        aria-hidden="true"
      >
        <defs>
          <path id="badge-path" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0" />
        </defs>
        <text
          fill={C.mousse}
          style={{ fontFamily: F.mono, fontWeight: 600, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase" }}
        >
          <textPath href="#badge-path" textLength="474" lengthAdjust="spacing">
            Aaron Kame Mouele · Développeur web · Freelance ·
          </textPath>
        </text>
      </motion.svg>

      {photo ? (
        <div
          className="absolute overflow-hidden"
          style={{ inset: "17%", borderRadius: "50%", background: "rgba(30,123,74,0.45)" }}
        >
          <img
            src={PHOTO_SRC}
            alt="Aaron KAME MOUELE"
            onError={() => setPhoto(false)}
            className="w-full h-full block"
            style={{
              objectFit: "cover",
              objectPosition: "50% 12%",
              transform: `rotate(${-BADGE_TILT}deg) scale(1.18)`,
              transformOrigin: "50% 60%",
            }}
          />
        </div>
      ) : (
        <div
          className="absolute"
          role="img"
          aria-label="Aun"
          style={{
            inset: "31%",
            background: C.mousse,
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
  }, [row, zoneRows]);

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
                      padding: "0 clamp(12px, 2.2vw, 26px)",
                      background: isActive ? C.foret : C.sauge,
                      color: isActive ? C.creme : C.foret,
                      border: "none",
                      borderRadius: "22px 22px 0 0",
                      cursor: "pointer",
                      fontFamily: F.mono,
                      fontWeight: isActive ? 600 : 500,
                      fontSize: "clamp(0.72rem, 1.5vw, 0.95rem)",
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

                {/* Barre d'état */}
                <div
                  className="flex items-center justify-between gap-4 px-4"
                  style={{ ...mono, fontSize: 11, height: 36, background: C.sauge, color: C.foret }}
                >
                  <span>{tab.file} · UTF-8</span>
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