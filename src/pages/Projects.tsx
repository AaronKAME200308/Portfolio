import { useState } from "react";
import { type LucideIcon, ExternalLink, Github, Globe, Leaf, LayoutGrid, Monitor, AppWindow, Smartphone, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

// ── Catégories ────────────────────────────────────────────
type Category = "Tous" | "Portfolio" | "Site web" | "Application web" | "Application mobile" | "IA / ML";

const CATEGORIES: { key: Category; icon: React.ReactNode }[] = [
  { key: "Tous",               icon: <LayoutGrid size={13} />  },
  { key: "Portfolio",          icon: <Monitor size={13} />     },
  { key: "Site web",           icon: <Globe size={13} />       },
  { key: "Application web",    icon: <AppWindow size={13} />   },
  { key: "Application mobile", icon: <Smartphone size={13} />  },
  { key: "IA / ML",            icon: <Brain size={13} />       },
];

// ── Projets ───────────────────────────────────────────────
// logo     : string = chemin image | React.ElementType = icône Lucide
// logoBg   : couleur de fond du bloc (défaut: "#fff" pour image, gradient pour icône)
// logoSize : taille de l'image en % dans le bloc (défaut: 70)
// logoFit  : "contain" | "cover" (défaut: "contain")
const projects = [
  {
    id: 1,
    title: "PlantGuard AI",
    subtitle: "Application mobile IA",
    description:
      "Application mobile permettant la détection des maladies des plantes grâce à l'intelligence artificielle. Modèle de vision par ordinateur entraîné sur des milliers d'images de feuilles.",
    tags: ["React Native", "FastAPI", "Python", "TensorFlow", "PostgreSQL"],
    logo: Leaf,
    logoBg: undefined,       // undefined = gradient auto pour les icônes Lucide
    logoSize: 70,            // % de la taille du bloc (ignoré pour les icônes Lucide)
    logoFit: "contain" as const,
    status: "Terminé",
    gradient: "linear-gradient(135deg, #34d399, #14b8a6)",
    accent: "#10b981",
    link: "",
    featured: true,
    category: "Application mobile" as Category,
  },
  {
    id: 2,
    title: "Infinite Luxury Trips",
    subtitle: "Site de voyage",
    description:
      "Plateforme de voyage moderne avec exploration de destinations, galeries d'images immersives et interface de réservation. Design soigné, navigation fluide.",
    tags: ["React JS", "Tailwind CSS", "Node.js", "Supabase"],
    logo: "https://infiniteluxurytrips.net/logoilt.jpeg",
    logoBg: undefined,
    logoSize: 70,
    logoFit: "cover" as const,
    status: "Terminé",
    gradient: "linear-gradient(135deg, #231A55, #4535A0)",
    accent: "#4535A0",
    link: "https://infiniteluxurytrips.net",
    featured: false,
    category: "Application web" as Category,
  },
  {
    id: 3,
    title: "Portfolio JP Graphic Design",
    subtitle: "Site vitrine freelance",
    description:
      "Site portfolio pour un graphiste freelance, mettant en avant ses réalisations avec une galerie d'images, une section de réservations clients et un formulaire de contact intégré.",
    tags: ["React JS", "Tailwind CSS", "Supabase"],
    logo: "https://jpgraphicdesign.net/logoblanc.png",
    logoBg: "linear-gradient(135deg,#f2cc6a,#f2cc6a)",          // fond blanc pour ce logo
    logoSize: 70,            // 70% du bloc
    logoFit: "contain" as const,
    status: "En ligne",
    gradient: "linear-gradient(135deg,#f2cc6a,#f2cc6a)",
    accent: "#f2cc6a",
    link: "https://jpgraphicdesign.net",
    featured: false,
    category: "Portfolio" as Category,
  },
  {
    id: 4,
    title: "Vitrine Pro Yapithe & Partners",
    subtitle: "Site vitrine entreprise",
    description:
      "Site vitrine pour une entreprise locale, avec présentation des services, témoignages clients et formulaire de contact intégré. Vidéo Youtube, Blog et bien plus",
    tags: ["React JS", "Tailwind CSS", "Node js"],
    logo: "/images.png",
    logoBg: undefined,
    logoSize: 70,
    logoFit: "cover" as const,
    status: "Livré",
    gradient: "linear-gradient(135deg, #0a4d7c, #23c367)",
    accent: "#23c367",
    link: "https://yapithepartners.com/",
    featured: false,
    category: "Site web" as Category,
  },
];

// ── Status colors ─────────────────────────────────────────
const statusColors: Record<string, { bg: string; text: string }> = {
  "Terminé":  { bg: "rgba(16,185,129,0.1)",  text: "#059669" },
  "En ligne": { bg: "rgba(59,130,246,0.1)",  text: "#2563eb" },
  "Livré":    { bg: "rgba(245,158,11,0.1)",  text: "#d97706" },
};

// ── ProjectIcon — image URL ou composant Lucide ───────────
const ProjectIcon = ({
  logo,
  gradient,
  logoBg,
  logoSize = 70,
  logoFit  = "contain",
  sizeLg   = false,
}: {
  logo:      string | LucideIcon;
  gradient:  string;
  logoBg?:   string;
  logoSize?: number;
  logoFit?:  "contain" | "cover";
  sizeLg?:   boolean;
}) => {
  const sizeClass = sizeLg ? "w-24 h-24 rounded-3xl" : "w-12 h-12 rounded-2xl";
  const iconSize  = sizeLg ? 40 : 22;

  if (typeof logo === "string") {
    const bg = logoBg ?? "#fff";
    return (
      <div
        className={`${sizeClass} overflow-hidden shadow-xl flex items-center justify-center`}
        style={{
          background: bg,
          border: logoBg ? "none" : "1.5px solid #e2e8f0",
        }}
      >
        <img
          src={logo}
          alt="logo"
          style={{
            width:      logoFit === "cover" ? "100%" : `${logoSize}%`,
            height:     logoFit === "cover" ? "100%" : `${logoSize}%`,
            objectFit:  logoFit,
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
    );
  }

  // Composant Lucide — logoBg permet de surcharger le gradient
  const Icon = logo;
  return (
    <div
      className={`${sizeClass} flex items-center justify-center shadow-xl`}
      style={{ background: logoBg ?? gradient }}
    >
      <Icon size={iconSize} className="text-white" />
    </div>
  );
};


const FeaturedCard = ({ project }: { project: typeof projects[0] }) => {
  const status = statusColors[project.status] ?? { bg: "#f1f5f9", text: "#64748b" };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="group relative rounded-3xl overflow-hidden cursor-pointer"
      style={{
        background: "#fff",
        border: `1.5px solid ${project.accent}`,
        boxShadow: "0 2px 16px rgba(0,0,0,0.05)",
        minHeight: 280,
      }}
      whileHover={{ y: -5, boxShadow: "0 16px 48px rgba(0,0,0,0.12)" } as any}
      onClick={() => project.link && window.open(project.link, "_blank")}
    >
      <div className="absolute top-0 left-0 right-0"
        style={{ height: 8, background: project.gradient, transform: "skewY(-1deg)", transformOrigin: "top left" }} />

      <div className="grid md:grid-cols-2 gap-0 h-full">
        {/* Left visual */}
        <div className="relative flex items-center justify-center p-12"
          style={{ background: `linear-gradient(135deg, ${project.accent}08, ${project.accent}18)`, minHeight: 240 }}>
          <div className="absolute" style={{ width: 220, height: 220, borderRadius: "50%", background: project.gradient, opacity: 0.08, right: -40, top: "50%", transform: "translateY(-50%)" }} />
          <ProjectIcon logo={project.logo} gradient={project.gradient} logoBg={project.logoBg} logoSize={project.logoSize} logoFit={project.logoFit} sizeLg />
          <span className="absolute top-5 left-5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{ background: "rgba(255,255,255,0.85)", color: "#475569", backdropFilter: "blur(4px)" }}>
            {project.category}
          </span>
          <span className="absolute bottom-5 left-5 px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: status.bg, color: status.text }}>
            {project.status}
          </span>
        </div>

        {/* Right content */}
        <div className="p-8 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: project.accent }}>
              Featured Project
            </div>
            <h3 className="font-black text-3xl mb-1"
              style={{ color: "#0f172a", fontFamily: "'Syne', sans-serif", lineHeight: 1.1 }}>
              {project.title}
            </h3>
            <p className="text-sm mb-4" style={{ color: "#94a3b8" }}>{project.subtitle}</p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#475569" }}>{project.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-6">
              {project.tags.map((tag) => (
                <span key={tag} className="px-2.5 py-1 rounded-lg text-xs font-medium"
                  style={{ background: `${project.accent}10`, color: project.accent, border: `1px solid ${project.accent}20` }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{ background: "#f8fafc", color: "#64748b", border: `1.5px solid ${project.accent}` }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = project.accent; (e.currentTarget as HTMLElement).style.color = project.accent; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = project.accent  ; (e.currentTarget as HTMLElement).style.color = "#64748b"; }}>
              <Github size={14} /> Code
            </button>
            {project.link && (
              <button onClick={() => window.open(project.link, "_blank")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-200"
                style={{ background: project.gradient, boxShadow: `0 4px 14px ${project.accent}40` }}>
                <ExternalLink size={14} /> Voir le projet
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ── Small card ────────────────────────────────────────────
const SmallCard = ({ project, index }: { project: typeof projects[0]; index: number }) => {
  const status = statusColors[project.status] ?? { bg: "#f1f5f9", text: "#64748b" };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
      className="group relative rounded-3xl overflow-hidden cursor-pointer flex flex-col"
      style={{ background: "#fff", border: `1.5px solid ${project.accent}`, boxShadow: "0 2px 16px rgba(0,0,0,0.05)" }}
      whileHover={{ y: -5, boxShadow: "0 16px 48px rgba(0,0,0,0.11)" } as any}
      onClick={() => project.link && window.open(project.link, "_blank")}
    >
      <div style={{ height: 6, background: project.gradient, transform: "skewY(-1.5deg)", transformOrigin: "top left", flexShrink: 0 }} />

      <div className="relative flex items-center justify-between px-6 py-5"
        style={{ background: `linear-gradient(135deg, ${project.accent}06, ${project.accent}12)` }}>
        <ProjectIcon logo={project.logo} gradient={project.gradient} logoBg={project.logoBg} logoSize={project.logoSize} logoFit={project.logoFit} />
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
            style={{ background: "rgba(255,255,255,0.85)", color: "#475569" }}>
            {project.category}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: status.bg, color: status.text }}>
            {project.status}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-black text-xl mb-0.5" style={{ color: "#0f172a", fontFamily: "'Syne', sans-serif" }}>
          {project.title}
        </h3>
        <p className="text-xs mb-3" style={{ color: "#94a3b8" }}>{project.subtitle}</p>
        <p className="text-sm leading-relaxed mb-4 flex-1" style={{ color: "#475569" }}>{project.description}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-1 rounded-lg text-[11px] font-medium"
              style={{ background: `${project.accent}10`, color: project.accent, border: `1px solid ${project.accent}20` }}>
              {tag}
            </span>
          ))}
          {project.tags.length > 3 && (
            <span className="px-2 py-1 rounded-lg text-[11px] font-medium" style={{ background: "#f1f5f9", color: "#94a3b8" }}>
              +{project.tags.length - 3}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
            style={{ background: "#f8fafc", color: "#64748b", border: `1.5px solid ${project.accent}` }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = project.accent; (e.currentTarget as HTMLElement).style.color = project.accent; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = project.accent; (e.currentTarget as HTMLElement).style.color = "#64748b"; }}>
            <Github size={12} /> Code
          </button>
          {project.link && (
            <button onClick={(e) => { e.stopPropagation(); window.open(project.link, "_blank"); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-white transition-all"
              style={{ background: project.gradient }}>
              <ExternalLink size={12} /> Voir
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════
export default function Projects() {
  const [activeTab, setActiveTab] = useState<Category>("Tous");

  const filtered = activeTab === "Tous"
    ? projects
    : projects.filter((p) => p.category === activeTab);

  const featured = filtered.filter((p) => p.featured);
  const rest     = filtered.filter((p) => !p.featured);

  const countFor = (cat: Category) =>
    cat === "Tous" ? projects.length : projects.filter((p) => p.category === cat).length;

  return (
    <section id="projects" className="py-24" style={{ background: "#fff" }}>
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-12" style={{ background: "#7AB2B2" }} />
            <span className="font-semibold text-sm uppercase tracking-widest" style={{ color: "#7AB2B2" }}>
              Projets
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <h2 className="font-black text-4xl md:text-5xl"
              style={{ color: "#0f172a", fontFamily: "'Syne', sans-serif", lineHeight: 1.05 }}>
              Ce que j'ai<br />
              <span style={{ color: "#0072FF" }}>construit</span>
            </h2>
            <p className="text-sm max-w-xs" style={{ color: "#94a3b8" }}>
              Des projets concrets, du prototype à la mise en production.
            </p>
          </div>
        </motion.div>

        {/* ── TABS ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
          className="flex md:flex-wrap flex-row gap-2 mb-10 overflow-x-auto md:overflow-visible pb-2 md:pb-0 "
        >
          {CATEGORIES.map(({ key, icon }) => {
            const isActive = activeTab === key;
            const count = countFor(key);
            if (count === 0 && key !== "Tous") return null;
            return (
              <motion.button
                key={key}
                onClick={() => setActiveTab(key)}
                whileTap={{ scale: 0.96 }}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl text-left transition-all duration-200 shrink-0 md:shrink hover:cursor-pointer"
                style={{
                  background: isActive ? "#0072FF" : "#f8fafc",
                  color: isActive ? "#fff" : "#64748b",
                  border: isActive ? "1.5px solid #0072FF" : "1.5px solid #e2e8f0",
                  boxShadow: isActive ? "0 4px 14px rgba(0,114,255,0.28)" : "none",
                }}
              >
                {icon}
                {key}
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{
                    background: isActive ? "rgba(255,255,255,0.25)" : "rgba(0,114,255,0.08)",
                    color: isActive ? "#fff" : "#0072FF",
                  }}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* ── GRID ── */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20"
              style={{ color: "#94a3b8" }}
            >
              <div className="text-5xl mb-4">🗂️</div>
              <p className="font-semibold" style={{ fontFamily: "'Syne', sans-serif" }}>
                Aucun projet dans cette catégorie pour l'instant.
              </p>
            </motion.div>
          ) : (
            <motion.div key="grid" layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Featured prend 2 colonnes sur lg */}
              {featured.map((p) => (
                <div key={p.id} className="col-span-1 md:col-span-2 lg:col-span-2">
                  <FeaturedCard project={p} />
                </div>
              ))}
              {/* 1ère small card à côté du featured */}
              {featured.length > 0 && rest.slice(0, 1).map((p, i) => (
                <SmallCard key={p.id} project={p} index={i} />
              ))}
              {/* Reste des cards */}
              {(featured.length > 0 ? rest.slice(1) : rest).map((p, i) => (
                <SmallCard key={p.id} project={p} index={i + (featured.length > 0 ? 1 : 0)} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}