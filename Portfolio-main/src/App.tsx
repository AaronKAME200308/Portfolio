import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import ClientOrderPage from "./pages/ClientOrder";
import Footer from "./components/Footer";

const WHATSAPP_NUMBER  = "237670464488";
const WHATSAPP_MESSAGE = "Bonjour, je souhaite discuter d'un projet avec vous.";

// ── Page principale (portfolio) ───────────────────────────
function PortfolioPage() {
  const [activeSection, setActiveSection] = useState("hero");
  const [showTooltip,   setShowTooltip]   = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    document.querySelectorAll("section[id]").forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div className="font-body bg-slate-50 text-slate-800 overflow-x-hidden">
      <Navbar activeSection={activeSection} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />

      {/* ── Bouton WhatsApp flottant ── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white whitespace-nowrap"
              style={{
                background: "rgba(18,140,70,0.92)",
                backdropFilter: "blur(8px)",
                boxShadow: "0 4px 16px rgba(18,140,70,0.3)",
              }}
            >
              Discutons sur WhatsApp 💬
            </motion.div>
          )}
        </AnimatePresence>

        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contacter sur WhatsApp"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.8 }}
          whileHover={{ scale: 1.1, y: -2 }}
          whileTap={{ scale: 0.95 }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="relative w-14 h-14 rounded-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #25D366, #128C7E)",
            boxShadow: "0 6px 24px rgba(37,211,102,0.45), 0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <FaWhatsapp size={28} color="white" />
          <span
            className="absolute w-14 h-14 rounded-full animate-ping"
            style={{ background: "rgba(37,211,102,0.3)" }}
          />
        </motion.a>
      </div>
    </div>
  );
}

// ── App avec routing ──────────────────────────────────────
export default function App() {
  return (
      <Routes>
        {/* Portfolio principal */}
        <Route path="/" element={<PortfolioPage />} />

        {/* Page commande client — accessible via lien unique */}
        <Route path="/order/:token" element={<ClientOrderPage />} />

        {/* 404 fallback */}
        <Route path="*" element={<PortfolioPage />} />
      </Routes>
  );
}