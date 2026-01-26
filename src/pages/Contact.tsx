import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import ReCAPTCHA from "react-google-recaptcha";

const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);
  const form = useRef<HTMLFormElement>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ✅ Vérifie que le reCAPTCHA est validé
    const token = recaptchaRef.current?.getValue();
    if (!token) {
      alert("Veuillez valider le reCAPTCHA avant d’envoyer le message !");
      return;
    }

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
           recaptchaRef.current?.reset(); // Reset le captcha après envoi
        },
        (error) => {
          console.error("Erreur:", error.text);
        }
      );
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-20">
      <motion.h2 initial={{ y: -6, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-3xl font-bold mb-4">
        Contact
      </motion.h2>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.08 }} className="text-white/80 mb-6">
        Envie d'en discuter ? Envoie-moi un message — je réponds rapidement.
      </motion.p>

      <form ref={form} onSubmit={handleSubmit} className="bg-white/5 p-6 rounded-2xl border border-white/40 shadow-md space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <input required name="name" placeholder="Ton nom" className="p-3 rounded-md bg-transparent border border-white/40  outline-none" />
          <input required name="email" type="email" placeholder="Ton email" className="p-3 rounded-md bg-transparent border border-white/40  outline-none" />
          <input type="hidden" name="reply_to" value="" />
          <textarea required name="message" placeholder="Ton message" rows={6} className="p-3 rounded-md bg-transparent border border-white/40  outline-none"></textarea>

          {/* reCAPTCHA */}
          <ReCAPTCHA
            sitekey="6LdBmgUsAAAAALOhCeQEwumYx4FXcUvH94p_UByh" // remplace par ta clé
            ref={recaptchaRef}
          />

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
    </main>
  );
};

export default Contact;
