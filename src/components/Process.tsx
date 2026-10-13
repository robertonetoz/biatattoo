"use client";

import { motion, useScroll } from "motion/react";
import { useRef } from "react";
import { steps } from "@/lib/site";
import { ThornEdge } from "./ThornEdge";

export function Process() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.55"] });

  return (
    <section className="relative bg-paper px-5 pb-56 pt-20 md:px-10 md:pb-80 md:pt-28">
      <div className="grid gap-12 md:grid-cols-12">
        <h2 className="font-goth text-[clamp(3rem,6.4vw,6.5rem)] font-light leading-[0.92] md:col-span-5">
          Do primeiro oi à pele curada
        </h2>
        <ol ref={ref} className="relative md:col-span-6 md:col-start-7">
          <span aria-hidden="true" className="absolute bottom-0 left-0 top-0 w-px bg-ink/15" />
          <motion.span
            aria-hidden="true"
            style={{ scaleY: scrollYProgress }}
            className="absolute bottom-0 left-0 top-0 w-px origin-top bg-ink"
          />
          {steps.map((step, i) => (
            <li key={step.title} className="relative pb-12 pl-8 last:pb-0 md:pl-12">
              <span className="font-tech text-xs text-graphite">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-2 font-goth text-4xl font-light md:text-5xl">{step.title}</h3>
              <p className="mt-3 max-w-md text-lg leading-relaxed text-graphite">{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
      <ThornEdge seed={41} />
    </section>
  );
}
