import { useLang, type Lang } from "../lib/i18n";

const OPTIONS: { id: Lang; label: string; name: string }[] = [
  { id: "fr", label: "FR", name: "Français" },
  { id: "en", label: "EN", name: "English" },
];

/* Deux touches de clavier : la langue active est enfoncée.
   dark = sur fond vert forêt ; sinon sur fond clair. */
export default function LangSwitch({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useLang();

  const on = dark
    ? "[--key-face:#6baf7b] [--key-edge:#3a7549] [--key-text:#0e2f20]"
    : "[--key-face:#1e7b4a] [--key-edge:#0d4527] [--key-text:#ffffff]";
  const off = dark
    ? "[--key-face:#1c4a34] [--key-edge:#06150e] [--key-text:#f6f4ec]"
    : "[--key-face:#ffffff] [--key-edge:#b9c8bd] [--key-text:#0e2f20]";

  return (
    <div role="group" aria-label={lang === "fr" ? "Langue" : "Language"} className="flex items-center gap-3">
      {OPTIONS.map((o) => {
        const active = lang === o.id;
        return (
          <button
            key={o.id}
            type="button"
            onClick={() => setLang(o.id)}
            aria-pressed={active}
            aria-label={o.name}
            lang={o.id}
            className={`keycap h-9 w-10 text-xs font-bold tracking-wide ${active ? on : off}`}
            style={active ? { transform: "translateY(3px)", filter: "brightness(0.93)", boxShadow: "inset 0 5px 9px rgba(0,0,0,0.35), inset 0 0 0 1.5px color-mix(in srgb, var(--key-face) 70%, white), 0 0 0 4px var(--key-rim), 0 0 0 5px rgba(0,0,0,0.18)" } : undefined}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}