"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useMemo, useRef } from "react";
import { thornRow } from "@/lib/sigil";

type Props = {
  seed?: number;
  /** espinhos pendurados no topo da seção em vez de brotarem da base */
  flip?: boolean;
  className?: string;
};

// Borda de espinhos entre uma seção clara e uma escura; cresce conforme o scroll.
export function ThornEdge({ seed = 5, flip = false, className = "text-ink" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.5"] });
  const scaleY = useTransform(scrollYProgress, [0, 1], [0.1, 1]);
  const paths = useMemo(() => thornRow(seed), [seed]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 ${flip ? "-top-px -scale-y-100" : "-bottom-px"} ${className}`}
    >
      <motion.svg
        viewBox="0 0 1440 140"
        preserveAspectRatio="none"
        className="block h-16 w-full md:h-32"
        style={{ scaleY, originY: 1 }}
        fill="currentColor"
      >
        {paths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </motion.svg>
    </div>
  );
}
