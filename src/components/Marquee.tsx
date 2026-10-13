"use client";

import {
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef } from "react";
import { styles } from "@/lib/site";

const STAR = "M0 -18Q0 0 11 0Q0 0 0 18Q0 0 -11 0Q0 0 0 -18Z";

function Row() {
  return (
    <div className="flex shrink-0 items-center">
      {styles.map((style, i) => (
        <span key={style.slug} className="flex items-center">
          <span className={i % 2 === 0 ? "text-bone" : "outline-text"}>{style.name}</span>
          <svg viewBox="-20 -20 40 40" className="mx-[0.5em] h-[0.42em] w-[0.42em] text-steel">
            <path d={STAR} fill="currentColor" />
          </svg>
        </span>
      ))}
    </div>
  );
}

// Faixa que corre sozinha e acelera/inverte com a velocidade do scroll.
export function Marquee() {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const direction = useRef(1);
  const x = useMotionTemplate`${base}%`;

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const extra = boost.get();
    if (extra < 0) direction.current = -1;
    else if (extra > 0) direction.current = 1;
    const step = direction.current * 2.4 * (delta / 1000) * (1 + Math.abs(extra));
    let next = base.get() - step;
    if (next <= -50) next += 50;
    if (next > 0) next -= 50;
    base.set(next);
  });

  return (
    <div aria-hidden="true" className="overflow-hidden bg-ink py-10 md:py-16">
      <motion.div style={{ x }} className="flex w-max font-tech text-[clamp(2.5rem,7vw,7rem)] leading-none">
        <Row />
        <Row />
      </motion.div>
    </div>
  );
}
