import { useState } from "react";
import { Check, Loader2, Star, Trash2 } from "lucide-react";
import supabase from "../../services/supabase";
import { inputCls, keyGreen, keyWhite, type Review } from "../../lib/adminData";

/** Créer ou modifier l'avis d'une commande */
export default function ReviewEditor({
  orderId, review, onSaved, onDeleted,
}: { orderId: string; review: Review | null; onSaved: () => void; onDeleted?: () => void }) {
  const [rating, setRating] = useState(review?.rating ?? 5);
  const [comment, setComment] = useState(review?.comment ?? "");
  const [approved, setApproved] = useState(review?.approved ?? false);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [err, setErr] = useState("");

  const save = async () => {
    const c = comment.trim();
    if (c.length < 10 || c.length > 2000) return setErr("Le commentaire doit faire entre 10 et 2000 caractères.");
    setBusy(true); setErr(""); setDone(false);
    const row = { rating, comment: c, approved, approved_at: approved ? new Date().toISOString() : null };
    const res = review
      ? await supabase.from("client_reviews").update(row).eq("id", review.id)
      : await supabase.from("client_reviews").insert({ ...row, order_id: orderId });
    setBusy(false);
    if (res.error) return setErr("Enregistrement impossible.");
    setDone(true); setTimeout(() => setDone(false), 2000);
    onSaved();
  };

  const remove = async () => {
    if (!review || !confirm("Supprimer cet avis ?")) return;
    const { error } = await supabase.from("client_reviews").delete().eq("id", review.id);
    if (error) return setErr("Suppression impossible.");
    onSaved(); onDeleted?.();
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-1" role="radiogroup" aria-label="Note">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} sur 5`}
            onClick={() => setRating(n)} className="p-1">
            <Star size={26} fill={n <= rating ? "#f59e0b" : "none"} stroke={n <= rating ? "#f59e0b" : "#b9c8bd"} />
          </button>
        ))}
      </div>
      <textarea rows={4} className={inputCls} placeholder="Commentaire du client" value={comment} onChange={(e) => setComment(e.target.value)} />
      <label className="flex items-center gap-3 text-sm cursor-pointer">
        <input type="checkbox" checked={approved} onChange={(e) => setApproved(e.target.checked)} className="h-4 w-4 accent-[#1e7b4a]" />
        Publié sur le site
      </label>
      {err && <p className="text-sm text-red-600" role="alert">{err}</p>}
      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={save} disabled={busy} className={`keycap px-5 py-2.5 text-sm font-semibold disabled:opacity-70 ${keyGreen}`}>
          {busy ? <Loader2 size={15} className="animate-spin" /> : done ? <Check size={15} /> : null} {review ? "Enregistrer l'avis" : "Ajouter l'avis"}
        </button>
        {review && (
          <button type="button" onClick={remove} className={`keycap px-5 py-2.5 text-sm font-semibold ${keyWhite}`}>
            <Trash2 size={15} /> Supprimer
          </button>
        )}
      </div>
    </div>
  );
}