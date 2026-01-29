import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";

const Contact = () => {
  const [sent, setSent] = useState(false);
  const form = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();


    if (!form.current) return;

    emailjs
      .sendForm(
        "service_g1bupfs",      
        "template_6wnehip",     
        form.current,
        "thwBzJSO7Ntifo4PK"       
      )
      .then(
        () => {
          setSent(true);        
          (form.current as HTMLFormElement).reset();
        },
        (error) => {
          console.error("Erreur:", error.text);
        }
      );
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <motion.h2 initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-bold mb-4">
        Contact
      </motion.h2>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }} className="text-white/80 mb-6">
        Arrête de chercher, tu as trouvé le meilleur. Envoie ton message et regarde la magie opérer.
      </motion.p>

      <form ref={form} onSubmit={handleSubmit} className="bg-white/5 p-6 rounded-2xl border border-white/40 shadow-md space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <input required name="name" placeholder="Ton nom" className="p-3 rounded-md bg-transparent border border-white/40  outline-none" />
          <input required name="email" type="email" placeholder="Ton email" className="p-3 rounded-md bg-transparent border border-white/40  outline-none" />
          <input type="hidden" name="reply_to" value="" />
          <textarea required name="message" placeholder="Ton message" rows={6} className="p-3 rounded-md bg-transparent border border-white/40  outline-none"></textarea>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={sent}
              className="px-5 py-2 rounded-md bg-gradient-to-r from-purple-600 to-blue-500 font-medium shadow hover:scale-105 transition"
            >
              {sent ? "Envoi..." : "Envoyer"}
            </button>

            {sent && <span className="text-sm text-green-300">Message envoyé ✓</span>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Contact;
