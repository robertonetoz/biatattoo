"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";
import { site } from "@/lib/site";
import { SigilArt } from "./SigilArt";

// Botão que é puxado de leve na direção do ponteiro.
function Magnetic({ href, children }: { href: string; children: ReactNode }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16 });
  const sy = useSpring(y, { stiffness: 220, damping: 16 });

  const onMove = (event: PointerEvent<HTMLAnchorElement>) => {
    if (event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - (box.left + box.width / 2)) * 0.25);
    y.set((event.clientY - (box.top + box.height / 2)) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="inline-flex items-center gap-4 rounded-full bg-bone px-8 py-5 font-tech text-xs text-ink transition-colors duration-300 hover:bg-mist md:px-10 md:py-6 md:text-sm"
    >
      {children}
    </motion.a>
  );
}

export function Contact() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const rise = useTransform(scrollYProgress, [0.3, 1], ["38%", "0%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], [-14, 0]);

  return (
    <section ref={ref} id="orcamento" className="relative overflow-hidden bg-ink px-5 pt-28 text-bone md:px-10 md:pt-40">
      <motion.div
        style={{ rotate }}
        className="pointer-events-none absolute right-[-30vw] top-10 aspect-square w-[110vw] text-white/20 md:right-[-8vw] md:top-0 md:w-[56vw]"
      >
        <SigilArt seed={9} variant="line" draw className="h-full w-full" />
      </motion.div>

      <div className="relative">
        <h2 className="max-w-[13ch] font-goth text-[clamp(3.2rem,8.6vw,9rem)] font-extralight leading-[0.9]">
          Sua próxima tatuagem começa com uma mensagem
        </h2>
        <p className="mt-8 max-w-md text-lg leading-relaxed text-mist">
          Conte a ideia, o local do corpo e o tamanho. A Bia responde com orçamento e datas.
        </p>
        <div className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-6">
          <Magnetic href={site.whatsapp}>
            Pedir orçamento no WhatsApp
            <svg viewBox="-20 -20 40 40" className="h-4 w-4" aria-hidden="true">
              <path d="M0 -18Q0 0 11 0Q0 0 0 18Q0 0 -11 0Q0 0 0 -18Z" fill="currentColor" />
            </svg>
          </Magnetic>
          <a href={site.instagram} target="_blank" rel="noreferrer" className="font-tech text-xs underline underline-offset-8">
            Instagram
          </a>
          <a href={site.threads} target="_blank" rel="noreferrer" className="font-tech text-xs underline underline-offset-8">
            Threads
          </a>
        </div>
      </div>

      <footer className="relative mt-32 md:mt-48">
        <div className="flex flex-wrap justify-between gap-4 pb-6 font-tech text-[11px] text-steel">
          <p>
            {site.name} {site.kana}
          </p>
          <p>
            {site.base} ~ {site.guest}
          </p>
          <p>@{site.handle}</p>
        </div>
        <div className="overflow-hidden">
          <motion.p
            aria-hidden="true"
            style={{ y: rise }}
            className="chrome-text -mb-[0.05em] text-center font-tech text-[31vw] leading-[0.8]"
          >
            BIA
          </motion.p>
        </div>
      </footer>
    </section>
  );
}
