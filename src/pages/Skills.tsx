import { useMemo, useRef, useState } from "react";
import type { ComponentType } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLang } from "../lib/i18n";
import {
  ChevronDown,
  Scissors,
  Workflow,
  Network,
  Table2,
} from "lucide-react";
import {
  SiFastapi,
  SiPython,
  SiNodedotjs,
  SiExpress,
  SiSymfony,
  SiPostgresql,
  SiReact,
  SiTypescript,
  SiJavascript,
  SiTailwindcss,
  SiFigma,
  SiGithub,
  SiSupabase,
  SiTensorflow,
  SiKeras,
  SiMysql,
} from "react-icons/si";
import { FaJava } from "react-icons/fa";


const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: EASE },
});

/* ── Outils : logo (couleur officielle) + nom ── */
type IconC = ComponentType<{ size?: number; color?: string; className?: string }>;
type Tool = { name: string; icon: IconC; color: string };

const T: Record<string, Tool> = {
  fastapi: { name: "FastAPI", icon: SiFastapi, color: "#009688" },
  python: { name: "Python", icon: SiPython, color: "#3776AB" },
  node: { name: "Node.js", icon: SiNodedotjs, color: "#5FA04E" },
  express: { name: "Express", icon: SiExpress, color: "#0b0f0c" },
  symfony: { name: "Symfony", icon: SiSymfony, color: "#0b0f0c" },
  java: { name: "Java", icon: FaJava, color: "#E76F00" },
  postgres: { name: "PostgreSQL", icon: SiPostgresql, color: "#336791" },
  mysql: { name: "MySQL", icon: SiMysql, color: "#00758F" },
  supabase: { name: "Supabase", icon: SiSupabase, color: "#3ECF8E" },
  react: { name: "React", icon: SiReact, color: "#149ECA" },
  rn: { name: "React Native", icon: SiReact, color: "#149ECA" },
  ts: { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
  js: { name: "JavaScript", icon: SiJavascript, color: "#D4B106" },
  tailwind: { name: "Tailwind", icon: SiTailwindcss, color: "#06B6D4" },
  figma: { name: "Figma", icon: SiFigma, color: "#F24E1E" },
  github: { name: "GitHub", icon: SiGithub, color: "#0b0f0c" },
  tf: { name: "TensorFlow", icon: SiTensorflow, color: "#E8710A" },
  keras: { name: "Keras", icon: SiKeras, color: "#D00000" },
  // Pas de logo officiel : icônes de la charte
  uml: { name: "UML", icon: Workflow as IconC, color: "#1e7b4a" },
  merise: { name: "Merise", icon: Network as IconC, color: "#1e7b4a" },
  sql: { name: "SQL", icon: Table2 as IconC, color: "#1e7b4a" },
};

/* ── Compétences ── */
const SKILLS = [
  {
    fr: {
      title: "Conception et réalisation d'API robustes",
      text: "Des APIs REST structurées autour de systèmes précis : schémas validés, authentification, gestion des erreurs et documentation générée avec FastAPI. Aussi en Node.js et Express.",
    },
    en: {
      title: "Design and development of robust APIs",
      text: "REST APIs built around precise systems: validated schemas, authentication, error handling and auto-generated documentation with FastAPI. Also in Node.js and Express.",
    },
    tools: ["fastapi", "python", "node", "express", "symfony"],
  },
  {
    fr: {
      title: "Analyse, conception et réalisation de systèmes d'information",
      text: "De l'expression du besoin à l'application livrée : modélisation UML et Merise, architecture logicielle, développement et suivi du code.",
    },
    en: {
      title: "Analysis, design and development of information systems",
      text: "From the initial need to the delivered application: UML and Merise modeling, software architecture, development and code tracking.",
    },
    tools: ["uml", "merise", "java", "symfony", "postgres"],
  },
  {
    fr: {
      title: "Conception, réalisation et déploiement de sites web",
      text: "Portfolios, sites vitrines et plateformes : de la maquette à la mise en ligne, avec des interfaces rapides, responsives et soignées.",
    },
    en: {
      title: "Design, development and deployment of websites",
      text: "Portfolios, showcase sites and platforms: from mockup to launch, with fast, responsive and polished interfaces.",
    },
    tools: ["react", "ts", "tailwind", "figma", "github"],
  },
  {
    fr: {
      title: "Conception et réalisation d'applications mobiles",
      text: "Des applications mobiles multiplateformes branchées sur une API et une base de données, pensées pour l'usage réel sur le terrain.",
    },
    en: {
      title: "Design and development of mobile applications",
      text: "Cross-platform mobile apps connected to an API and a database, built for real-world use in the field.",
    },
    tools: ["rn", "js", "ts", "fastapi", "supabase"],
  },
  {
    fr: {
      title: "Entraînement de modèles d'IA et vision par ordinateur",
      text: "Collecte et préparation d'images, entraînement et intégration de modèles de détection, comme pour reconnaître des maladies de plantes.",
    },
    en: {
      title: "AI model training and computer vision",
      text: "Image collection and preparation, training and integration of detection models, such as recognizing plant diseases.",
    },
    tools: ["python", "tf", "keras"],
  },
  {
    fr: {
      title: "Modélisation et administration de bases de données",
      text: "Schémas relationnels propres, requêtes SQL efficaces, authentification et stockage avec Supabase et PostgreSQL.",
    },
    en: {
      title: "Database modeling and administration",
      text: "Clean relational schemas, efficient SQL queries, authentication and storage with Supabase and PostgreSQL.",
    },
    tools: ["postgres", "supabase", "sql", "mysql"],
  },
];

/* Bord de papier déchiré (crème) vers la section suivante */
function TornEdge({ fill = "#f6f4ec" }: { fill?: string }) {
  const d = useMemo(() => {
    const w = 1440, h = 40, steps = 80;
    let p = `M0 ${h} L0 14`;
    for (let i = 1; i <= steps; i++) {
      const r = Math.abs((Math.sin(i * 91.7) * 43758.5453) % 1);
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

/* ── Mini-carte d'outil ── */
function ToolCard({ tool, index, total, open, reduce }: { tool: Tool; index: number; total: number; open: boolean; reduce: boolean | null }) {
  const c = (total - 1) / 2;
  const openAngle = (index - c) * (total > 4 ? 14 : 17);
  const closedAngle = (index - c) * 1.4;
  const Icon = tool.icon;
  return (
    <motion.div
      className="absolute left-1/2 bottom-10 -ml-[35px] w-[70px] h-[88px] rounded-sm bg-white border border-sage flex flex-col items-center justify-center gap-2 shadow-[0_6px_14px_rgba(14,47,32,0.16)]"
      style={{ transformOrigin: "50% 250%", zIndex: index + 1 }}
      animate={{ rotate: open ? openAngle : closedAngle, y: open ? -6 : 0 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 20, delay: open ? index * 0.04 : 0 }}
    >
      <Icon size={26} color={tool.color} />
      <span className="font-mono text-[9px] leading-none text-ink-soft text-center px-1">{tool.name}</span>
    </motion.div>
  );
}

/* ── Mini-scènes animées (une par compétence) ── */
const INK = "#0e2f20";
const AUN = "#1e7b4a";
const MOSS = "#6baf7b";
const monoF = "'JetBrains Mono', monospace";

type R = { r: boolean | null };
type AP = { r: boolean | null; attributeName: string; values: string; dur: string; keyTimes?: string; begin?: string; type?: string };
const An = ({ r, ...p }: AP) => (r ? null : <animate {...p} repeatCount="indefinite" />);
const AnT = ({ r, type, ...p }: AP) =>
  r ? null : <animateTransform {...p} type={type as "translate"} repeatCount="indefinite" />;

const SceneApi = ({ r }: R) => (
  <g>
    <rect x="22" y="32" width="62" height="48" rx="9" fill="#fff" stroke={INK} strokeWidth="2" />
    <text x="53" y="61" textAnchor="middle" fontSize="11" fontFamily={monoF} fill={INK}>client</text>
    <rect x="216" y="32" width="62" height="48" rx="9" fill={INK} />
    <text x="247" y="61" textAnchor="middle" fontSize="11" fontFamily={monoF} fill={MOSS}>API</text>
    <line x1="90" y1="46" x2="210" y2="46" stroke={INK} strokeOpacity=".25" strokeDasharray="3 4" />
    <line x1="90" y1="66" x2="210" y2="66" stroke={INK} strokeOpacity=".25" strokeDasharray="3 4" />
    <circle r="4.5" cy="46" cx="94" fill={AUN}>
      <An r={r} attributeName="cx" values="94;206;206" keyTimes="0;0.5;1" dur="2.4s" />
    </circle>
    <circle r="4.5" cy="66" cx="206" fill={MOSS}>
      <An r={r} attributeName="cx" values="206;206;94" keyTimes="0;0.5;1" dur="2.4s" />
    </circle>
    <text x="150" y="38" textAnchor="middle" fontSize="8.5" fontFamily={monoF} fill={INK}>POST /users</text>
    <text x="150" y="86" textAnchor="middle" fontSize="8.5" fontFamily={monoF} fill={AUN} fontWeight="700">
      201 Created
      <An r={r} attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.5;0.6;0.9;1" dur="2.4s" />
    </text>
  </g>
);

const SceneSi = ({ r }: R) => {
  const { lang } = useLang();
  const names = lang === "en" ? ["Customer", "Order", "Product"] : ["Client", "Commande", "Produit"];
  const box = (x: number, y: number, label: string) => (
    <g key={label}>
      <rect x={x} y={y} width="74" height="40" rx="6" fill="#fff" stroke={INK} strokeWidth="2" />
      <rect x={x} y={y} width="74" height="13" rx="6" fill={INK} />
      <text x={x + 37} y={y + 10} textAnchor="middle" fontSize="8" fontFamily={monoF} fill={MOSS}>{label}</text>
      <line x1={x + 8} y1={y + 24} x2={x + 52} y2={y + 24} stroke={INK} strokeOpacity=".3" strokeWidth="2" strokeLinecap="round" />
      <line x1={x + 8} y1={y + 32} x2={x + 38} y2={y + 32} stroke={INK} strokeOpacity=".3" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
  return (
    <g>
      <path d="M94 42 L120 62 M196 62 L224 42" stroke={AUN} strokeWidth="2" strokeDasharray="5 5" fill="none">
        <An r={r} attributeName="stroke-dashoffset" values="0;-20" dur="1.2s" />
      </path>
      {box(14, 16, names[0])}
      {box(113, 58, names[1])}
      {box(212, 16, names[2])}
      <circle r="4" fill={MOSS}>
        <AnT r={r} attributeName="transform" type="translate" values="94 42;120 62;94 42" dur="2.4s" />
      </circle>
    </g>
  );
};

const SceneWeb = ({ r }: R) => {
  const bar = (y: number, w: number, d: string, fill = INK, op = ".18") => (
    <rect key={y} x="84" y={y} height="9" rx="4.5" fill={fill} fillOpacity={op} width="0">
      <An r={r} attributeName="width" values={`0;${w};${w};0`} keyTimes="0;0.35;0.85;1" dur="3.4s" begin={d} />
    </rect>
  );
  return (
    <g>
      <rect x="64" y="10" width="172" height="94" rx="9" fill="#fff" stroke={INK} strokeWidth="2" />
      <line x1="64" y1="27" x2="236" y2="27" stroke={INK} strokeWidth="2" />
      <circle cx="76" cy="18.5" r="2.5" fill={INK} fillOpacity=".3" />
      <circle cx="85" cy="18.5" r="2.5" fill={INK} fillOpacity=".3" />
      <circle cx="94" cy="18.5" r="2.5" fill={INK} fillOpacity=".3" />
      <rect x="84" y="36" width="0" height="26" rx="5" fill={AUN}>
        <An r={r} attributeName="width" values="0;132;132;0" keyTimes="0;0.3;0.85;1" dur="3.4s" />
      </rect>
      {bar(70, 96, "0.25s")}
      {bar(84, 66, "0.5s")}
    </g>
  );
};

const SceneMobile = ({ r }: R) => (
  <g>
    <rect x="116" y="6" width="68" height="100" rx="12" fill="#fff" stroke={INK} strokeWidth="2.2" />
    <rect x="144" y="10" width="12" height="3" rx="1.5" fill={INK} fillOpacity=".4" />
    <rect x="126" y="62" width="48" height="8" rx="4" fill={INK} fillOpacity=".15" />
    <rect x="126" y="76" width="34" height="8" rx="4" fill={INK} fillOpacity=".15" />
    <rect x="126" y="90" width="42" height="8" rx="4" fill={INK} fillOpacity=".15" />
    <g>
      <rect x="123" y="20" width="54" height="22" rx="7" fill={INK} />
      <circle cx="134" cy="31" r="4" fill={MOSS} />
      <rect x="143" y="26" width="26" height="4" rx="2" fill={MOSS} />
      <rect x="143" y="33" width="18" height="4" rx="2" fill="#fff" fillOpacity=".5" />
      <AnT r={r} attributeName="transform" type="translate" values="0 -34;0 0;0 0;0 -34" keyTimes="0;0.2;0.75;1" dur="3s" />
      <An r={r} attributeName="opacity" values="0;1;1;0" keyTimes="0;0.2;0.75;1" dur="3s" />
    </g>
    <path d="M66 56 q-10 0 -10 10 M60 48 q-20 0 -20 18" stroke={AUN} strokeWidth="2" fill="none" strokeLinecap="round" strokeOpacity=".6" />
    <path d="M234 56 q10 0 10 10 M240 48 q20 0 20 18" stroke={AUN} strokeWidth="2" fill="none" strokeLinecap="round" strokeOpacity=".6" />
  </g>
);

const SceneIa = ({ r }: R) => {
  const { lang } = useLang();
  return (
  <g>
    <g transform="translate(150 58) rotate(-28)">
      <path d="M-46 0 C-24 -34 24 -34 46 0 C24 34 -24 34 -46 0 Z" fill={AUN} />
      <line x1="-46" y1="0" x2="40" y2="0" stroke="#fff" strokeOpacity=".7" strokeWidth="2" />
      <circle cx="-8" cy="-9" r="4" fill="#7a4b1f" />
      <circle cx="14" cy="8" r="3" fill="#7a4b1f" />
    </g>
    <path d="M92 28 v-10 h10 M208 28 v-10 h-10 M92 90 v10 h10 M208 90 v10 h-10" stroke={INK} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    <line x1="96" x2="204" y1="24" y2="24" stroke={MOSS} strokeWidth="2.5" strokeLinecap="round">
      <An r={r} attributeName="y1" values="24;94;24" dur="3s" />
      <An r={r} attributeName="y2" values="24;94;24" dur="3s" />
    </line>
    <rect x="212" y="48" width="62" height="18" rx="5" fill={INK} />
    <text x="243" y="60" textAnchor="middle" fontSize="8.5" fontFamily={monoF} fill={MOSS}>{lang === "en" ? "blight 94%" : "mildiou 94%"}</text>
  </g>
  );
};

const SceneDb = ({ r }: R) => {
  const { lang } = useLang();
  const heads = lang === "en" ? ["id", "name", "role"] : ["id", "nom", "rôle"];
  const rows = [48, 64, 80];
  return (
    <g>
      <rect x="62" y="12" width="176" height="92" rx="8" fill="#fff" stroke={INK} strokeWidth="2" />
      <rect x="62" y="12" width="176" height="22" rx="8" fill={INK} />
      {heads.map((h, i) => (
        <text key={h} x={74 + i * 58} y="27" fontSize="9" fontFamily={monoF} fill={MOSS}>{h}</text>
      ))}
      {rows.map((y, ri) => (
        <g key={y} opacity="0">
          {[0, 1, 2].map((c) => (
            <rect key={c} x={74 + c * 58} y={y - 7} width={c === 0 ? 14 : 36} height="8" rx="4" fill={ri === 2 ? AUN : INK} fillOpacity={ri === 2 ? ".85" : ".2"} />
          ))}
          <An r={r} attributeName="opacity" values="0;1;1;0" keyTimes={`0;${0.12 + ri * 0.15};0.9;1`} dur="3.4s" />
        </g>
      ))}
    </g>
  );
};

const SCENES = [SceneApi, SceneSi, SceneWeb, SceneMobile, SceneIa, SceneDb];

/* ── Code-barres décoratif, propre à chaque ticket ── */
function Barcode({ seed }: { seed: number }) {
  const bars = useMemo(() => {
    let x = 0;
    const out: { x: number; w: number }[] = [];
    for (let i = 0; i < 22; i++) {
      const w = 1 + Math.floor(Math.abs(Math.sin((i + 1) * (seed + 3.7)) * 10) % 3);
      out.push({ x, w });
      x += w + 1.6;
    }
    return { out, width: x };
  }, [seed]);
  return (
    <svg viewBox={`0 0 ${bars.width} 22`} className="h-[22px] w-auto" aria-hidden="true">
      {bars.out.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height="22" fill={INK} fillOpacity=".75" />
      ))}
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

/* ── Carte de compétence : un ticket qu'on déchire ── */
function SkillCard({ skill, index }: { skill: (typeof SKILLS)[number]; index: number }) {
  const reduce = useReducedMotion();
  const { lang } = useLang();
  const tx = skill[lang];
  const [open, setOpen] = useState(false);
  const pointer = useRef("mouse");
  const Scene = SCENES[index];
  const tools = skill.tools.map((k) => T[k]);
  const rest = [-0.9, 0.6, -0.5, 0.7, -0.6, 0.8][index % 6];

  return (
    <motion.article
      {...fadeUp(0.08 * (index % 3))}
      onPointerDown={(e) => (pointer.current = e.pointerType)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      onClick={() => pointer.current !== "mouse" && setOpen((o) => !o)}
      className="relative cursor-default"
      style={{ filter: "drop-shadow(0 14px 18px rgba(0,0,0,0.35))" }}
    >
      <motion.div
        animate={{ rotate: open ? 0 : rest, y: open ? -6 : 0 }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 18 }}
      >
        {/* Partie principale */}
        <div
          className="relative bg-cream rounded-t-sm px-6 pt-5 pb-7"
          style={notchMask("bottom")}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="font-mono-label !text-[10px] text-ink-mute leading-tight">
                {lang === "en" ? "No." : "N°"} {String(index + 1).padStart(2, "0")}
                <br />
                <span className="text-aun">{lang === "en" ? "Skill" : "Compétence"}</span>
              </span>
            </div>
            <Barcode seed={index + 1} />
          </div>

          <div className="relative h-[112px] rounded-sm bg-sage/70 border border-sage mb-5 overflow-hidden">
            <svg viewBox="0 0 300 112" className="absolute inset-0 w-full h-full" aria-hidden="true">
              <defs>
                <pattern id={`dots-${index}`} width="14" height="14" patternUnits="userSpaceOnUse">
                  <circle cx="1.5" cy="1.5" r="1" fill="#0e2f20" fillOpacity=".12" />
                </pattern>
              </defs>
              <rect width="300" height="112" fill={`url(#dots-${index})`} />
              <Scene r={reduce} />
            </svg>
          </div>

          <h3 className="font-display font-bold text-[1.2rem] leading-snug mb-3" style={{ letterSpacing: "-0.01em" }}>
            {tx.title}
          </h3>
          <p className="text-sm leading-relaxed text-ink-mute m-0">{tx.text}</p>
        </div>

        {/* Talon détachable : l'éventail d'outils */}
        <motion.div
          className="relative bg-[#e6eee4] rounded-b-sm h-[172px] overflow-hidden"
          style={{ ...notchMask("top"), transformOrigin: "100% 0" }}
          animate={{ y: open ? 12 : 0, rotate: open ? -2.2 : 0 }}
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 16 }}
        >
          <div
            className="absolute top-0 left-[14px] right-[14px] border-t-2 border-dashed border-[#b9c9bb]"
            aria-hidden="true"
          />
          {tools.map((t, i) => (
            <ToolCard key={t.name + i} tool={t} index={i} total={tools.length} open={open} reduce={reduce} />
          ))}
          <button
            type="button"
            aria-expanded={open}
            onClick={(e) => {
              e.stopPropagation();
              setOpen((o) => (pointer.current === "mouse" ? true : !o));
            }}
            className="absolute bottom-2.5 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded bg-forest text-cream font-mono-label !text-[10px] cursor-pointer border-0 whitespace-nowrap"
          >
            <Scissors size={11} />
            {lang === "en" ? "Tools" : "Outils"} · {tools.length}
            <ChevronDown size={12} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
          </button>
        </motion.div>
      </motion.div>
    </motion.article>
  );
}

export default function Skills() {
  const { lang } = useLang();
  return (
    <section id="skills" className="relative overflow-hidden bg-forest pt-24 pb-32 lg:pt-32 lg:pb-40">
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14">
          <div>
            <motion.p {...fadeUp(0)} className="font-mono-label text-sage mb-5">
              <span className="text-moss">02 /</span> Compétences
            </motion.p>
            <motion.h2
              {...fadeUp(0.1)}
              className="font-display font-extrabold leading-[1.05] max-w-2xl !text-cream"
              style={{ fontSize: "clamp(2.2rem, 4.6vw, 3.6rem)", letterSpacing: "-0.03em" }}
            >
              {lang === "en" ? (
                <>What I can <span className="text-moss">do</span>, not just what I use.</>
              ) : (
                <>Ce que je sais <span className="text-moss">faire</span>, pas seulement ce que j'utilise.</>
              )}
            </motion.h2>
          </div>
          <motion.p {...fadeUp(0.2)} className="text-sm text-sage/70 max-w-xs">
            {lang === "en"
              ? "Hover a ticket (or tap it on mobile) to tear off the stub and reveal the tools behind each skill."
              : "Survolez un ticket (ou touchez-le sur mobile) pour déchirer le talon et dévoiler les outils derrière chaque compétence."}
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS.map((s, i) => (
            <SkillCard key={i} skill={s} index={i} />
          ))}
        </div>
      </div>

      <TornEdge />
    </section>
  );
}