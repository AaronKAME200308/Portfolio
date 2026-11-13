import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Ton SVG du dossier public/ : change le nom si ton fichier s'appelle autrement
const LOGO_SRC = "/Aun/aun-symbole-vert.svg";

const EASE = [0.22, 1, 0.36, 1] as const;

const links = [
  { id: "about", label: "À propos" },
  { id: "skills", label: "Compétences" },
  { id: "projects", label: "Projets" },
];

export default function Navbar({ activeSection }: { activeSection: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  // En haut de page, la barre est transparente par-dessus le Hero vert forêt :
  // on passe en version claire (logo et textes clairs). Au défilement, fond crème.
  const dark = !scrolled;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(246,244,236,0.86)" : "transparent",
        backdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px) saturate(160%)" : "none",
        borderBottom: scrolled ? "1px solid #dceadd" : "1px solid transparent",
      }}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* ── Logo ── */}
        <button
          onClick={() => scrollTo("hero")}
          className="shrink-0 cursor-pointer bg-transparent border-0 p-0"
          aria-label="Aun, retour à l'accueil"
        >
          <span className="inline-flex items-center gap-2.5">
            <img
              src={LOGO_SRC}
              alt=""
              className={`h-8 w-8 object-contain block transition-[filter] duration-300 ${dark ? "brightness-0 invert" : ""}`}
            />
            <span
              className={`font-display font-semibold leading-none transition-colors duration-300 ${
                dark ? "text-cream" : "text-aun"
              }`}
              style={{ fontSize: 30, letterSpacing: "-0.01em" }}
            >
              Aun
            </span>
          </span>
        </button>

        {/* ── Navigation desktop, pastille centrée ── */}
        <div
          className="hidden md:block absolute left-1/2 -translate-x-1/2 rounded-full p-1.5 transition-colors duration-300"
          style={{
            background: dark ? "rgba(255,255,255,0.08)" : "#ffffff",
            border: `1px solid ${dark ? "rgba(255,255,255,0.18)" : "#dceadd"}`,
          }}
        >
          <ul className="flex items-center gap-1 list-none m-0 p-0">
            {links.map((l) => {
              const isActive = activeSection === l.id;
              return (
                <li key={l.id} className="relative">
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      className={`absolute inset-0 rounded-full ${dark ? "bg-white/15" : "bg-sage"}`}
                      transition={{ duration: 0.3, ease: EASE }}
                    />
                  )}
                  <button
                    onClick={() => scrollTo(l.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative px-4 py-1.5 rounded-full text-sm bg-transparent border-0 cursor-pointer transition-colors duration-200 ${
                      isActive
                        ? dark
                          ? "text-white font-semibold"
                          : "text-forest font-semibold"
                        : dark
                        ? "text-sage/80 font-medium hover:text-white"
                        : "text-ink-mute font-medium hover:text-aun"
                    }`}
                  >
                    {l.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── CTA + burger ── */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => scrollTo("contact")}
            className={`keycap hidden md:inline-flex px-5 py-2.5 text-sm font-semibold ${
              dark
                ? "[--key-face:#6baf7b] [--key-edge:#3a7549] [--key-text:#0e2f20]"
                : "[--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#ffffff]"
            }`}
          >
            Me contacter
          </button>

          <button
            onClick={() => setOpen(!open)}
            className={`md:hidden w-11 h-11 rounded-xl flex items-center justify-center border cursor-pointer transition-colors ${
              dark ? "bg-white/10 border-white/25 text-white" : "bg-white border-sage text-forest"
            }`}
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={open ? "x" : "menu"}
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 45, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                {open ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
              </motion.div>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {/* ── Menu mobile ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="md:hidden overflow-hidden bg-cream border-t border-b border-sage shadow-lg shadow-forest/10"
          >
            <ul className="flex flex-col gap-1 px-5 py-3 list-none m-0">
              {[...links, { id: "contact", label: "Contact" }].map((l, i) => {
                const isActive = activeSection === l.id;
                return (
                  <motion.li
                    key={l.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, ease: EASE }}
                  >
                    <button
                      onClick={() => scrollTo(l.id)}
                      className={`w-full text-left px-4 py-3.5 rounded-2xl text-base font-medium cursor-pointer border-0 transition-colors ${
                        isActive ? "bg-sage text-forest" : "bg-transparent text-ink-soft hover:bg-white"
                      }`}
                    >
                      {l.label}
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}