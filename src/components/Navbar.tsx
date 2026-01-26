import { NavLink } from "react-router-dom";
import { motion} from "framer-motion";

const links = [
  { label: "Accueil", to: "/" },
  { label: "Projets", to: "/projects" },
  { label: "À propos", to: "/about" },
  { label: "Contact", to: "/contact" },
];

const Navbar = () => {

  return (
    <header className="backdrop-blur-md bg-black/30 sticky top-0 z-50 ">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <motion.p
          initial={{ scale: 0.98, opacity: 0.9 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="text-2xl font-extrabold tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-blue-300"
        >
          KAME MOUELE Aaron<span className="text-sm ml-2 font-medium text-white/70">Portfolio</span>
        </motion.p>

        <nav>
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
      </div>
    </header>
  );
};

export default Navbar;
