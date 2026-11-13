import { useMemo, useRef, useState } from "react";
import type { ComponentType } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Boxes,
  Database,
  Globe,
  Brain,
  Smartphone,
  Server,
  ChevronDown,
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
    icon: Server,
    title: "Conception et réalisation d'API robustes",
    text: "Des APIs REST structurées autour de systèmes précis : schémas validés, authentification, gestion des erreurs et documentation générée avec FastAPI. Aussi en Node.js et Express.",
    tools: ["fastapi", "python", "node", "express", "symfony"],
  },
  {
    icon: Boxes,
    title: "Analyse, conception et réalisation de systèmes d'information",
    text: "De l'expression du besoin à l'application livrée : modélisation UML et Merise, architecture logicielle, développement et suivi du code.",
    tools: ["uml", "merise", "java", "symfony", "postgres"],
  },
  {
    icon: Globe,
    title: "Conception, réalisation et déploiement de sites web",
    text: "Portfolios, sites vitrines et plateformes : de la maquette à la mise en ligne, avec des interfaces rapides, responsives et soignées.",
    tools: ["react", "ts", "tailwind", "figma", "github"],
  },
  {
    icon: Smartphone,
    title: "Conception et réalisation d'applications mobiles",
    text: "Des applications mobiles multiplateformes branchées sur une API et une base de données, pensées pour l'usage réel sur le terrain.",
    tools: ["rn", "js", "ts", "fastapi", "supabase"],
  },
  {
    icon: Brain,
    title: "Entraînement de modèles d'IA et vision par ordinateur",
    text: "Collecte et préparation d'images, entraînement et intégration de modèles de détection, comme pour reconnaître des maladies de plantes.",
    tools: ["python", "tf", "keras"],
  },
  {
    icon: Database,
    title: "Modélisation et administration de bases de données",
    text: "Schémas relationnels propres, requêtes SQL efficaces, authentification et stockage avec Supabase et PostgreSQL.",
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
      className="absolute left-1/2 bottom-10 -ml-[35px] w-[70px] h-[88px] rounded-xl bg-white border border-sage flex flex-col items-center justify-center gap-2 shadow-[0_6px_14px_rgba(14,47,32,0.16)]"
      style={{ transformOrigin: "50% 250%", zIndex: index + 1 }}
      animate={{ rotate: open ? openAngle : closedAngle, y: open ? -6 : 0 }}
      transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 20, delay: open ? index * 0.04 : 0 }}
    >
      <Icon size={26} color={tool.color} />
      <span className="font-mono text-[9px] leading-none text-ink-soft text-center px-1">{tool.name}</span>
    </motion.div>
  );
}

/* ── Carte de compétence ── */
function SkillCard({ skill, index }: { skill: (typeof SKILLS)[number]; index: number }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const pointer = useRef("mouse");
  const Icon = skill.icon;
  const tools = skill.tools.map((k) => T[k]);

  return (
    <motion.article
      {...fadeUp(0.08 * (index % 3))}
      onPointerDown={(e) => (pointer.current = e.pointerType)}
      onPointerEnter={(e) => e.pointerType === "mouse" && setOpen(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setOpen(false)}
      onClick={() => pointer.current !== "mouse" && setOpen((o) => !o)}
      className={`relative flex flex-col rounded-[1.25rem] border bg-white/[0.04] p-6 pb-0 transition-colors duration-300 cursor-default ${
        open ? "border-moss" : "border-white/10"
      }`}
    >
      <div className="flex items-start justify-between mb-5">
        <span className="w-11 h-11 rounded-xl bg-moss flex items-center justify-center">
          <Icon size={20} className="text-forest" />
        </span>
        <span className="font-mono-label text-moss">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <h3 className="font-display font-bold text-[1.2rem] leading-snug mb-3 !text-cream" style={{ letterSpacing: "-0.01em" }}>
        {skill.title}
      </h3>
      <p className="text-sm leading-relaxed text-sage/75 mb-5">{skill.text}</p>

      {/* Éventail d'outils */}
      <div className="relative mt-auto -mx-6 h-[168px] border-t border-dashed border-moss/40 overflow-hidden rounded-b-[1.25rem] bg-black/20">
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
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cream text-forest font-mono-label !text-[10px] cursor-pointer border-0"
        >
          Outils · {tools.length}
          <ChevronDown size={12} className={`transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
    </motion.article>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative overflow-hidden bg-forest pt-24 pb-32 lg:pt-32 lg:pb-40">
      {/* Halo vert discret */}
      <div
        className="absolute -top-40 -right-40 w-[560px] h-[560px] rounded-full pointer-events-none"
        aria-hidden="true"
        style={{ background: "radial-gradient(circle, rgba(30,123,74,0.35), transparent 70%)" }}
      />
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
              Ce que je sais <span className="text-moss">faire</span>, pas seulement ce que j'utilise.
            </motion.h2>
          </div>
          <motion.p {...fadeUp(0.2)} className="text-sm text-sage/70 max-w-xs">
            Survole une carte (ou touche-la sur mobile) pour dévoiler les outils derrière chaque compétence.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS.map((s, i) => (
            <SkillCard key={s.title} skill={s} index={i} />
          ))}
        </div>
      </div>

      <TornEdge />
    </section>
  );
}