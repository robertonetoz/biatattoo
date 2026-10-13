"use client";

import { motion, type Variants } from "motion/react";
import { useId, useMemo } from "react";
import { makeSigil, starPath, type SigilOptions } from "@/lib/sigil";

type Props = {
  seed: number;
  options?: SigilOptions;
  variant?: "fill" | "line" | "tone";
  /** desenha o contorno e depois preenche quando entra na tela */
  draw?: boolean;
  className?: string;
};

const bladeVariants: Variants = {
  hidden: { pathLength: 0, fillOpacity: 0 },
  shown: (i: number) => ({
    pathLength: 1,
    fillOpacity: 1,
    transition: {
      pathLength: { duration: 1.2, delay: i * 0.03, ease: "easeInOut" },
      fillOpacity: { duration: 0.6, delay: 0.8 + i * 0.03 },
    },
  }),
};

const hairVariants: Variants = {
  hidden: { pathLength: 0 },
  shown: { pathLength: 1, transition: { duration: 0.9, delay: 1.3, ease: "easeOut" } },
};

const starVariants: Variants = {
  hidden: { scale: 0, rotate: -45 },
  shown: (i: number) => ({
    scale: 1,
    rotate: 0,
    transition: { duration: 0.6, delay: 1.7 + i * 0.08, ease: [0.16, 1, 0.3, 1] },
  }),
};

export function SigilArt({ seed, options, variant = "fill", draw = false, className }: Props) {
  const toneId = useId();
  const { tiers, weight, spread, hooks } = options ?? {};
  const sigil = useMemo(
    () => makeSigil(seed, { tiers, weight, spread, hooks }),
    [seed, tiers, weight, spread, hooks],
  );

  const fill = variant === "fill" ? "currentColor" : variant === "tone" ? `url(#${toneId})` : "none";
  const strokeWidth = variant === "fill" ? 1 : variant === "tone" ? 2.4 : 2.2;

  return (
    <motion.svg
      viewBox="-50 -50 1100 1100"
      className={className}
      aria-hidden="true"
      initial={draw ? "hidden" : false}
      whileInView={draw ? "shown" : undefined}
      viewport={{ once: true, amount: 0.35 }}
    >
      {variant === "tone" && (
        <defs>
          <pattern id={toneId} width="13" height="13" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <circle cx="6.5" cy="6.5" r="3.6" fill="currentColor" />
          </pattern>
        </defs>
      )}
      <g fill={fill} stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round">
        {sigil.blades.map((d, i) => (
          <motion.path key={i} d={d} custom={i} variants={draw ? bladeVariants : undefined} />
        ))}
      </g>
      <g fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round">
        {sigil.hairlines.map((d, i) => (
          <motion.path key={i} d={d} variants={draw ? hairVariants : undefined} />
        ))}
      </g>
      <g fill="currentColor">
        {sigil.stars.map((star, i) => (
          <motion.path
            key={i}
            d={starPath(star)}
            custom={i}
            variants={draw ? starVariants : undefined}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}
      </g>
    </motion.svg>
  );
}
