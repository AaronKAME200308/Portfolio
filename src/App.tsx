import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import About from "./pages/About";
import Contact from "./pages/Contact";

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

const App = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen w-screen flex flex-col bg-portfolio-bg text-white">
      <Navbar />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              <motion.div
                variants={pageTransition}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Home />
              </motion.div>
            }
          />
          <Route
            path="/projects"
            element={
              <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
                <Projects />
              </motion.div>
            }
          />
          <Route
            path="/about"
            element={
              <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
                <About />
              </motion.div>
            }
          />
          <Route
            path="/contact"
            element={
              <motion.div variants={pageTransition} initial="initial" animate="animate" exit="exit">
                <Contact />
              </motion.div>
            }
          />
        </Routes>
      </AnimatePresence>
      <Footer />
    </div>
  );
};

export default App;
