"use client";

import { motion, type Variants } from "motion/react";
import { useId, useMemo } from "react";
import { makeSigil, type SigilOptions } from "@/lib/sigil";

type Props = {
  seed: number;
  options?: SigilOptions;
  /** hollow: contorno oco + juntas pretas; line: só contorno; fill: sólido; tone: retícula */
  variant?: "hollow" | "line" | "fill" | "tone";
  /** espessura do traço, em unidades do viewBox (1100 de largura) */
  line?: number;
  /** desenha o contorno quando entra na tela */
  draw?: boolean;
  className?: string;
};

const VIEW = { x: -50, y: -50, width: 1100, height: 1100 };

const boneVariants: Variants = {
  hidden: { pathLength: 0, fillOpacity: 0 },
  shown: (i: number) => ({
    pathLength: 1,
    fillOpacity: 1,
    transition: {
      pathLength: { duration: 1.3, delay: i * 0.04, ease: "easeInOut" },
      fillOpacity: { duration: 0.6, delay: 0.9 + i * 0.04 },
    },
  }),
};

const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  shown: (i: number) => ({ opacity: 1, transition: { duration: 0.5, delay: 1.9 + i * 0.03 } }),
};

const hairVariants: Variants = {
  hidden: { pathLength: 0 },
  shown: { pathLength: 1, transition: { duration: 0.9, delay: 1.6, ease: "easeOut" } },
};

export function SigilArt({ seed, options, variant = "hollow", line = 3.2, draw = false, className }: Props) {
  const id = useId();
  const { talons, span, weight, lower } = options ?? {};
  const sigil = useMemo(
    () => makeSigil(seed, { talons, span, weight, lower }),
    [seed, talons, span, weight, lower],
  );
  const solid = variant === "fill";

  return (
    <motion.svg
      viewBox={`${VIEW.x} ${VIEW.y} ${VIEW.width} ${VIEW.height}`}
      className={className}
      aria-hidden="true"
      initial={draw ? "hidden" : false}
      whileInView={draw ? "shown" : undefined}
      viewport={{ once: true, amount: 0.35 }}
    >
      <defs>
        {/* esconde o interior dos ossos: sobra só o contorno externo da união */}
        <mask id={`${id}-bones`} maskUnits="userSpaceOnUse" {...VIEW}>
          <rect {...VIEW} fill="#fff" />
          {!solid && (
            <g fill="#000">
              {sigil.bones.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </g>
          )}
        </mask>
        {variant === "tone" && (
          <pattern id={`${id}-tone`} width="13" height="13" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <circle cx="6.5" cy="6.5" r="3.4" fill="currentColor" />
          </pattern>
        )}
      </defs>

      {variant === "tone" && (
        <g fill={`url(#${id}-tone)`}>
          {sigil.bones.map((d, i) => (
            <motion.path key={i} d={d} custom={i} variants={draw ? fadeVariants : undefined} />
          ))}
        </g>
      )}

      <g mask={`url(#${id}-bones)`}>
        <g
          fill={solid ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={solid ? 1 : line * 2}
          strokeLinejoin="round"
        >
          {sigil.bones.map((d, i) => (
            <motion.path key={i} d={d} custom={i} variants={draw ? boneVariants : undefined} />
          ))}
        </g>
        {variant !== "line" && (
          <g fill="currentColor">
            {sigil.accents.map((d, i) => (
              <motion.path key={i} d={d} custom={i} variants={draw ? fadeVariants : undefined} />
            ))}
          </g>
        )}
      </g>

      <g fill="none" stroke="currentColor" strokeWidth={line * 0.6} strokeLinecap="round">
        {sigil.hairlines.map((d, i) => (
          <motion.path key={i} d={d} variants={draw ? hairVariants : undefined} />
        ))}
      </g>
    </motion.svg>
  );
}
