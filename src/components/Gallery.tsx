"use client";

import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { useMemo, useRef, useState } from "react";
import { styleName, styles, type StyleSlug } from "@/lib/site";
import type { Slide, Work } from "@/lib/works";
import { Lightbox, type View } from "./Lightbox";
import { SigilArt } from "./SigilArt";

const EASE = [0.16, 1, 0.3, 1] as const;

// ritmo irregular da grade: se repete a cada 6 peças
const SPANS = [
  "md:col-span-5",
  "md:col-span-4 md:mt-28",
  "md:col-span-3 md:mt-10",
  "md:col-span-3",
  "md:col-span-4 md:mt-20",
  "md:col-span-5 md:mt-6",
];
const RATIOS = ["aspect-[4/5]", "aspect-[4/5]", "aspect-[3/4]", "aspect-[3/4]", "aspect-[4/5]", "aspect-[4/5]"];
const DRIFT = [20, 50, 80, 60, 30, 45];

export function Media({
  slide,
  alt,
  sizes,
  fit = "cover",
  controls = false,
}: {
  slide: Slide;
  alt: string;
  sizes: string;
  fit?: "cover" | "contain";
  controls?: boolean;
}) {
  const object = fit === "cover" ? "object-cover" : "object-contain";
  if (slide.type === "image") {
    return <Image src={slide.src} alt={alt} fill sizes={sizes} draggable={false} className={`select-none ${object}`} />;
  }
  if (slide.type === "video") {
    return (
      <video
        src={slide.src}
        aria-label={alt}
        className={`absolute inset-0 h-full w-full ${object}`}
        controls={controls}
        muted={!controls}
        playsInline
        preload="metadata"
      />
    );
  }
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div
        className={`grid place-items-center bg-paper text-ink ${fit === "cover" ? "h-full w-full" : "aspect-[4/5] h-full max-w-full"}`}
      >
        <SigilArt seed={slide.seed} line={5} className="h-[88%] w-[88%]" />
      </div>
    </div>
  );
}

function Tile({ work, index, onOpen }: { work: Work; index: number; onOpen: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const drift = DRIFT[index % DRIFT.length];
  const y = useTransform(scrollYProgress, [0, 1], [drift, -drift]);
  const count = work.slides.length;
  const cover = work.slides[0];

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={`${index % 3 === 0 ? "col-span-2" : "col-span-1"} ${SPANS[index % SPANS.length]}`}
    >
      <motion.div style={{ y }}>
        <button
          type="button"
          onClick={onOpen}
          className="group block w-full text-left"
          aria-label={`Abrir ${work.title}${count > 1 ? `, ${count} fotos` : ""}`}
        >
          <motion.div
            className={`relative overflow-hidden ${RATIOS[index % RATIOS.length]}`}
            initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
            whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 1.1, ease: EASE }}
          >
            <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.05]">
              <Media slide={cover} alt={work.title} sizes="(min-width: 768px) 42vw, 100vw" />
            </div>
            {(count > 1 || cover.type === "video") && (
              <span className="absolute right-3 top-3 flex items-center gap-1.5 bg-ink/75 px-2 py-1 font-tech text-[10px] text-bone">
                {cover.type === "video" ? (
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden="true">
                    <path d="M2 1l9 5-9 5z" fill="currentColor" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 12 12" className="h-2.5 w-2.5" aria-hidden="true">
                    <path d="M1 3h8v8H1z" fill="currentColor" />
                    <path d="M3.5 1H11v7.5" fill="none" stroke="currentColor" />
                  </svg>
                )}
                {count > 1 && count}
              </span>
            )}
          </motion.div>
          <span className="mt-3 flex items-baseline justify-between gap-4">
            <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:0%_1px] bg-[position:0_100%] bg-no-repeat font-goth text-2xl font-light transition-[background-size] duration-500 group-hover:bg-[length:100%_1px]">
              {work.title}
            </span>
            <span className="shrink-0 font-tech text-[10px] text-steel">{styleName(work.style)}</span>
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}

export function Gallery({ works, demo }: { works: Work[]; demo: boolean }) {
  const [filter, setFilter] = useState<StyleSlug | "todos">("todos");
  const [view, setView] = useState<View | null>(null);

  const filters = useMemo(
    () => styles.filter((style) => works.some((work) => work.style === style.slug)),
    [works],
  );
  const visible = useMemo(
    () => (filter === "todos" ? works : works.filter((work) => work.style === filter)),
    [works, filter],
  );

  const chip = (active: boolean) =>
    `border px-4 py-2 font-tech text-[11px] transition-colors duration-300 ${
      active ? "border-bone bg-bone text-ink" : "border-white/25 text-bone hover:border-bone"
    }`;

  return (
    <section id="trabalhos" className="bg-ink px-5 pb-40 pt-10 text-bone md:px-10 md:pb-56">
      <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
        <h2 className="font-goth text-[clamp(4.5rem,14vw,14rem)] font-extralight leading-[0.86]">Trabalhos</h2>
        <div className="md:max-w-md md:pb-4">
          {demo && (
            <p className="mb-5 text-sm text-steel">
              Peças de exemplo desenhadas pelo site. As fotos dos trabalhos entram aqui.
            </p>
          )}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por estilo">
            <button type="button" className={chip(filter === "todos")} aria-pressed={filter === "todos"} onClick={() => setFilter("todos")}>
              Todos
            </button>
            {filters.map((style) => (
              <button
                key={style.slug}
                type="button"
                className={chip(filter === style.slug)}
                aria-pressed={filter === style.slug}
                onClick={() => setFilter(style.slug)}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-2 items-start gap-x-3 gap-y-24 md:mt-28 md:grid-cols-12 md:gap-x-8 md:gap-y-32">
        <AnimatePresence initial={false}>
          {visible.map((work, index) => (
            <Tile key={work.slug} work={work} index={index} onOpen={() => setView({ work: index, slide: 0 })} />
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {view && <Lightbox works={visible} view={view} setView={setView} />}
      </AnimatePresence>
    </section>
  );
}
