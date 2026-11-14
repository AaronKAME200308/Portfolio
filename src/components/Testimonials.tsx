import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import supabase from "../services/supabase";

type Review = { rating: number; comment: string; author: string; company: string | null; submitted_at: string };

/* Avis clients publiés (validés depuis /admin). N'affiche rien s'il n'y en a pas. */
export default function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    let live = true;
    supabase.rpc("get_public_reviews", { p_limit: 6 }).then(({ data }) => {
      if (live && Array.isArray(data)) setReviews(data as Review[]);
    });
    return () => { live = false; };
  }, []);

  if (reviews.length === 0) return null;

  return (
    <div className="relative max-w-6xl mx-auto px-6 mt-24 lg:mt-32">
      <div className="mb-10">
        <p className="font-mono-label text-aun mb-3">Retours clients</p>
        <h3 className="font-display font-extrabold text-forest leading-[1.05]" style={{ fontSize: "clamp(1.8rem, 4vw, 2.6rem)" }}>
          Ils m'ont fait confiance.
        </h3>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((r, i) => (
          <motion.figure key={`${r.author}-${r.submitted_at}`}
            initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.45, delay: i * 0.06 }}
            className="relative m-0 flex flex-col rounded-3xl bg-white border-2 border-ink/10 p-6 shadow-[0_18px_40px_-26px_rgba(14,47,32,0.45)]">
            <span aria-hidden className="font-display font-extrabold text-6xl leading-none text-aun/20 select-none">“</span>
            <div className="flex gap-0.5 -mt-2 mb-3" role="img" aria-label={`${r.rating} sur 5`}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Star key={n} size={16} fill={n <= r.rating ? "#f59e0b" : "none"} stroke={n <= r.rating ? "#f59e0b" : "#b9c8bd"} />
              ))}
            </div>
            <blockquote className="m-0 text-ink-soft text-[15px] leading-relaxed whitespace-pre-line flex-1">{r.comment}</blockquote>
            <figcaption className="mt-5 pt-4 border-t-2 border-dashed border-ink/15 flex items-center gap-3">
              <span className="grid place-items-center h-9 w-9 rounded-full bg-forest text-cream font-display font-bold">
                {(r.author || "?").charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0">
                <span className="block font-display font-bold text-forest truncate">{r.author || "Client"}</span>
                {r.company && <span className="block font-mono-label !text-[10px] text-ink-mute truncate">{r.company}</span>}
              </span>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  );
}