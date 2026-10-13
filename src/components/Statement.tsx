"use client";

import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { site } from "@/lib/site";
import { ThornEdge } from "./ThornEdge";

const LINE =
  "Blackwork, linhas finas, mangá e sigilism. Desenho autoral, feito para o corpo de quem vai carregar.";

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.1, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.24em] inline-block">
      {word}
    </motion.span>
  );
}

export function Statement() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = LINE.split(" ");

  return (
    <section className="relative bg-paper px-5 pb-52 pt-28 md:px-10 md:pb-72 md:pt-40">
      <p
        ref={ref}
        className="max-w-[18ch] font-goth text-[clamp(2.6rem,7.4vw,8rem)] font-light leading-[0.98] md:max-w-[20ch]"
      >
        {words.map((word, i) => (
          <Word
            key={i}
            word={word}
            progress={scrollYProgress}
            range={[i / words.length, (i + 1) / words.length]}
          />
        ))}
      </p>

      <div className="mt-20 grid gap-12 md:mt-28 md:grid-cols-12">
        <div className="space-y-5 text-lg leading-relaxed text-graphite md:col-span-5 md:col-start-6">
          <p>
            A Bia tatua em Uberlândia e passa temporadas em São Paulo como guest. O traço dela
            mistura preto sólido, linha fina e painéis de mangá com formas afiadas que acompanham a
            anatomia.
          </p>
          <p>
            Army há anos, ela também assina projetos inspirados no BTS: letras, datas e símbolos
            redesenhados para a pele.
          </p>
        </div>
        <dl className="font-tech text-xs leading-relaxed md:col-span-2 md:col-start-11">
          <dt className="text-graphite">Base</dt>
          <dd className="mb-5">{site.base}</dd>
          <dt className="text-graphite">Guest</dt>
          <dd>{site.guest}</dd>
        </dl>
      </div>

      <ThornEdge seed={11} />
    </section>
  );
}
