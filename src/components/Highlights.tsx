"use client";

import { motion } from "motion/react";
import { highlights } from "@/lib/site";
import { SigilArt } from "./SigilArt";
import { ThornEdge } from "./ThornEdge";

export function Highlights() {
  return (
    <section id="destaques" className="relative bg-paper px-5 pb-28 pt-44 md:px-10 md:pb-40 md:pt-64">
      <ThornEdge seed={23} flip />
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <h2 className="font-goth text-[clamp(4rem,11vw,11rem)] font-extralight leading-[0.86]">Destaques</h2>
        <p className="max-w-xs text-graphite md:pb-3 md:text-right">
          Os stories que ficam. Cada círculo abre o destaque direto no Instagram.
        </p>
      </div>

      <ul className="mt-16 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 md:mt-24 md:grid-cols-5 md:gap-x-8">
        {highlights.map((item, i) => (
          <motion.li
            key={item.href}
            initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.9, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <a
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="group flex flex-col items-center gap-5"
              aria-label={`${item.name}: abrir destaque no Instagram`}
            >
              <span className="chrome-ring relative block aspect-square w-full max-w-56 rounded-full p-[3px]">
                <span className="relative grid h-full w-full place-items-center overflow-hidden rounded-full bg-paper transition-colors duration-500 group-hover:bg-ink group-hover:text-bone">
                  <SigilArt
                    seed={item.seed}
                    line={9}
                    className="h-[78%] w-[78%] transition-transform duration-700 ease-out group-hover:rotate-180 group-hover:scale-110"
                  />
                </span>
              </span>
              <span className="font-tech text-sm">{item.name}</span>
            </a>
          </motion.li>
        ))}
      </ul>
    </section>
  );
}
