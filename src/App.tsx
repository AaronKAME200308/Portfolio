import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./pages/About";
import Skills from "./pages/Skills";
import Projects from "./pages/Projects";
import Contact from "./pages/Contact";
import ClientOrderPage from "./pages/ClientOrder";
import Admin from "./pages/Admin";
import Privacy from "./pages/Privacy";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import { LangProvider } from "./lib/i18n";
import { trackVisit } from "./lib/track";

// ── Page principale (portfolio) ───────────────────────────
function PortfolioPage() {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => { trackVisit(); }, []);

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


  return (
    <div className="font-body bg-cream text-ink overflow-x-hidden">
      <Navbar activeSection={activeSection} />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />

      {/* ── Mascotte + chatbot (remplace la bulle WhatsApp ; WhatsApp est dans le chat) ── */}
      <ChatWidget />
    </div>
  );
}

// ── App avec routing ──────────────────────────────────────
export default function App() {
  return (
    <LangProvider>
      <Routes>
        {/* Portfolio principal */}
        <Route path="/" element={<PortfolioPage />} />

        {/* Page commande client — accessible via lien unique */}
        <Route path="/order/:token" element={<ClientOrderPage />} />

        {/* Politique de confidentialité */}
        <Route path="/confidentialite" element={<Privacy />} />
        <Route path="/privacy" element={<Privacy />} />

        {/* Tableau de bord privé (connexion requise) */}
        <Route path="/admin" element={<Admin />} />

        {/* 404 fallback */}
        <Route path="*" element={<PortfolioPage />} />
      </Routes>
    </LangProvider>
  );
}