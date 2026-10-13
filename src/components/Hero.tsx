"use client";

import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { useId, useMemo, useRef } from "react";
import { makeSigil } from "@/lib/sigil";
import { site } from "@/lib/site";

const EASE = [0.16, 1, 0.3, 1] as const;
const BOX = "absolute left-1/2 top-1/2 aspect-square w-[min(150vw,118svh)] -translate-x-1/2 -translate-y-1/2";
const VIEW = { x: -50, y: -50, width: 1100, height: 1100 };
const VIEW_BOX = `${VIEW.x} ${VIEW.y} ${VIEW.width} ${VIEW.height}`;
const HERO_SEED = 6;
// o traço é desenhado com o dobro da espessura; a máscara apaga a metade de dentro
const STROKE = 7;

// Esconde o interior dos ossos: sobra só o contorno externo da união das formas.
function BoneMask({ id, bones }: { id: string; bones: string[] }) {
  return (
    <mask id={id} maskUnits="userSpaceOnUse" {...VIEW}>
      <rect {...VIEW} fill="#fff" />
      <g fill="#000">
        {bones.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>
    </mask>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const id = useId();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // ao rolar: as letras se afastam e o sigilo cresce entre elas
  const gap = useTransform(scrollYProgress, [0, 0.45], [0, 17]);
  const left = useMotionTemplate`-${gap}vw`;
  const right = useMotionTemplate`${gap}vw`;
  const scale = useTransform(scrollYProgress, [0, 0.6], [1, 1.5]);
  const rotate = useTransform(scrollYProgress, [0, 0.6], [0, 8]);
  const fade = useTransform(scrollYProgress, [0, 0.18], [1, 0]);

  const sigil = useMemo(() => makeSigil(HERO_SEED, { talons: 4, lower: false }), []);

  const letter = (delay: number) => ({
    initial: { y: "105%" },
    animate: { y: "0%" },
    transition: { duration: 1.1, delay, ease: EASE },
  });

  return (
    <section ref={ref} id="topo" className="relative h-[180svh]">
      <div className="sticky top-0 h-svh overflow-hidden bg-paper">
        <h1 className="absolute inset-0 flex items-center justify-center font-tech text-[35vw] leading-none md:text-[27vw]">
          <span className="sr-only">{site.name}</span>
          <motion.span aria-hidden="true" style={{ x: left }} className="overflow-hidden pb-[0.06em]">
            <motion.span className="block" {...letter(0.1)}>B</motion.span>
          </motion.span>
          <span aria-hidden="true" className="overflow-hidden pb-[0.06em]">
            <motion.span className="block" {...letter(0.18)}>I</motion.span>
          </span>
          <motion.span aria-hidden="true" style={{ x: right }} className="overflow-hidden pb-[0.06em]">
            <motion.span className="block" {...letter(0.26)}>A</motion.span>
          </motion.span>
        </h1>

        {/* tinta: branca em modo "difference" — preta no papel, branca sobre as letras */}
        <motion.div style={{ scale, rotate }} className={`${BOX} mix-blend-difference`} aria-hidden="true">
          <svg viewBox={VIEW_BOX} className="h-full w-full">
            <defs>
              <BoneMask id={`${id}-ink`} bones={sigil.bones} />
            </defs>
            <g mask={`url(#${id}-ink)`}>
              <g fill="none" stroke="#fff" strokeWidth={STROKE} strokeLinejoin="round">
                {sigil.bones.map((d, i) => (
                  <motion.path
                    key={i}
                    d={d}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 1.5 + i * 0.04 }}
                  />
                ))}
              </g>
              <g fill="#fff">
                {sigil.accents.map((d, i) => (
                  <motion.path
                    key={i}
                    d={d}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 2.2 + i * 0.04 }}
                  />
                ))}
              </g>
            </g>
            <g fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round">
              {sigil.hairlines.map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 2.6, ease: "easeOut" }}
                />
              ))}
            </g>
          </svg>
        </motion.div>

        {/* decalque: o contorno roxo é desenhado antes da tinta e some depois */}
        <motion.div style={{ scale, rotate }} className={`${BOX} text-stencil`} aria-hidden="true">
          <motion.svg
            viewBox={VIEW_BOX}
            className="h-full w-full"
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.9, delay: 2.7 }}
          >
            <defs>
              <BoneMask id={`${id}-stencil`} bones={sigil.bones} />
            </defs>
            <g mask={`url(#${id}-stencil)`} fill="none" stroke="currentColor" strokeWidth={STROKE} strokeLinejoin="round">
              {sigil.bones.map((d, i) => (
                <motion.path
                  key={i}
                  d={d}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.3, delay: 0.3 + i * 0.04, ease: "easeInOut" }}
                />
              ))}
            </g>
          </motion.svg>
        </motion.div>

        <motion.div
          style={{ opacity: fade }}
          className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-5 pb-6 font-tech text-[11px] leading-relaxed md:px-10 md:pb-8 md:text-xs"
        >
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 2.4 }}>
            Tatuagem autoral
            <br />
            {site.base} ~ {site.guest}
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2.6 }}
            className="hidden text-right sm:block"
          >
            Blackwork, linhas finas,
            <br />
            mangá, sigilism
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
