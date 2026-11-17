import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

// Mascotte « Aun » : le symbole de la marque avec deux yeux.
// mood : idle (repos) · think (réfléchit) · talk (répond) · wave (salue)
export type Mood = "idle" | "think" | "talk" | "wave";

const BODY =
  "M275.00,790.27C237.52,785.90 204.89,763.67 188.76,731.50C161.96,678.04 179.59,614.12 235.83,560.90C241.02,555.98 257.60,541.57 272.67,528.87C303.12,503.22 324.05,483.03 337.31,466.49C367.74,428.56 390.10,385.72 411.43,324.50C428.82,274.59 432.46,264.77 437.18,255.16C453.75,221.41 480.83,202.56 512.50,202.73C537.38,202.86 558.71,213.89 574.88,235.00C585.86,249.32 590.09,258.82 606.32,305.54C647.42,423.87 676.97,469.73 750.00,528.50C790.01,560.70 806.68,577.37 822.19,600.67C850.98,643.93 855.67,695.07 834.42,733.87C815.01,769.30 781.29,789.14 737.86,790.70C680.05,792.77 645.26,767.89 618.01,705.00C591.44,643.66 573.61,622.44 523.50,592.54C496.99,576.72 486.04,567.82 477.33,555.00C448.05,511.91 470.58,461.10 519.00,461.01C528.93,461.00 547.72,463.93 560.43,467.47C565.35,468.85 569.46,469.86 569.58,469.73C569.70,469.61 563.95,458.70 556.80,445.50C549.66,432.30 536.70,407.60 528.00,390.61L512.19,359.71L509.97,364.11C484.16,415.21 470.37,437.57 446.01,467.87C428.13,490.11 424.51,494.96 419.68,503.20C410.38,519.03 406.00,533.77 406.00,549.27C406.00,580.85 423.28,599.89 462.10,611.10C481.45,616.68 489.69,620.56 496.35,627.22C522.60,653.46 493.91,711.14 435.04,750.47C404.04,771.18 367.74,784.26 326.70,789.49C315.82,790.88 284.31,791.36 275.00,790.27ZM470.62,786.75C471.54,784.96 477.10,774.50 482.98,763.50C488.85,752.50 501.01,729.18 510.00,711.68C519.85,692.50 526.62,680.39 527.03,681.18C543.85,713.55 568.91,761.40 575.36,773.47C580.05,782.25 583.76,789.57 583.59,789.74C583.43,789.90 577.94,788.72 571.40,787.11C551.71,782.25 545.66,781.50 526.50,781.53C507.35,781.55 500.78,782.37 481.81,787.09C475.38,788.69 469.85,790.00 469.53,790.00C469.21,790.00 469.70,788.54 470.62,786.75Z";

const EYE_L = { x: 346, y: 648 };
const EYE_R = { x: 692, y: 648 };

export default function Mascot({ size = 64, mood = "idle", look = true }: { size?: number; mood?: Mood; look?: boolean }) {
  const reduce = useReducedMotion();
  const ref = useRef<SVGSVGElement>(null);
  const [blink, setBlink] = useState(false);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });

  // clignement aléatoire
  useEffect(() => {
    if (reduce) return;
    let t: number;
    const loop = () => {
      t = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 130);
        loop();
      }, 2200 + Math.random() * 3200);
    };
    loop();
    return () => window.clearTimeout(t);
  }, [reduce]);

  // les yeux suivent le curseur (ordinateur uniquement)
  useEffect(() => {
    if (reduce || !look) return;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    const on = (e: MouseEvent) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const k = Math.min(1, d / 260);
      setPupil({ x: (dx / d) * 20 * k, y: (dy / d) * 18 * k });
    };
    window.addEventListener("mousemove", on, { passive: true });
    return () => window.removeEventListener("mousemove", on);
  }, [reduce, look]);

  const p = mood === "think" ? { x: 8, y: -22 } : pupil;
  const bodyAnim =
    reduce ? undefined
    : mood === "talk" ? { y: [0, -9, 0], scaleY: [1, 1.03, 1] }
    : mood === "wave" ? { rotate: [0, -7, 7, -7, 7, 0] }
    : { y: [0, -6, 0], scaleY: [1, 1.015, 1] };

  return (
    <svg ref={ref} width={size} height={size} viewBox="140 170 740 650" role="img" aria-label="Mascotte Aun" style={{ overflow: "visible" }}>
      <motion.g
        style={{ transformOrigin: "512px 780px", transformBox: "view-box" as never }}
        animate={bodyAnim}
        transition={{ duration: mood === "wave" ? 1.1 : mood === "talk" ? 0.55 : 3.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d={BODY} fill="#1E7B4A" fillRule="evenodd" />
        {/* joues */}
        <ellipse cx={EYE_L.x - 40} cy={EYE_L.y + 74} rx="38" ry="19" fill="#6baf7b" opacity=".55" />
        <ellipse cx={EYE_R.x + 40} cy={EYE_R.y + 74} rx="38" ry="19" fill="#6baf7b" opacity=".55" />
        {[EYE_L, EYE_R].map((e, i) => (
          <g key={i}>
            <ellipse cx={e.x} cy={e.y} rx="68" ry={blink ? 7 : 76} fill="#fff" style={{ transition: "ry 90ms" }} />
            {!blink && (
              <>
                <circle cx={e.x + p.x} cy={e.y + p.y} r="36" fill="#0e2f20" style={{ transition: "cx 120ms, cy 120ms" }} />
                <circle cx={e.x + p.x + 10} cy={e.y + p.y - 11} r="11" fill="#fff" />
              </>
            )}
          </g>
        ))}
      </motion.g>
    </svg>
  );
}