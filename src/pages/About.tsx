import { motion } from "framer-motion";

const About = () => {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <motion.h2 initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="text-3xl font-bold mb-4">
        À propos
      </motion.h2>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="text-lg text-white/85 leading-relaxed">
        Je suis étudiant en <strong>Licence 3 Génie Logiciel</strong>, passionné par le machine learning, la vision par ordinateur et le développement web.
        J’aime construire des applications où l’IA rencontre une expérience utilisateur propre et moderne — par exemple mon projet de détection de maladies de tomates utilisant
        un pipeline YOLOv5 → EfficientNet et une API FastAPI pour la mise en production locale.
      </motion.p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.15 }} className="p-6 bg-white/5 rounded-2xl">
          <h4 className="font-semibold mb-2">Compétences principales</h4>
          <ul className="text-sm text-white/80 space-y-2">
            <li>• Deep Learning (PyTorch, EfficientNet)</li>
            <li>• Vision par ordinateur (YOLOv5)</li>
            <li>• Backend (FastAPI, Node.js)</li>
            <li>• Frontend (React, TypeScript, Tailwind)</li>
            <li>• Bases de données (MySQL)</li>
          </ul>
        </motion.div>

        <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.25 }} className="p-6 bg-white/5 rounded-2xl">
          <h4 className="font-semibold mb-2">Outils & Workflow</h4>
          <p className="text-sm text-white/80">
            Git (GitHub), Docker (pour prototyper), VSCode, Figma pour le design d'interfaces, et méthodologie itérative (test & déploiement local).
          </p>
        </motion.div>
      </div>
    </main>
  );
};

export default About;
