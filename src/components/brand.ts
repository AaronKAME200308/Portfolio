// Charte graphique Aun v1.0 — source unique des couleurs et polices
export const C = {
  aun: "#1E7B4A",    // Vert Aun — logo, boutons, liens, accents
  foret: "#0E2F20",  // Vert Forêt — fonds sombres, titres
  mousse: "#6BAF7B", // Vert Mousse — détails, états, logo sur noir (jamais de texte sur fond clair)
  sauge: "#DCEADD",  // Vert Sauge — surfaces, cartes, séparateurs
  creme: "#F6F4EC",  // Crème — fond principal des pages
  noir: "#0B0F0C",   // Noir — texte courant
  blanc: "#FFFFFF",
} as const;

export const F = {
  title: "'Outfit', sans-serif",        // Titres 600 / 700
  body: "'Nunito Sans', sans-serif",    // Texte 400 / 600
  mono: "'JetBrains Mono', monospace",  // Détails 400 / 500 / 600
} as const;

export const EASE = [0.22, 1, 0.36, 1] as const;

// Logos (à placer dans /public, fichiers d'origine de la charte)
export const LOGO = {
  vert: "/Aun/aun-symbole-vert.svg",
  blanc: "/Aun/aun-symbole-blanc.svg",
} as const;