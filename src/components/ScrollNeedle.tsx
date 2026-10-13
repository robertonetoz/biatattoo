"use client";

import { motion, useMotionTemplate, useScroll, useSpring } from "motion/react";

// Progresso da página: uma linha fina na borda direita, com uma estrela na ponta.
export function ScrollNeedle() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const top = useMotionTemplate`calc(${progress} * 100%)`;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed right-4 top-1/2 z-40 hidden h-[36vh] w-px -translate-y-1/2 bg-white/25 mix-blend-difference md:block"
    >
      <motion.div style={{ scaleY: progress }} className="absolute inset-0 origin-top bg-white" />
      <motion.svg
        viewBox="-20 -20 40 40"
        style={{ top }}
        className="absolute left-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2"
      >
        <path d="M0 -18Q0 0 11 0Q0 0 0 18Q0 0 -11 0Q0 0 0 -18Z" fill="#fff" />
      </motion.svg>
    </div>
  );
}
