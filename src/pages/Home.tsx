import { motion } from "framer-motion";
import { useState } from "react";

const heroVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const buttonHover = { scale: 1.03 };

const Home = () => {

  
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" animate="show" variants={heroVariants} transition={{ duration: 0.6 }}>
          <h2 className="text-5xl font-extrabold leading-tight mb-4">
            Je conçois des applications <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-300 to-blue-200">IA</span> & modernes.
          </h2>

          <p className="text-lg text-white/85 mb-6">
            Étudiant en Génie Logiciel — je réalise des projets fullstack & IA, notamment une application de détection des maladies de plantes (YOLOv5 + EfficientNet + FastAPI).
          </p>

          <div className="flex gap-4">

            <button
              onClick={() => scrollToSection("À propos")}
            >
              <motion.div
                whileHover={buttonHover}
                className="inline-block px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-500 font-semibold shadow-md text-white"
              >
                <p className="text-white">Voir mes projets</p>
              </motion.div>
            </button>

            <button
              onClick={() => scrollToSection("Contact")}
            >
              <motion.div
                whileHover={buttonHover}
                className="inline-block px-6 py-3 rounded-full border border-white text-white/90 hover:bg-white transition"
              >
                Me contacter
              </motion.div>
            </button>
          </div>

          <div className="mt-8 flex gap-4 text-sm text-white/70">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-violet-300" /> AI / ML
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-300" /> Frontend
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-300" /> Backend
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="bg-white/3 p-6 rounded-2xl shadow-lg"
        >
          <div className="h-80 rounded-xl overflow-hidden bg-clip-padding bg-gradient-to-br from-indigo-800 to-indigo-600 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-white/80">Image placeholder</p>
              <h4 className="text-2xl font-semibold mt-3">Application de détection</h4>
              <p className="text-sm text-white/70 mt-2 max-w-sm mx-auto">
                Aperçu rapide de mon application qui détecte les maladies des plantes à partir de photos.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mt-16">
        <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-2xl font-semibold mb-6">
          Projets récents
        </motion.h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Small project cards */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <div className="p-4 bg-white/5 rounded-xl">
              <h4 className="font-semibold">Détection de maladies</h4>
              <p className="text-sm text-white/80 mt-2">YOLOv5 + EfficientNet + FastAPI</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="p-4 bg-white/5 rounded-xl">
              <h4 className="font-semibold">Gestion de Blog</h4>
              <p className="text-sm text-white/80 mt-2">ReactJS, Bootstrap, MySQL</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="p-4 bg-white/5 rounded-xl">
              <h4 className="font-semibold">Application Mail</h4>
              <p className="text-sm text-white/80 mt-2">PHPMailer + hMailServer</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Home;
