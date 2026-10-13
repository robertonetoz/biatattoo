"use client";

import { useLenis } from "lenis/react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { styleName } from "@/lib/site";
import type { Work } from "@/lib/works";
import { Media } from "./Gallery";

export type View = { work: number; slide: number };

const slideVariants: Variants = {
  enter: (dir: number) => ({ x: dir * 80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir * -80, opacity: 0 }),
};

function Arrow({ side, onClick }: { side: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "prev" ? "Foto anterior" : "Próxima foto"}
      className={`absolute top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/30 bg-ink/60 transition-colors duration-300 hover:bg-bone hover:text-ink ${side === "prev" ? "left-3 md:left-8" : "right-3 md:right-8"}`}
    >
      <svg viewBox="0 0 24 24" className={`h-5 w-5 ${side === "next" ? "-scale-x-100" : ""}`} aria-hidden="true">
        <path d="M15 4L7 12l8 8" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </button>
  );
}

export function Lightbox({
  works,
  view,
  setView,
}: {
  works: Work[];
  view: View;
  setView: Dispatch<SetStateAction<View | null>>;
}) {
  const work = works[view.work];
  const count = work.slides.length;
  const [dir, setDir] = useState(1);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  const close = () => setView(null);
  const step = (delta: number) => {
    setDir(delta);
    setView((v) => {
      if (!v) return v;
      const total = works[v.work].slides.length;
      return { work: v.work, slide: (v.slide + delta + total) % total };
    });
  };
  const stepWork = (delta: number) => {
    setDir(delta);
    setView((v) => v && { work: (v.work + delta + works.length) % works.length, slide: 0 });
  };

  // trava o scroll da página e devolve o foco ao fechar
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      previous?.focus({ preventScroll: true });
    };
  }, [lenis]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setView(null);
      else if (event.key === "ArrowRight") step(1);
      else if (event.key === "ArrowLeft") step(-1);
      else if (event.key === "Tab") {
        const nodes = dialogRef.current?.querySelectorAll<HTMLElement>("button, a[href], video[controls]");
        if (!nodes || nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // step só depende de setters estáveis e da lista de trabalhos
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [works]);

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={work.title}
      data-lenis-prevent
      className="fixed inset-0 z-[60] grid grid-rows-[auto_minmax(0,1fr)_auto] bg-ink text-bone"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <header className="flex items-start justify-between gap-6 px-5 py-4 md:px-10 md:py-6">
        <div>
          <h2 className="font-goth text-3xl font-light leading-none md:text-4xl">{work.title}</h2>
          <p className="mt-2 font-tech text-[11px] text-steel">{styleName(work.style)}</p>
        </div>
        <div className="flex items-center gap-6 font-tech text-xs">
          {count > 1 && (
            <span aria-live="polite">
              {view.slide + 1} / {count}
            </span>
          )}
          <button ref={closeRef} type="button" onClick={close} className="border border-white/30 px-4 py-2 transition-colors duration-300 hover:bg-bone hover:text-ink">
            Fechar
          </button>
        </div>
      </header>

      <div className="relative min-h-0 overflow-hidden">
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={`${work.slug}-${view.slide}`}
            custom={dir}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            drag={count > 1 ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) step(1);
              else if (info.offset.x > 70) step(-1);
            }}
            className={`absolute inset-x-4 inset-y-0 md:inset-x-28 ${count > 1 ? "cursor-grab active:cursor-grabbing" : ""}`}
          >
            <Media
              slide={work.slides[view.slide]}
              alt={count > 1 ? `${work.title}, foto ${view.slide + 1} de ${count}` : work.title}
              sizes="100vw"
              fit="contain"
              controls
            />
          </motion.div>
        </AnimatePresence>
        {count > 1 && (
          <>
            <Arrow side="prev" onClick={() => step(-1)} />
            <Arrow side="next" onClick={() => step(1)} />
          </>
        )}
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-x-6 gap-y-4 px-5 py-4 font-tech text-[11px] md:px-10 md:py-6">
        <button type="button" onClick={() => stepWork(-1)} className="text-steel transition-colors hover:text-bone">
          Trabalho anterior
        </button>
        {count > 1 && (
          <div className="order-first flex w-full justify-center gap-2 md:order-none md:w-auto">
            {work.slides.map((slide, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setDir(i > view.slide ? 1 : -1);
                  setView({ work: view.work, slide: i });
                }}
                aria-label={`Foto ${i + 1}`}
                aria-current={i === view.slide}
                className={`relative h-14 w-11 overflow-hidden border transition-opacity duration-300 ${i === view.slide ? "border-bone opacity-100" : "border-transparent opacity-45 hover:opacity-100"}`}
              >
                <Media slide={slide} alt="" sizes="44px" />
              </button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-6">
          {work.link && (
            <a href={work.link} target="_blank" rel="noreferrer" className="underline underline-offset-4">
              Ver no Instagram
            </a>
          )}
          <button type="button" onClick={() => stepWork(1)} className="text-steel transition-colors hover:text-bone">
            Próximo trabalho
          </button>
        </div>
      </footer>
    </motion.div>
  );
}
