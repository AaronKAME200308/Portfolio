import { useState } from "react";
import { Mail, Phone, MapPin, Send, Linkedin, Github, CheckCircle } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: connecter à un service d'envoi (EmailJS, Formspree, etc.)
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 bg-slate-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Label */}
        <div className="flex items-center gap-3 mb-4">
          <span className="h-px w-12 bg-violet-300" />
          <span className="text-violet-500 font-semibold text-sm uppercase tracking-widest">
            Contact
          </span>
        </div>
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Left */}
          <div className="space-y-8">
            <h2 className="font-display text-4xl md:text-5xl font-black text-slate-900 leading-tight">
              Travaillons{" "}
              <span className="bg-linear-to-r from-violet-600 to-blue-500 bg-clip-text text-transparent">
                ensemble
              </span>
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Vous avez un projet en tête ? Une mission freelance ? Ou simplement envie
              d'échanger ? N'hésitez pas à me contacter, je réponds sous 24h.
            </p>

            {/* Contact info */}
            <div className="space-y-4">
              {[
                {
                  icon: Mail,
                  label: "Email",
                  value: "aaronmouele11@gmail.com",
                  href: "mailto:aaronmouele11@gmail.com",
                  color: "violet",
                },
                {
                  icon: Phone,
                  label: "Téléphone",
                  value: "+237 670 464 488",
                  href: "tel:+237670464488",
                  color: "blue",
                },
                {
                  icon: MapPin,
                  label: "Localisation",
                  value: "Yaoundé, Cameroun",
                  href: null,
                  color: "emerald",
                },
              ].map(({ icon: Icon, label, value, href, color }) => (
                <div key={label} className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                      color === "violet"
                        ? "bg-violet-100 text-violet-600"
                        : color === "blue"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    <Icon size={18} />
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">{label}</p>
                    {href ? (
                      <a href={href} className="text-slate-800 font-medium hover:text-violet-600 transition-colors text-sm">
                        {value}
                      </a>
                    ) : (
                      <p className="text-slate-800 font-medium text-sm">{value}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Socials */}
            <div className="flex gap-3">
              {[
                { icon: Github, href: "https://github.com/AaronKAME200308", label: "GitHub" },
                { icon: Linkedin, href: "https://www.linkedin.com/in/aaron-kame-mouele-b82619289/", label: "LinkedIn" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-violet-600 hover:border-violet-200 hover:shadow-md transition-all"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4 text-center">
                <CheckCircle size={48} className="text-emerald-500" />
                <p className="font-bold text-xl text-slate-800">Message envoyé !</p>
                <p className="text-slate-500 text-sm">Je vous répondrai dans les plus brefs délais.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      Nom
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      required
                      placeholder="Votre nom"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="votre@email.com"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Sujet
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    placeholder="Sujet de votre message"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Décrivez votre projet ou votre demande..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-800 text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-violet-300 focus:border-violet-300 transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-linear-to-r from-violet-600 to-blue-600 text-white font-semibold shadow-lg shadow-violet-200 hover:shadow-xl hover:shadow-violet-300 hover:-translate-y-0.5 transition-all duration-200"
                >
                  <Send size={16} />
                  Envoyer le message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
