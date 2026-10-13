import fs from "node:fs";
import path from "node:path";
import { styles, type StyleSlug } from "./site";

export type Slide =
  | { type: "image"; src: string }
  | { type: "video"; src: string }
  | { type: "placeholder"; seed: number };

export type Work = {
  slug: string;
  title: string;
  style: StyleSlug;
  slides: Slide[];
  link?: string;
};

const ROOT = path.join(process.cwd(), "public", "trabalhos");
const IMAGE = /\.(jpe?g|png|webp|avif|gif)$/i;
const VIDEO = /\.(mp4|webm|mov)$/i;
const natural = new Intl.Collator("pt-BR", { numeric: true, sensitivity: "base" });

const isStyle = (value: unknown): value is StyleSlug =>
  styles.some((s) => s.slug === value);

function titleFromFolder(folder: string) {
  const clean = folder.replace(/^\d+[-_ ]*/, "").replace(/[-_]+/g, " ").trim();
  return clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : folder;
}

function guessStyle(folder: string): StyleSlug {
  const name = folder.toLowerCase();
  return styles.find((s) => name.includes(s.slug) || name.includes(s.slug.replace("-", " ")))?.slug ?? "blackwork";
}

// Cada pasta em public/trabalhos é um trabalho; os arquivos dentro dela são
// os slides do carrossel, em ordem alfabética/numérica.
function readFolders(): Work[] {
  if (!fs.existsSync(ROOT)) return [];
  const folders = fs
    .readdirSync(ROOT, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort(natural.compare);

  const works: Work[] = [];
  for (const folder of folders) {
    const files = fs.readdirSync(path.join(ROOT, folder)).sort(natural.compare);
    const slides: Slide[] = [];
    for (const file of files) {
      const src = `/trabalhos/${encodeURIComponent(folder)}/${encodeURIComponent(file)}`;
      if (IMAGE.test(file)) slides.push({ type: "image", src });
      else if (VIDEO.test(file)) slides.push({ type: "video", src });
    }
    if (slides.length === 0) continue;

    let info: { titulo?: string; estilo?: string; instagram?: string } = {};
    const infoPath = path.join(ROOT, folder, "info.json");
    if (fs.existsSync(infoPath)) {
      try {
        info = JSON.parse(fs.readFileSync(infoPath, "utf-8"));
      } catch {
        // info.json inválido: segue com o nome da pasta
      }
    }

    works.push({
      slug: folder,
      title: info.titulo ?? titleFromFolder(folder),
      style: isStyle(info.estilo) ? info.estilo : guessStyle(folder),
      slides,
      link: info.instagram,
    });
  }
  return works;
}

const DEMO: Array<[string, StyleSlug, number]> = [
  ["Fechamento de braço", "blackwork", 3],
  ["Costas em sigilo", "sigilism", 4],
  ["Painel de mangá", "manga", 2],
  ["Escrita no pulso", "linhas-finas", 1],
  ["Projeto army", "army", 3],
  ["Ombro e clavícula", "sigilism", 2],
  ["Floral em linha", "linhas-finas", 3],
  ["Sagrado coração", "blackwork", 2],
  ["Personagem no antebraço", "manga", 4],
  ["Sigilo na perna", "sigilism", 1],
  ["Retrato pontilhado", "blackwork", 2],
  ["Data e letra", "army", 1],
];

function demoWorks(): Work[] {
  return DEMO.map(([title, style, count], i) => ({
    slug: `exemplo-${i + 1}`,
    title,
    style,
    slides: Array.from({ length: count }, (_, k) => ({
      type: "placeholder" as const,
      seed: 200 + i * 17 + k * 5,
    })),
  }));
}

export function getWorks(): { works: Work[]; demo: boolean } {
  const works = readFolders();
  if (works.length > 0) return { works, demo: false };
  return { works: demoWorks(), demo: true };
}
