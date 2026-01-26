import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const links = [
  { label: "Accueil", to: "/" },
  { label: "Projets", to: "/projects" },
  { label: "À propos", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="backdrop-blur-md bg-black/30 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        
        {/* LOGO */}
        <motion.p
          initial={{ scale: 0.98, opacity: 0.9 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-300"
        >
          KAME MOUELE Aaron
          <span className="text-sm ml-2 font-medium text-white/70">Portfolio</span>
        </motion.p>

        {/* DESKTOP NAV */}
        <nav className="hidden md:block">
          <ul className="flex gap-6 items-center text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md transition-all ${
                      isActive
                        ? "bg-white/10 text-white shadow-sm"
                        : "text-white/80 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white focus:outline-none bg-gradient-to-r from-purple-600 to-blue-500 p-2 rounded-md"
        >
          <span className="text-2xl ">
            {open ? "✕" : "☰"}
          </span>
        </button>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden bg-gradient-to-r from-purple-600 to-blue-500 backdrop-blur-md"
          >
            <ul className="flex flex-col gap-2 px-6 py-4">
              {links.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-md transition-all ${
                        isActive
                          ? "bg-white/10 text-black"
                          : "text-black/80 hover:text-white hover:bg-white/5"
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
