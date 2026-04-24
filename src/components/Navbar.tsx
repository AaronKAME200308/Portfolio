import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "rgba(255,255,255,0.72)" : "transparent",
        backdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(24px) saturate(180%)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.65)" : "1px solid transparent",
        boxShadow: scrolled ? "0 1px 40px rgba(124,58,237,0.07)" : "none",
      }}
    >
      <nav
        className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between"
        style={{ position: "relative" }}
      >

        {/* ── Logo ── */}
        <button
          onClick={() => scrollTo("hero")}
          className="flex items-center gap-2.5 shrink-0"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <div
  className="w-9 h-9 rounded-xl flex items-center justify-center overflow-hidden"
  style={{
    background: "linear-gradient(135deg, #ede9fe, #dbeafe)",
    boxShadow: "0 3px 12px rgba(124,58,237,0.15)",
  }}
>
            <img
              src="/logo_name.png"
              alt="Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                display: "block",
              }}
            />
          </div>
          <span
            className="font-black text-lg"
            style={{ fontFamily: "'Syne', sans-serif", color: "#0f172a", letterSpacing: "-0.02em" }}
          >
            Aaron Devs<span style={{ color: "#7c3aed" }}>.</span>
          </span>
        </button>

        {/* ── Desktop nav — centered glass pill ── */}
        <div
          className="hidden md:block absolute left-1/2 -translate-x-1/2"
          style={{
            background: scrolled ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.45)",
            backdropFilter: "blur(16px) saturate(160%)",
            WebkitBackdropFilter: "blur(16px) saturate(160%)",
            border: "1px solid rgba(255,255,255,0.85)",
            borderRadius: 18,
            padding: "5px 6px",
            boxShadow: "0 2px 16px rgba(124,58,237,0.08)",
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
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(59,130,246,0.08))",
                      }}
                      transition={{ duration: 0.3, ease: EASE }}
                    />
                  )}
                  <button
                    onClick={() => scrollTo(l.id)}
                    className="relative px-4 py-1.5 rounded-xl text-sm font-medium transition-colors duration-200"
                    style={{
                      color: isActive ? "#7c3aed" : "#64748b",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontWeight: isActive ? 600 : 500,
                    }}
                    onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#7c3aed"; }}
                    onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.color = "#64748b"; }}
                  >
                    {l.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Right — CTA + burger ── */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Contact CTA desktop */}
          <motion.button
            onClick={() => scrollTo("contact")}
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            className="hidden md:block px-5 py-2 rounded-xl text-sm font-bold text-white"
            style={{
              background: "linear-gradient(135deg, #7c3aed, #3b82f6)",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 16px rgba(124,58,237,0.32)",
            }}
          >
            Contact
          </motion.button>

          {/* Burger mobile */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.85)",
              boxShadow: "0 2px 10px rgba(124,58,237,0.1)",
              cursor: "pointer",
              color: "#64748b",
            }}
            aria-label="Menu"
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

      {/* ── Mobile dropdown ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            style={{
              overflow: "hidden",
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(24px) saturate(200%)",
              WebkitBackdropFilter: "blur(24px) saturate(200%)",
              borderTop: "1px solid rgba(255,255,255,0.65)",
            }}
          >
            <ul className="flex flex-col gap-1 px-5 py-3 list-none m-0">
              {[...links, { id: "contact", label: "Contact" }].map((l, i) => (
                <motion.li
                  key={l.id}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, ease: EASE }}
                >
                  <button
                    onClick={() => scrollTo(l.id)}
                    className="w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200"
                    style={{
                      background: activeSection === l.id ? "rgba(124,58,237,0.08)" : "transparent",
                      color: activeSection === l.id ? "#7c3aed" : "#475569",
                      border: activeSection === l.id ? "1px solid rgba(124,58,237,0.15)" : "1px solid transparent",
                      cursor: "pointer",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.8)"; (e.currentTarget as HTMLElement).style.color = "#7c3aed"; }}
                    onMouseLeave={e => {
                      const isAct = activeSection === l.id;
                      (e.currentTarget as HTMLElement).style.background = isAct ? "rgba(124,58,237,0.08)" : "transparent";
                      (e.currentTarget as HTMLElement).style.color = isAct ? "#7c3aed" : "#475569";
                    }}
                  >
                    {l.label}
                  </button>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}