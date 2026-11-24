import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  type LucideIcon,
  Play,
  X,
  ExternalLink,
  Github,
  Globe,
  Leaf,
  LayoutGrid,
  Layers,
  Monitor,
  AppWindow,
  Smartphone,
  Brain,
  MailOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Testimonials from "../components/Testimonials";
import { useLang, type Lang } from "../lib/i18n";

const EASE = [0.22, 1, 0.36, 1] as const;

// Nombre maximum de projets affichés par page dans la vue « Tous » (desktop)
const PAGE_SIZE = 5;

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-60px" },
  transition: { duration: 0.6, delay, ease: EASE },
});

// ── Détection mobile ──────────────────────────────────────
function useIsMobile(query = "(max-width: 767px)") {
  const [match, setMatch] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, [query]);
  return match;
}

// ── Catégories ────────────────────────────────────────────
type Category = "Tous" | "Portfolio" | "Site web" | "Application web" | "Application mobile" | "IA / ML" | "Invitations Numeriques";

const CATEGORIES: { key: Category; icon: React.ReactNode }[] = [
  { key: "Tous", icon: <LayoutGrid size={14} /> },
  { key: "Portfolio", icon: <Monitor size={14} /> },
  { key: "Site web", icon: <Globe size={14} /> },
  { key: "Application web", icon: <AppWindow size={14} /> },
  { key: "Application mobile", icon: <Smartphone size={14} /> },
  { key: "IA / ML", icon: <Brain size={14} /> },
  { key: "Invitations Numeriques", icon: <MailOpen size={14} /> },
];

// ── Types ─────────────────────────────────────────────────
// Données communes à une carte (projet ou sous-projet)
// logo     : string = chemin image | icône Lucide
// logoBg   : fond de l'aperçu (défaut : "gradient" du projet)
// logoSize : taille de l'image en % dans le bloc (défaut : 70)
// logoFit  : "contain" | "cover"
interface CardData {
  id: number | string;
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  logo: string | LucideIcon;
  logoBg?: string;
  logoSize: number;
  logoFit: "contain" | "cover";
  status: string;
  gradient: string;
  link: string;
  git: string;
  // Vidéo de navigation (optionnelle) : fichier dans /public/videos
  video?: string;
  poster?: string; // image d'attente facultative (sinon : 1re image de la vidéo)
  videoFit?: "cover" | "contain"; // "contain" pour les vidéos verticales (app mobile)
}

// Sous-projet : une « sous-page » d'un projet (ex. une invitation précise)
interface SubProject extends CardData {
  id: string;
}

interface Project extends CardData {
  id: number;
  featured: boolean;
  category: Category;
  subProjects?: SubProject[];
}

// ── Projets ───────────────────────────────────────────────
const projects: Project[] = [
  {
    id: 1,
    title: "PlantGuard AI",
    subtitle: "Application mobile IA",
    description:
      "Application mobile permettant la détection des maladies des plantes grâce à l'intelligence artificielle. Modèle de vision par ordinateur entraîné sur des milliers d'images de feuilles.",
    tags: ["React Native", "FastAPI", "Python", "TensorFlow", "PostgreSQL"],
    logo: Leaf,
    logoSize: 70,
    logoFit: "contain",
    status: "En cours",
    gradient: "linear-gradient(135deg, #34d399, #14b8a6)",
    link: "",
    git: "https://github.com/AaronKAME200308/Aa.git",
    video: "/videos/plantguard.mp4",
    videoFit: "contain",
    featured: true,
    category: "Application mobile",
  },
  {
    id: 2,
    title: "Infinite Luxury Trips",
    subtitle: "Site de voyage",
    description:
      "Plateforme de voyage moderne avec exploration de destinations, galeries d'images immersives et interface de réservation. Design soigné, navigation fluide.",
    tags: ["React JS", "Tailwind CSS", "Node.js", "Supabase"],
    logo: "https://infiniteluxurytrips.net/logoilt.jpeg",
    logoSize: 70,
    logoFit: "cover",
    status: "En ligne",
    gradient: "linear-gradient(135deg, #231A55, #4535A0)",
    link: "https://infiniteluxurytrips.net",
    git: "https://github.com/AaronKAME200308/InfinitLuxuryTripsClient.git",
    video: "/videos/infinite-luxury-trips.mp4",
    featured: false,
    category: "Site web",
  },
  {
    id: 3,
    title: "Portfolio JP Graphic Design",
    subtitle: "Site vitrine freelance",
    description:
      "Site portfolio pour un graphiste freelance, mettant en avant ses réalisations avec une galerie d'images, une section de réservations clients et un formulaire de contact intégré.",
    tags: ["React JS", "Tailwind CSS", "Supabase"],
    logo: "https://jpgraphicdesign.net/logoblanc.png",
    logoBg: "linear-gradient(135deg,#f2cc6a,#f2cc6a)",
    logoSize: 70,
    logoFit: "contain",
    status: "En ligne",
    gradient: "linear-gradient(135deg,#f2cc6a,#f2cc6a)",
    link: "https://jpgraphicdesign.net",
    git: "https://github.com/AaronKAME200308/jp-graphic-design.git",
    video: "/videos/jp-graphic-design.mp4",
    featured: false,
    category: "Portfolio",
  },
  {
    id: 4,
    title: "Vitrine Pro Yapithe & Partners",
    subtitle: "Site vitrine entreprise",
    description:
      "Site vitrine pour une entreprise locale, avec présentation des services, témoignages clients et formulaire de contact intégré. Vidéo Youtube, Blog et bien plus",
    tags: ["React JS", "Tailwind CSS", "Node js"],
    logo: "https://yapithepartners.com/logoorigin.png",
    logoSize: 70,
    logoFit: "cover",
    status: "En ligne",
    gradient: "linear-gradient(135deg, #0a4d7c, #23c367)",
    link: "https://yapithepartners.com/",
    git: "https://github.com/AaronKAME200308/yapithe.git",
    video: "/videos/yapithe.mp4",
    featured: false,
    category: "Site web",
  },
  {
    id: 5,
    title: "MenuQR",
    subtitle: "Application web pour restaurants, fastfood & autres",
    description:
      "Application web permettant aux restaurants de créer un menu digital accessible via QR code. Les clients peuvent consulter le menu, et laisser des avis.",
    tags: ["React JS", "Tailwind CSS", "Node.js", "Supabase"],
    logo: "/Logo/menuqr-symbole.svg",
    logoBg: "linear-gradient(135deg, #ffffff, #c8c8c8)",
    logoSize: 70,
    logoFit: "cover",
    status: "En cours",
    gradient: "linear-gradient(135deg, #d97f00, #5e4b1b)",
    link: "https://menu-qr-gules.vercel.app/",
    git: "https://github.com/AaronKAME200308/MenuQr.git",
    video: "/videos/menuqr.mp4",
    featured: false,
    category: "Application web",
  },
  {
    id: 6,
    title: "Invitations Numériques",
    subtitle: "Plateforme d'invitations digitales",
    description:
      "Plateforme d'invitations numériques pour divers événements, avec options de personnalisation et de partage facile. Retrouvez ci-dessous les invitations réalisées.",
    tags: ["Figma","React JS", "Tailwind CSS", "Node.js", "Supabase"],
    logo: "/Logo/aawedding-color.svg",
    logoBg: "linear-gradient(135deg, #f3eee1, #f3e9e1)",
    logoSize: 70,
    logoFit: "cover",
    status: "En ligne",
    gradient: "linear-gradient(135deg, #f1bf34, #f4e2b0)",
    // TODO : vérifier l'adresse du site principal de la plateforme
    link: "https://aa-wedding-woad.vercel.app/",
    git: "",
    video: "/videos/invitations.mp4",
    featured: false,
    category: "Invitations Numeriques",
    // ── Sous-pages : une entrée par invitation ──
    subProjects: [
      {
        id: "6-1",
        title: "Invitation Loïc & Ingride",
        subtitle: "Invitation de mariage",
        description: "Invitation de mariage numérique personnalisée, avec aperçu interactif et partage facile.",
        tags: ["Figma", "React JS", "Tailwind CSS", "Node.js", "Supabase"],
        logo: "/Logo/I&L wedding Logo (3).png",
        logoBg: "linear-gradient(135deg, #f3e9e1, #f3e9e1)",
        logoSize: 70,
        logoFit: "cover",
        status: "En ligne",
        gradient: "linear-gradient(135deg, #030304, #a5a5a5)",
        link: "https://aa-wedding-woad.vercel.app/loic-ingride?apercu=1",
        git: "",
        video: "/videos/invitation-loic-ingride.mp4",
      },
      // Ajoutez ici les autres invitations (copier le bloc ci-dessus, id "6-2", "6-3"…)
    ],
  },
];

// ── Traductions ───────────────────────────────────────────
const CAT_EN: Record<Category, string> = {
  Tous: "All",
  Portfolio: "Portfolio",
  "Site web": "Website",
  "Application web": "Web app",
  "Application mobile": "Mobile app",
  "IA / ML": "AI / ML",
  "Invitations Numeriques": "Digital Invitations",
};
const catLabel = (c: Category, lang: Lang) => (lang === "en" ? CAT_EN[c] : c);

const STATUS_EN: Record<string, string> = { "En ligne": "Live", "En cours": "In progress" };

// Clés = id du projet ou du sous-projet (converti en chaîne)
const PROJECT_EN: Record<string, { title?: string; subtitle: string; description: string }> = {
  "1": {
    subtitle: "AI mobile application",
    description:
      "Mobile application that detects plant diseases using artificial intelligence. A computer vision model trained on thousands of leaf images.",
  },
  "2": {
    subtitle: "Travel website",
    description:
      "Modern travel platform with destination exploration, immersive image galleries and a booking interface. Polished design, smooth navigation.",
  },
  "3": {
    subtitle: "Freelance showcase website",
    description:
      "Portfolio site for a freelance graphic designer, showcasing his work with an image gallery, a client booking section and an integrated contact form.",
  },
  "4": {
    subtitle: "Business showcase website",
    description:
      "Showcase website for a local company, with service presentation, client testimonials and an integrated contact form. YouTube video, blog and much more.",
  },
  "5": {
    subtitle: "Web app for restaurants, fast food & more",
    description:
      "Web application that lets restaurants create a digital menu accessible via QR code. Customers can browse the menu and leave reviews.",
  },
  "6": {
    subtitle: "Digital invitations platform",
    description:
      "Digital invitation platform for all kinds of events, with customization options and easy sharing. Browse the invitations created below.",
  },
  "6-1": {
    title: "Loïc & Ingride Invitation",
    subtitle: "Wedding invitation",
    description: "Customized digital wedding invitation, with an interactive preview and easy sharing.",
  },
};

const localized = <T extends { id: number | string }>(p: T, lang: Lang): T =>
  lang === "en" ? { ...p, ...PROJECT_EN[String(p.id)] } : p;

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
  const { lang } = useLang();
  const live = status === "En ligne";
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap font-mono-label !text-[10px] text-forest">
      <span className="relative flex w-2 h-2">
        {live && <span className="absolute inset-0 rounded-full bg-aun animate-ping opacity-60" />}
        <span className={`relative w-2 h-2 rounded-full ${live ? "bg-aun" : "bg-[#e0a21a]"}`} />
      </span>
      {lang === "en" ? STATUS_EN[status] ?? status : status}
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
  small = false,
}: {
  logo: string | LucideIcon;
  gradient: string;
  logoBg?: string;
  logoSize?: number;
  logoFit?: "contain" | "cover";
  large?: boolean;
  small?: boolean;
}) => {
  const sizeClass = small ? "w-10 h-10 rounded-sm" : large ? "w-24 h-24 rounded-sm" : "w-16 h-16 rounded-sm";
  const iconSize = small ? 18 : large ? 40 : 28;

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

// ── Modale vidéo (plein écran, avec son) ──────────────────
const VideoModal = ({ project, onClose }: { project: CardData; onClose: () => void }) => {
  const { lang } = useLang();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 md:p-10"
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 inline-flex items-center justify-center w-11 h-11 rounded-full bg-white/15 text-white cursor-pointer hover:bg-white/25 transition-colors"
        aria-label={lang === "en" ? "Close video" : "Fermer la vidéo"}
      >
        <X size={20} />
      </button>
      <video
        src={project.video}
        poster={project.poster}
        controls
        autoPlay
        playsInline
        onClick={(e) => e.stopPropagation()}
        className="max-w-full max-h-full rounded-sm bg-black shadow-2xl"
      />
    </div>,
    document.body
  );
};

// ── Zone vidéo : lecture au survol, clic = plein écran ────
const VideoZone = ({
  project,
  large,
  onFail,
}: {
  project: CardData;
  large: boolean;
  onFail: () => void;
}) => {
  const { lang } = useLang();
  const ref = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);

  const play = () => {
    ref.current?.play().catch(() => {});
  };
  const stop = () => {
    const v = ref.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  };

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        aria-label={`${lang === "en" ? "Play video" : "Lire la vidéo"} : ${project.title}`}
        className="group relative flex-1 overflow-hidden cursor-pointer"
        style={{ background: project.gradient, minHeight: large ? 260 : 150 }}
        onMouseEnter={play}
        onMouseLeave={stop}
        onFocus={play}
        onBlur={stop}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        <video
          ref={ref}
          src={`${project.video}#t=0.1`}
          poster={project.poster}
          muted
          loop
          playsInline
          preload="metadata"
          onError={onFail}
          className={`absolute inset-0 w-full h-full ${project.videoFit === "contain" ? "object-contain" : "object-cover"}`}
        />
        <div className="absolute inset-0 bg-black/10 pointer-events-none" aria-hidden="true" />

        {/* Bouton lecture : s'efface au survol */}
        <span
          className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0"
          aria-hidden="true"
        >
          <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white/90 text-forest shadow-lg">
            <Play size={20} className="ml-0.5" fill="currentColor" />
          </span>
        </span>

        {/* Logo en petit badge */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <ProjectIcon
            small
            logo={project.logo}
            gradient={project.gradient}
            logoBg={project.logoBg}
            logoSize={project.logoSize}
            logoFit={project.logoFit}
          />
        </div>
      </div>
      {open && <VideoModal project={project} onClose={() => setOpen(false)} />}
    </>
  );
};

// ── Fenêtre de navigateur : aperçu du projet ──────────────
const BrowserPreview = ({ project, large = false }: { project: CardData; large?: boolean }) => {
  const { lang } = useLang();
  // Si la vidéo est absente ou ne charge pas, on retombe sur le logo
  const [videoFailed, setVideoFailed] = useState(false);
  const hasVideo = !!project.video && !videoFailed;
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-sage/70 border-b border-sage">
        <span className="flex gap-1.5 shrink-0" aria-hidden="true">
          <i className="w-2.5 h-2.5 rounded-full bg-forest/20" />
          <i className="w-2.5 h-2.5 rounded-full bg-forest/20" />
          <i className="w-2.5 h-2.5 rounded-full bg-forest/20" />
        </span>
        <span className="flex-1 min-w-0 truncate rounded bg-white/80 px-3 py-1 font-mono text-[10.5px] text-ink-mute">
          {project.link ? hostOf(project.link) : lang === "en" ? "localhost · in development" : "localhost · en développement"}
        </span>
      </div>
      {hasVideo ? (
        <VideoZone project={project} large={large} onFail={() => setVideoFailed(true)} />
      ) : (
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
      )}
    </div>
  );
};

// ── Pastilles de technologies ─────────────────────────────
const Tags = ({ tags, max }: { tags: string[]; max?: number }) => {
  const shown = max ? tags.slice(0, max) : tags;
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((t) => (
        <span key={t} className="px-2 py-1 rounded-sm border border-sage bg-cream font-mono text-[11px] text-ink-soft">
          {t}
        </span>
      ))}
      {max && tags.length > max && (
        <span className="px-2 py-1 rounded-sm bg-sage/60 font-mono text-[11px] text-ink-mute">+{tags.length - max}</span>
      )}
    </div>
  );
};

// ── Boutons : touches de clavier ──────────────────────────
const Actions = ({ project }: { project: CardData }) => {
  const { lang } = useLang();
  return (
    <div className="flex flex-wrap gap-3 pt-1">
      {project.link && (
        <a
          href={project.link}
          target="_blank"
          rel="noopener noreferrer"
          className="keycap px-4 py-2.5 text-sm font-semibold no-underline [--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#ffffff]"
        >
          <ExternalLink size={14} /> {lang === "en" ? "View project" : "Voir le projet"}
        </a>
      )}
      {project.git && (
        <a
          href={project.git}
          target="_blank"
          rel="noopener noreferrer"
          className="keycap px-4 py-2.5 text-sm font-semibold no-underline [--key-face:#ffffff] [--key-edge:#a9bcae] [--key-text:#0e2f20]"
        >
          <Github size={14} /> Code
        </a>
      )}
    </div>
  );
};

// ── Carte à la une (2 colonnes) ───────────────────────────
const FeaturedCard = ({ project: base, badge }: { project: CardData; badge?: string }) => {
  const { lang } = useLang();
  const project = localized(base, lang);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, ease: EASE }}
      whileHover={{ y: -4 }}
      className="h-full grid md:grid-cols-2 rounded-sm overflow-hidden bg-white border border-sage shadow-[0_10px_30px_-12px_rgba(14,47,32,0.25)]"
    >
      <BrowserPreview project={project} large />
      <div className="p-7 md:p-8 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono-label !text-[10px] text-aun">
            {badge ?? (lang === "en" ? "Featured" : "À la une")}
          </span>
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
};

// ── Carte standard (projet ou sous-projet) ────────────────
const SmallCard = ({
  project: base,
  index,
  label,
  subCount = 0,
  onExplore,
}: {
  project: CardData;
  index: number;
  label: string;
  subCount?: number;
  onExplore?: () => void;
}) => {
  const { lang } = useLang();
  const project = localized(base, lang);
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: EASE }}
      whileHover={{ y: -4 }}
      className="h-full flex flex-col rounded-sm overflow-hidden bg-white border border-sage shadow-[0_10px_30px_-12px_rgba(14,47,32,0.2)]"
    >
      <BrowserPreview project={project} />
      <div className="p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono-label !text-[10px] text-ink-mute">{label}</span>
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
        {subCount > 0 && onExplore && (
          <button
            type="button"
            onClick={onExplore}
            className="inline-flex items-center gap-2 self-start px-3 py-2 rounded border border-sage bg-cream text-xs font-semibold text-forest cursor-pointer hover:border-aun hover:text-aun transition-colors"
          >
            <Layers size={14} />
            {lang === "en"
              ? `${subCount} sub-project${subCount > 1 ? "s" : ""} · see all`
              : `${subCount} sous-projet${subCount > 1 ? "s" : ""} · tout voir`}
          </button>
        )}
        <Actions project={project} />
      </div>
    </motion.article>
  );
};

// ── Projet + ses sous-sections (vue catégorie) ────────────
const ProjectWithSubs = ({ project }: { project: Project }) => {
  const { lang } = useLang();
  const subs = project.subProjects ?? [];
  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col gap-6">
      <FeaturedCard project={project} badge={lang === "en" ? "Main site" : "Site principal"} />
      <div className="flex items-center gap-3">
        <Layers size={16} className="text-aun" />
        <span className="font-mono-label !text-[10px] text-ink-mute">
          {lang === "en" ? "Inside this project" : "Dans ce projet"} · {subs.length}
        </span>
        <span className="flex-1 h-px bg-sage" aria-hidden="true" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subs.map((s, i) => (
          <SmallCard key={s.id} project={s} index={i} label={lang === "en" ? "Sub-project" : "Sous-projet"} />
        ))}
      </div>
    </div>
  );
};

// ── Pagination ────────────────────────────────────────────
// Desktop : numéros de pages. Mobile : compteur compact « 1 / 6 ».
const Pagination = ({
  page,
  total,
  onChange,
}: {
  page: number;
  total: number;
  onChange: (p: number) => void;
}) => {
  const { lang } = useLang();
  const btn =
    "inline-flex items-center justify-center w-10 h-10 rounded border text-sm font-semibold cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  return (
    <nav className="flex items-center justify-center gap-2 mt-10" aria-label={lang === "en" ? "Pagination" : "Pagination des projets"}>
      <button
        type="button"
        className={`${btn} bg-white text-ink-soft border-sage hover:border-aun hover:text-aun`}
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label={lang === "en" ? "Previous page" : "Page précédente"}
      >
        <ChevronLeft size={16} />
      </button>

      {/* Numéros : desktop uniquement */}
      <div className="hidden md:flex items-center gap-2">
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-current={n === page ? "page" : undefined}
            className={`${btn} ${
              n === page
                ? "bg-forest text-cream border-forest"
                : "bg-white text-ink-soft border-sage hover:border-aun hover:text-aun"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      {/* Compteur : mobile uniquement */}
      <span className="md:hidden min-w-16 text-center font-mono text-sm text-ink-soft">
        {page} / {total}
      </span>

      <button
        type="button"
        className={`${btn} bg-white text-ink-soft border-sage hover:border-aun hover:text-aun`}
        onClick={() => onChange(page + 1)}
        disabled={page === total}
        aria-label={lang === "en" ? "Next page" : "Page suivante"}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

// ═══════════════════════════════════════════════════════════
export default function Projects() {
  const { lang } = useLang();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState<Category>("Tous");
  const [page, setPage] = useState(1);

  const selectTab = (cat: Category) => {
    setActiveTab(cat);
    setPage(1);
  };

  const isAll = activeTab === "Tous";
  const filtered = isAll ? projects : projects.filter((p) => p.category === activeTab);

  // Mobile : 1 projet à la fois.
  // Desktop : 5 par page dans la vue « Tous », tout sur une page dans une catégorie.
  const pageSize = isMobile ? 1 : isAll ? PAGE_SIZE : Math.max(filtered.length, 1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const visible = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Dans une catégorie, un projet avec sous-pages est affiché avec ses sous-sections
  const withSubs = isAll ? [] : visible.filter((p) => (p.subProjects?.length ?? 0) > 0);
  const plain = isAll ? visible : visible.filter((p) => !((p.subProjects?.length ?? 0) > 0));
  const featured = plain.filter((p) => p.featured);
  const rest = plain.filter((p) => !p.featured);

  const countFor = (cat: Category) =>
    cat === "Tous" ? projects.length : projects.filter((p) => p.category === cat).length;

  // Changement de page : sur mobile, on remonte en haut de la section
  const changePage = (p: number) => {
    setPage(p);
    if (isMobile) document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
  };

  const renderSmall = (p: Project, i: number) => (
    <SmallCard
      key={p.id}
      project={p}
      index={i}
      label={catLabel(p.category, lang)}
      subCount={isAll ? p.subProjects?.length ?? 0 : 0}
      onExplore={() => selectTab(p.category)}
    />
  );

  return (
    <section id="projects" className="relative overflow-hidden bg-cream pt-24 pb-32 lg:pt-32 lg:pb-40">
      <div className="relative max-w-6xl mx-auto px-6">
        {/* ── En-tête ── */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <motion.p {...fadeUp(0)} className="font-mono-label text-aun mb-5">
              <span className="text-moss">03 /</span> {lang === "en" ? "Projects" : "Projets"}
            </motion.p>
            <motion.h2
              {...fadeUp(0.1)}
              className="font-display font-extrabold leading-[1.05] max-w-2xl"
              style={{ fontSize: "clamp(2.2rem, 4.6vw, 3.6rem)", letterSpacing: "-0.03em" }}
            >
              {lang === "en" ? (
                <>What I've <span className="text-aun">built</span>, from prototype to launch.</>
              ) : (
                <>Ce que j'ai <span className="text-aun">construit</span>, du prototype à la mise en ligne.</>
              )}
            </motion.h2>
          </div>
          <motion.p {...fadeUp(0.2)} className="text-sm text-ink-mute max-w-xs">
            {lang === "en"
              ? "Real projects for real clients, with the code or the live site one click away."
              : "Des projets concrets pour de vrais clients, avec le code ou le site à portée de clic."}
          </motion.p>
        </div>

        {/* ── Filtres ── */}
        <motion.div
          {...fadeUp(0.25)}
          className="flex flex-row md:flex-wrap gap-2 mb-10 overflow-x-auto md:overflow-visible pb-2 md:pb-0"
          role="tablist"
          aria-label={lang === "en" ? "Project categories" : "Catégories de projets"}
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
                onClick={() => selectTab(key)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded border text-sm font-semibold cursor-pointer transition-colors ${
                  isActive
                    ? "bg-forest text-cream border-forest"
                    : "bg-white text-ink-soft border-sage hover:border-aun hover:text-aun"
                }`}
              >
                {icon}
                {catLabel(key, lang)}
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
              <p className="font-display font-semibold m-0">
                {lang === "en" ? "No projects in this category yet." : "Aucun projet dans cette catégorie pour l'instant."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key={`grid-${activeTab}-${currentPage}`}
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {/* Projets avec sous-sections (vue catégorie) */}
              {withSubs.map((p) => (
                <ProjectWithSubs key={p.id} project={p} />
              ))}

              {/* Projets classiques */}
              {featured.map((p) => (
                <div key={p.id} className="col-span-1 md:col-span-2 lg:col-span-2">
                  <FeaturedCard project={p} />
                </div>
              ))}
              {featured.length > 0 && rest.slice(0, 1).map((p, i) => renderSmall(p, i))}
              {(featured.length > 0 ? rest.slice(1) : rest).map((p, i) =>
                renderSmall(p, i + (featured.length > 0 ? 1 : 0))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Pagination (dès qu'il y a plusieurs pages) ── */}
        {totalPages > 1 && <Pagination page={currentPage} total={totalPages} onChange={changePage} />}
      </div>

      <Testimonials />

      <TornEdge />
    </section>
  );
}