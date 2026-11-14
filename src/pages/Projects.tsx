import { useMemo, useState } from "react";
import {
  type LucideIcon,
  ExternalLink,
  Github,
  Globe,
  Leaf,
  LayoutGrid,
  Monitor,
  AppWindow,
  Smartphone,
  Brain,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Testimonials from "../components/Testimonials";

const EASE = [0.22, 1, 0.36, 1] as const;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: EASE },
});

// ── Catégories ────────────────────────────────────────────
type Category = "Tous" | "Portfolio" | "Site web" | "Application web" | "Application mobile" | "IA / ML";

const CATEGORIES: { key: Category; icon: React.ReactNode }[] = [
  { key: "Tous", icon: <LayoutGrid size={14} /> },
  { key: "Portfolio", icon: <Monitor size={14} /> },
  { key: "Site web", icon: <Globe size={14} /> },
  { key: "Application web", icon: <AppWindow size={14} /> },
  { key: "Application mobile", icon: <Smartphone size={14} /> },
  { key: "IA / ML", icon: <Brain size={14} /> },
];

// ── Projets ───────────────────────────────────────────────
// logo     : string = chemin image | icône Lucide
// logoBg   : fond de l'aperçu (défaut : "gradient" du projet)
// logoSize : taille de l'image en % dans le bloc (défaut : 70)
// logoFit  : "contain" | "cover"
const projects = [
  {
    id: 1,
    title: "PlantGuard AI",
    subtitle: "Application mobile IA",
    description:
      "Application mobile permettant la détection des maladies des plantes grâce à l'intelligence artificielle. Modèle de vision par ordinateur entraîné sur des milliers d'images de feuilles.",
    tags: ["React Native", "FastAPI", "Python", "TensorFlow", "PostgreSQL"],
    logo: Leaf as string | LucideIcon,
    logoBg: undefined as string | undefined,
    logoSize: 70,
    logoFit: "contain" as const,
    status: "En cours",
    gradient: "linear-gradient(135deg, #34d399, #14b8a6)",
    link: "",
    git: "https://github.com/AaronKAME200308/Aa.git",
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
    logo: "https://infiniteluxurytrips.net/logoilt.jpeg" as string | LucideIcon,
    logoBg: undefined as string | undefined,
    logoSize: 70,
    logoFit: "cover" as const,
    status: "En ligne",
    gradient: "linear-gradient(135deg, #231A55, #4535A0)",
    link: "https://infiniteluxurytrips.net",
    git: "https://github.com/AaronKAME200308/InfinitLuxuryTripsClient.git",
    featured: false,
    category: "Site web" as Category,
  },
  {
    id: 3,
    title: "Portfolio JP Graphic Design",
    subtitle: "Site vitrine freelance",
    description:
      "Site portfolio pour un graphiste freelance, mettant en avant ses réalisations avec une galerie d'images, une section de réservations clients et un formulaire de contact intégré.",
    tags: ["React JS", "Tailwind CSS", "Supabase"],
    logo: "https://jpgraphicdesign.net/logoblanc.png" as string | LucideIcon,
    logoBg: "linear-gradient(135deg,#f2cc6a,#f2cc6a)" as string | undefined,
    logoSize: 70,
    logoFit: "contain" as const,
    status: "En ligne",
    gradient: "linear-gradient(135deg,#f2cc6a,#f2cc6a)",
    link: "https://jpgraphicdesign.net",
    git: "https://github.com/AaronKAME200308/jp-graphic-design.git",
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
    logo: "/images.png" as string | LucideIcon,
    logoBg: undefined as string | undefined,
    logoSize: 70,
    logoFit: "cover" as const,
    status: "En ligne",
    gradient: "linear-gradient(135deg, #0a4d7c, #23c367)",
    link: "https://yapithepartners.com/",
    git: "https://github.com/AaronKAME200308/yapithe.git",
    featured: false,
    category: "Site web" as Category,
  },
  {
    id: 5,
    title: "MenuQR",
    subtitle: "Application web pour restaurants, fastfood & autres",
    description:
      "Application web permettant aux restaurants de créer un menu digital accessible via QR code. Les clients peuvent consulter le menu, et laisser des avis.",
    tags: ["React JS", "Tailwind CSS", "Node.js", "Supabase"],
    logo: "/logo.png" as string | LucideIcon,
    logoBg: "linear-gradient(135deg, #2E7D32, #1B5E20)" as string | undefined,
    logoSize: 70,
    logoFit: "cover" as const,
    status: "En cours",
    gradient: "linear-gradient(135deg, #2E7D32, #1B5E20)",
    link: "https://menu-qr-gules.vercel.app/",
    git: "https://github.com/AaronKAME200308/MenuQr.git",
    featured: false,
    category: "Application web" as Category,
  },
];

type Project = (typeof projects)[number];

// ── Utilitaires ───────────────────────────────────────────
const hostOf = (url: string) => {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
};

/* Bord de papier déchiré (vert forêt) vers la section Contact */
function TornEdge({ fill = "#0e2f20" }: { fill?: string }) {
  const d = useMemo(() => {
    const w = 1440, h = 40, steps = 80;
    let p = `M0 ${h} L0 14`;
    for (let i = 1; i <= steps; i++) {
      const r = Math.abs((Math.sin(i * 53.3) * 43758.5453) % 1);
      p += ` L${((w / steps) * i).toFixed(1)} ${(6 + r * 18).toFixed(1)}`;
    }
    return p + ` L${w} ${h} Z`;
  }, []);
  return (
    <svg
      viewBox="0 0 1440 40"
      preserveAspectRatio="none"
      className="absolute bottom-0 left-0 w-full h-7 lg:h-10 z-30"
      style={{ filter: "drop-shadow(0 -2px 3px rgba(0,0,0,0.12))" }}
      aria-hidden="true"
    >
      <path d={d} fill={fill} />
    </svg>
  );
}

// ── Statut : point + libellé ──────────────────────────────
const Status = ({ status }: { status: string }) => {
  const live = status === "En ligne";
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono-label !text-[10px] text-forest">
      <span className="relative flex w-2 h-2">
        {live && <span className="absolute inset-0 rounded-full bg-aun animate-ping opacity-60" />}
        <span className={`relative w-2 h-2 rounded-full ${live ? "bg-aun" : "bg-[#e0a21a]"}`} />
      </span>
      {status}
    </span>
  );
};

// ── Logo : image ou icône Lucide ──────────────────────────
const ProjectIcon = ({
  logo,
  gradient,
  logoBg,
  logoSize = 70,
  logoFit = "contain",
  large = false,
}: {
  logo: string | LucideIcon;
  gradient: string;
  logoBg?: string;
  logoSize?: number;
  logoFit?: "contain" | "cover";
  large?: boolean;
}) => {
  const sizeClass = large ? "w-24 h-24 rounded-3xl" : "w-16 h-16 rounded-2xl";
  const iconSize = large ? 40 : 28;

  if (typeof logo === "string") {
    return (
      <div
        className={`${sizeClass} overflow-hidden shadow-[0_10px_24px_rgba(0,0,0,0.25)] flex items-center justify-center`}
        style={{ background: logoBg ?? "#fff" }}
      >
        <img
          src={logo}
          alt=""
          style={{
            width: logoFit === "cover" ? "100%" : `${logoSize}%`,
            height: logoFit === "cover" ? "100%" : `${logoSize}%`,
            objectFit: logoFit,
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
    );
  }

  const Icon = logo;
  return (
    <div
      className={`${sizeClass} flex items-center justify-center shadow-[0_10px_24px_rgba(0,0,0,0.25)]`}
      style={{ background: logoBg ?? gradient }}
    >
      <Icon size={iconSize} className="text-white" />
    </div>
  );
};

// ── Fenêtre de navigateur : aperçu du projet ──────────────
const BrowserPreview = ({ project, large = false }: { project: Project; large?: boolean }) => (
  <div className="flex flex-col h-full">
    <div className="flex items-center gap-3 px-4 py-2.5 bg-sage/70 border-b border-sage">
      <span className="flex gap-1.5 shrink-0" aria-hidden="true">
        <i className="w-2.5 h-2.5 rounded-full bg-forest/20" />
        <i className="w-2.5 h-2.5 rounded-full bg-forest/20" />
        <i className="w-2.5 h-2.5 rounded-full bg-forest/20" />
      </span>
      <span className="flex-1 min-w-0 truncate rounded-md bg-white/80 px-3 py-1 font-mono text-[10.5px] text-ink-mute">
        {project.link ? hostOf(project.link) : "localhost · en développement"}
      </span>
    </div>
    <div
      className="relative flex-1 flex items-center justify-center"
      style={{ background: project.gradient, minHeight: large ? 260 : 150 }}
    >
      <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
      <div className="relative">
        <ProjectIcon
          logo={project.logo}
          gradient={project.gradient}
          logoBg={project.logoBg}
          logoSize={project.logoSize}
          logoFit={project.logoFit}
          large={large}
        />
      </div>
    </div>
  </div>
);

// ── Pastilles de technologies ─────────────────────────────
const Tags = ({ tags, max }: { tags: string[]; max?: number }) => {
  const shown = max ? tags.slice(0, max) : tags;
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((t) => (
        <span key={t} className="px-2 py-1 rounded-md border border-sage bg-cream font-mono text-[11px] text-ink-soft">
          {t}
        </span>
      ))}
      {max && tags.length > max && (
        <span className="px-2 py-1 rounded-md bg-sage/60 font-mono text-[11px] text-ink-mute">+{tags.length - max}</span>
      )}
    </div>
  );
};

// ── Boutons : touches de clavier ──────────────────────────
const Actions = ({ project }: { project: Project }) => (
  <div className="flex flex-wrap gap-3 pt-1">
    {project.link && (
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className="keycap px-4 py-2.5 text-sm font-semibold no-underline [--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#ffffff]"
      >
        <ExternalLink size={14} /> Voir le projet
      </a>
    )}
    <a
      href={project.git}
      target="_blank"
      rel="noopener noreferrer"
      className="keycap px-4 py-2.5 text-sm font-semibold no-underline [--key-face:#ffffff] [--key-edge:#a9bcae] [--key-text:#0e2f20]"
    >
      <Github size={14} /> Code
    </a>
  </div>
);

// ── Carte à la une (2 colonnes) ───────────────────────────
const FeaturedCard = ({ project }: { project: Project }) => (
  <motion.article
    layout
    initial={{ opacity: 0, y: 32 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.45, ease: EASE }}
    whileHover={{ y: -4 }}
    className="h-full grid md:grid-cols-2 rounded-[1.5rem] overflow-hidden bg-white border border-sage shadow-[0_10px_30px_-12px_rgba(14,47,32,0.25)]"
  >
    <BrowserPreview project={project} large />
    <div className="p-7 md:p-8 flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono-label !text-[10px] text-aun">À la une</span>
        <Status status={project.status} />
      </div>
      <div>
        <h3 className="font-display font-extrabold text-3xl leading-[1.05] mb-1.5" style={{ letterSpacing: "-0.02em" }}>
          {project.title}
        </h3>
        <p className="text-sm text-ink-mute m-0">{project.subtitle}</p>
      </div>
      <p className="text-sm leading-relaxed text-ink-soft m-0">{project.description}</p>
      <Tags tags={project.tags} />
      <div className="mt-auto">
        <Actions project={project} />
      </div>
    </div>
  </motion.article>
);

// ── Carte standard ────────────────────────────────────────
const SmallCard = ({ project, index }: { project: Project; index: number }) => (
  <motion.article
    layout
    initial={{ opacity: 0, y: 32 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
    whileHover={{ y: -4 }}
    className="h-full flex flex-col rounded-[1.5rem] overflow-hidden bg-white border border-sage shadow-[0_10px_30px_-12px_rgba(14,47,32,0.2)]"
  >
    <BrowserPreview project={project} />
    <div className="p-6 flex flex-col gap-3 flex-1">
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono-label !text-[10px] text-ink-mute">{project.category}</span>
        <Status status={project.status} />
      </div>
      <div>
        <h3 className="font-display font-bold text-xl leading-tight mb-1" style={{ letterSpacing: "-0.01em" }}>
          {project.title}
        </h3>
        <p className="text-xs text-ink-mute m-0">{project.subtitle}</p>
      </div>
      <p className="text-sm leading-relaxed text-ink-soft m-0 flex-1">{project.description}</p>
      <Tags tags={project.tags} max={3} />
      <Actions project={project} />
    </div>
  </motion.article>
);

// ═══════════════════════════════════════════════════════════
export default function Projects() {
  const [activeTab, setActiveTab] = useState<Category>("Tous");

  const filtered = activeTab === "Tous" ? projects : projects.filter((p) => p.category === activeTab);
  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

  const countFor = (cat: Category) =>
    cat === "Tous" ? projects.length : projects.filter((p) => p.category === cat).length;

  return (
    <section id="projects" className="relative overflow-hidden bg-cream pt-24 pb-32 lg:pt-32 lg:pb-40">
      <div className="relative max-w-6xl mx-auto px-6">
        {/* ── En-tête ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <motion.p {...fadeUp(0)} className="font-mono-label text-aun mb-5">
              <span className="text-moss">03 /</span> Projets
            </motion.p>
            <motion.h2
              {...fadeUp(0.1)}
              className="font-display font-extrabold leading-[1.05] max-w-2xl"
              style={{ fontSize: "clamp(2.2rem, 4.6vw, 3.6rem)", letterSpacing: "-0.03em" }}
            >
              Ce que j'ai <span className="text-aun">construit</span>, du prototype à la mise en ligne.
            </motion.h2>
          </div>
          <motion.p {...fadeUp(0.2)} className="text-sm text-ink-mute max-w-xs">
            Des projets concrets pour de vrais clients, avec le code ou le site à portée de clic.
          </motion.p>
        </div>

        {/* ── Filtres ── */}
        <motion.div
          {...fadeUp(0.25)}
          className="flex flex-row md:flex-wrap gap-2 mb-10 overflow-x-auto md:overflow-visible pb-2 md:pb-0"
          role="tablist"
          aria-label="Catégories de projets"
        >
          {CATEGORIES.map(({ key, icon }) => {
            const isActive = activeTab === key;
            const count = countFor(key);
            if (count === 0 && key !== "Tous") return null;
            return (
              <button
                key={key}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(key)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full border text-sm font-semibold cursor-pointer transition-colors ${
                  isActive
                    ? "bg-forest text-cream border-forest"
                    : "bg-white text-ink-soft border-sage hover:border-aun hover:text-aun"
                }`}
              >
                {icon}
                {key}
                <span
                  className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-white/15 text-cream" : "bg-sage text-forest"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* ── Grille ── */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 text-ink-mute"
            >
              <p className="font-display font-semibold m-0">Aucun projet dans cette catégorie pour l'instant.</p>
            </motion.div>
          ) : (
            <motion.div key="grid" layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((p) => (
                <div key={p.id} className="col-span-1 md:col-span-2 lg:col-span-2">
                  <FeaturedCard project={p} />
                </div>
              ))}
              {featured.length > 0 &&
                rest.slice(0, 1).map((p, i) => <SmallCard key={p.id} project={p} index={i} />)}
              {(featured.length > 0 ? rest.slice(1) : rest).map((p, i) => (
                <SmallCard key={p.id} project={p} index={i + (featured.length > 0 ? 1 : 0)} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Testimonials />

      <TornEdge />
    </section>
  );
}