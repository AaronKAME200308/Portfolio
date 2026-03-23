import { useState, useEffect } from "react";
import { Menu, X, Code2 } from "lucide-react";

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
    <>
      <style>{`
        .glass-nav {
          background: rgba(255, 255, 255, 0.55);
          backdrop-filter: blur(24px) saturate(180%);
          -webkit-backdrop-filter: blur(24px) saturate(180%);
          border-bottom: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 1px 40px rgba(124, 58, 237, 0.06), 0 1px 0 rgba(255,255,255,0.8) inset;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glass-nav-transparent {
          background: transparent;
          backdrop-filter: none;
          border-bottom: 1px solid transparent;
          box-shadow: none;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .glass-pill {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(12px) saturate(160%);
          -webkit-backdrop-filter: blur(12px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.85);
          box-shadow:
            0 2px 16px rgba(124, 58, 237, 0.08),
            0 1px 0 rgba(255,255,255,0.9) inset,
            0 -1px 0 rgba(124,58,237,0.05) inset;
        }
        .nav-link-active {
          background: linear-gradient(135deg, rgba(124,58,237,0.12), rgba(59,130,246,0.08));
          color: #7c3aed;
          border-radius: 10px;
        }
        .nav-link-inactive {
          color: #64748b;
          border-radius: 10px;
        }
        .nav-link-inactive:hover {
          background: rgba(255,255,255,0.7);
          color: #7c3aed;
        }
        .cta-glass {
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          box-shadow:
            0 4px 16px rgba(124,58,237,0.32),
            0 1px 0 rgba(255,255,255,0.25) inset;
          transition: all 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .cta-glass::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 50%;
          background: rgba(255,255,255,0.15);
          border-radius: inherit;
          pointer-events: none;
        }
        .cta-glass:hover {
          box-shadow: 0 6px 24px rgba(124,58,237,0.45), 0 1px 0 rgba(255,255,255,0.3) inset;
          transform: translateY(-1.5px) scale(1.02);
        }
        .burger-glass {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);
          border: 1px solid rgba(255, 255, 255, 0.85);
          box-shadow:
            0 2px 12px rgba(124,58,237,0.1),
            0 1px 0 rgba(255,255,255,0.9) inset;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          border-radius: 12px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .burger-glass::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 45%;
          background: rgba(255,255,255,0.55);
          pointer-events: none;
        }
        .burger-glass:hover {
          background: rgba(255,255,255,0.85);
          box-shadow: 0 4px 20px rgba(124,58,237,0.2), 0 1px 0 rgba(255,255,255,1) inset;
          transform: scale(1.08);
        }
        .burger-glass:active {
          transform: scale(0.95);
        }
        .mobile-menu-glass {
          background: rgba(255, 255, 255, 0.78);
          backdrop-filter: blur(32px) saturate(200%);
          -webkit-backdrop-filter: blur(32px) saturate(200%);
          border-top: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 12px 40px rgba(124,58,237,0.1);
        }
        .mobile-link {
          padding: 12px 16px;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 500;
          color: #475569;
          display: block;
          width: 100%;
          text-align: left;
          background: transparent;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mobile-link:hover {
          background: rgba(255,255,255,0.8);
          color: #7c3aed;
          border-color: rgba(124,58,237,0.15);
          box-shadow: 0 2px 8px rgba(124,58,237,0.08);
        }
        .logo-icon {
          background: linear-gradient(135deg, #7c3aed, #3b82f6);
          box-shadow: 0 2px 12px rgba(124,58,237,0.3), 0 1px 0 rgba(255,255,255,0.3) inset;
        }
      `}</style>

      <header className={scrolled ? "glass-nav" : "glass-nav-transparent"}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}
      >
        <nav
          style={{
            maxWidth: "1152px",
            margin: "0 auto",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo — left */}
          <button
            onClick={() => scrollTo("hero")}
            style={{ display: "flex", alignItems: "center", gap: "10px", background: "none", border: "none", cursor: "pointer", flexShrink: 0 }}
          >
            <div className="logo-icon" style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Code2 size={16} color="white" />
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 18, color: "#1e293b", letterSpacing: "-0.02em" }}>
              Aaron<span style={{ color: "#7c3aed" }}>.</span>
            </span>
          </button>

          {/* Center — glass pill with nav links */}
          <div
            className="glass-pill"
            style={{
              display: "none",
              borderRadius: 18,
              padding: "6px 8px",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            id="desktop-nav"
          >
            <ul style={{ display: "flex", alignItems: "center", gap: 4, listStyle: "none", margin: 0, padding: 0 }}>
              {links.map((l) => (
                <li key={l.id}>
                  <button
                    onClick={() => scrollTo(l.id)}
                    className={activeSection === l.id ? "nav-link-active" : "nav-link-inactive"}
                    style={{
                      padding: "6px 16px",
                      fontSize: 14,
                      fontWeight: 500,
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      display: "block",
                    }}
                  >
                    {l.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Right — CTA + burger */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <button
              onClick={() => scrollTo("contact")}
              className="cta-glass"
              id="contact-cta"
              style={{
                display: "none",
                padding: "8px 20px",
                borderRadius: 12,
                color: "white",
                fontSize: 14,
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                letterSpacing: "0.01em",
              }}
            >
              Contact
            </button>

            <button
              onClick={() => setOpen(!open)}
              className="burger-glass"
              id="burger-btn"
              aria-label="Menu"
              style={{ color: "#64748b" }}
            >
              {open ? <X size={18} strokeWidth={2} /> : <Menu size={18} strokeWidth={2} />}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown */}
        <div
          className="mobile-menu-glass"
          style={{
            overflow: "hidden",
            maxHeight: open ? "320px" : "0",
            opacity: open ? 1 : 0,
            transition: "max-height 0.35s ease, opacity 0.25s ease",
          }}
        >
          <ul style={{ padding: "12px 20px 16px", display: "flex", flexDirection: "column", gap: 4, listStyle: "none", margin: 0 }}>
            {[...links, { id: "contact", label: "Contact" }].map((l) => (
              <li key={l.id}>
                <button onClick={() => scrollTo(l.id)} className="mobile-link">
                  {l.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Show/hide desktop elements via style tag based on viewport */}
        <style>{`
          @media (min-width: 768px) {
            #desktop-nav { display: block !important; }
            #contact-cta { display: block !important; }
            #burger-btn { display: none !important; }
          }
        `}</style>
      </header>
    </>
  );
}
