"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { styles, type Style } from "@/lib/site";
import { SigilArt } from "./SigilArt";

function Panel({ style }: { style: Style }) {
  const army = style.slug === "army";
  return (
    <article className="relative flex h-full w-screen shrink-0 flex-col justify-end gap-6 px-5 pb-14 pt-24 md:flex-row md:items-end md:justify-between md:px-10 md:pb-16">
      {style.slug === "manga" && (
        <div className="screentone absolute inset-y-0 right-0 w-1/2 text-white/15 [mask-image:linear-gradient(to_left,black,transparent)]" />
      )}
      <div
        className={`absolute right-[-12vw] top-1/2 aspect-square w-[min(120vw,80svh)] -translate-y-[60%] md:right-[4vw] md:-translate-y-[46%] ${army ? "text-stencil" : "text-mist"}`}
      >
        <SigilArt
          seed={style.seed}
          variant={style.variant}
          draw
          options={style.slug === "blackwork" ? { weight: 0.2 } : style.slug === "manga" ? { weight: 0.3 } : undefined}
          className="h-full w-full"
        />
      </div>

      <div className="relative max-w-xl">
        <h3 className="chrome-text pb-[0.12em] font-goth text-[clamp(4.5rem,15vw,15rem)] font-extralight leading-[0.86]">
          {style.name}
        </h3>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-mist">{style.text}</p>
      </div>
      {style.note && (
        <p lang="ko" className="relative font-tech text-sm text-mist">
          {style.note}
        </p>
      )}
    </article>
  );
}

export function StylesSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const count = styles.length;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${((count - 1) / count) * 100}%`]);

  if (reduce) {
    return (
      <section id="estilos" className="bg-ink text-bone">
        <h2 className="px-5 pt-24 font-tech text-sm md:px-10">Estilos</h2>
        {styles.map((style) => (
          <div key={style.slug} className="relative h-svh overflow-hidden">
            <Panel style={style} />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section ref={ref} id="estilos" className="relative bg-ink text-bone" style={{ height: `${count * 100}svh` }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-x-0 top-20 z-10 flex items-center justify-between px-5 font-tech text-xs md:top-24 md:px-10">
          <h2>Estilos</h2>
          <div className="relative h-px w-28 bg-white/25 md:w-56">
            <motion.div style={{ scaleX: scrollYProgress }} className="absolute inset-0 origin-left bg-white" />
          </div>
        </div>
        <motion.div style={{ x, width: `${count * 100}vw` }} className="flex h-full">
          {styles.map((style) => (
            <Panel key={style.slug} style={style} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
