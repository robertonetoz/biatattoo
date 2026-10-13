// Gerador procedural de sigilos (cyber sigilism): lâminas afiadas espelhadas
// em torno de um eixo vertical. Tudo é determinístico a partir de uma seed.

export type Pt = readonly [number, number];

export type Star = { x: number; y: number; r: number };

export type Sigil = {
  blades: string[];
  hairlines: string[];
  stars: Star[];
};

export type SigilOptions = {
  tiers?: number;
  /** espessura das lâminas, em fração do comprimento */
  weight?: number;
  /** alcance horizontal das lâminas principais */
  spread?: number;
  hooks?: number;
};

const SIZE = 1000;
const CX = SIZE / 2;

const n = (v: number) => Math.round(v * 10) / 10;
const p = (pt: Pt) => `${n(pt[0])} ${n(pt[1])}`;
const mirror = (pt: Pt): Pt => [SIZE - pt[0], pt[1]];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function rng(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function frame(a: Pt, b: Pt) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const at = (t: number, off: number): Pt => [
    a[0] + dx * t + nx * off * len,
    a[1] + dy * t + ny * off * len,
  ];
  return { at, len, dx, dy };
}

/** Lâmina: afiada nas duas pontas, mais grossa perto da base, ponta em chicote. */
export function blade(a: Pt, b: Pt, bend = 0.2, width = 0.08, twist = 0.82): string {
  const { at } = frame(a, b);
  const o1 = at(0.28, bend + width * 0.5);
  const o2 = at(0.74, bend * twist + width * 0.1);
  const i2 = at(0.74, bend * twist - width * 0.1);
  const i1 = at(0.28, bend - width * 0.5);
  return `M${p(a)}C${p(o1)} ${p(o2)} ${p(b)}C${p(i2)} ${p(i1)} ${p(a)}Z`;
}

/** Ponto na linha central da lâmina. */
function along(a: Pt, b: Pt, bend: number, twist: number, t: number): Pt {
  const { at } = frame(a, b);
  const c1 = at(0.28, bend);
  const c2 = at(0.74, bend * twist);
  const u = 1 - t;
  const k0 = u * u * u;
  const k1 = 3 * u * u * t;
  const k2 = 3 * u * t * t;
  const k3 = t * t * t;
  return [
    k0 * a[0] + k1 * c1[0] + k2 * c2[0] + k3 * b[0],
    k0 * a[1] + k1 * c1[1] + k2 * c2[1] + k3 * b[1],
  ];
}

export function starPath({ x, y, r }: Star): string {
  const q = `${n(x)} ${n(y)}`;
  return `M${n(x)} ${n(y - r)}Q${q} ${n(x + r * 0.62)} ${n(y)}Q${q} ${n(x)} ${n(y + r)}Q${q} ${n(x - r * 0.62)} ${n(y)}Q${q} ${n(x)} ${n(y - r)}Z`;
}

export function makeSigil(seed: number, options: SigilOptions = {}): Sigil {
  const rand = rng(seed);
  const between = (lo: number, hi: number) => lerp(lo, hi, rand());
  const tiers = options.tiers ?? 5;
  const weight = options.weight ?? 0.13;
  const spread = options.spread ?? 400;
  const hooks = options.hooks ?? 2;

  const blades: string[] = [];
  const hairlines: string[] = [];
  const stars: Star[] = [];

  const pair = (a: Pt, b: Pt, bend: number, width: number, twist = 0.82) => {
    blades.push(blade(a, b, bend, width, twist));
    blades.push(blade(mirror(a), mirror(b), -bend, width, twist));
  };

  // espinha central
  const top = between(40, 90);
  const bottom = between(910, 960);
  const spineW = between(7, 12) * (weight / 0.13);
  blades.push(
    `M${CX} ${n(top)}Q${n(CX + spineW)} ${n(lerp(top, bottom, 0.42))} ${CX} ${n(bottom)}Q${n(CX - spineW)} ${n(lerp(top, bottom, 0.42))} ${CX} ${n(top)}Z`,
  );

  for (let i = 0; i < tiers; i++) {
    const u = tiers === 1 ? 0.5 : i / (tiers - 1);
    const y = lerp(230, 800, u) + between(-22, 22);
    const origin: Pt = [CX, y];
    const up = u < 0.5;
    // ângulo a partir da horizontal: negativo sobe, positivo desce
    const angle = ((lerp(-66, 66, u) + between(-10, 10)) * Math.PI) / 180;
    const reach = spread * (0.5 + 0.5 * Math.sin(Math.PI * (u * 0.8 + 0.12))) * between(0.82, 1.12);
    const tip: Pt = [CX + Math.cos(angle) * reach, y + Math.sin(angle) * reach];
    const bend = (up ? 1 : -1) * between(0.1, 0.24);
    // twist negativo dobra a ponta para o outro lado (curva em S)
    const twist = between(-0.9, 0.9);
    pair(origin, tip, bend, weight * between(0.8, 1.25), twist);

    // leque: lâminas menores saindo do mesmo ponto, como uma garra
    const fan = rand() > 0.45 ? Math.round(between(1, 2)) : 0;
    const fanDir = up ? -1 : 1;
    for (let k = 1; k <= fan; k++) {
      const a = angle + (fanDir * k * between(15, 26) * Math.PI) / 180;
      const r = reach * (1 - k * between(0.2, 0.3));
      const end: Pt = [CX + Math.cos(a) * r, y + Math.sin(a) * r];
      pair(origin, end, bend * between(0.7, 1.3), weight * between(1, 1.5), between(-0.6, 0.9));
    }

    // espinhos que nascem do lado convexo da lâmina
    const count = Math.round(between(Math.max(0, hooks - 1), hooks));
    for (let h = 0; h < count; h++) {
      const t = between(0.36, 0.78);
      const base = along(origin, tip, bend, twist, t);
      const side = rand() > 0.3 ? 1 : -1;
      const turn = (side * (up ? 1 : -1) * between(40, 120) * Math.PI) / 180;
      const dir = angle + turn;
      const hookLen = reach * between(0.16, 0.36);
      const end: Pt = [base[0] + Math.cos(dir) * hookLen, base[1] + Math.sin(dir) * hookLen];
      pair(base, end, -bend * between(0.4, 1), weight * between(1.7, 2.4), between(-0.4, 0.8));
    }

    // fio fino que prolonga a ponta
    if (rand() > 0.45) {
      const curl = angle + (up ? -1 : 1) * between(0.5, 1.1);
      const far = reach * between(0.22, 0.4);
      const end: Pt = [tip[0] + Math.cos(curl) * far, tip[1] + Math.sin(curl) * far];
      const ctrl: Pt = [
        tip[0] + Math.cos(angle) * far * 0.7,
        tip[1] + Math.sin(angle) * far * 0.7,
      ];
      hairlines.push(`M${p(tip)}Q${p(ctrl)} ${p(end)}`);
      hairlines.push(`M${p(mirror(tip))}Q${p(mirror(ctrl))} ${p(mirror(end))}`);
      if (rand() > 0.5) {
        const r = between(9, 20);
        stars.push({ x: end[0], y: end[1], r }, { x: SIZE - end[0], y: end[1], r });
      }
    }
  }

  // coroa e cauda: pequenas lâminas coladas à espinha
  const crownY = top + between(60, 110);
  pair([CX, crownY], [CX + between(40, 80), top + between(-10, 30)], between(0.2, 0.4), weight * 1.6);
  const tailY = bottom - between(70, 120);
  pair([CX, tailY], [CX + between(36, 70), bottom - between(-6, 26)], -between(0.2, 0.4), weight * 1.6);

  stars.push({ x: CX, y: lerp(top, bottom, 0.5) + between(-30, 30), r: between(16, 26) });

  return { blades, hairlines, stars };
}

/** Faixa de espinhos para a borda entre uma seção clara e uma escura. */
export function thornRow(seed: number, width = 1440, height = 140): string[] {
  const rand = rng(seed);
  const between = (lo: number, hi: number) => lerp(lo, hi, rand());
  const out: string[] = [];
  const half = width / 2;
  const count = 15;
  for (let i = 0; i < count; i++) {
    const u = (i + between(0.15, 0.85)) / count;
    const x = u * half;
    // mais altos perto do centro
    const h = height * (0.22 + 0.78 * Math.pow(u, 1.6)) * between(0.55, 1);
    const lean = between(-0.5, 0.2) * h;
    const base = between(14, 34);
    const bend = between(0.1, 0.3) * (rand() > 0.5 ? 1 : -1);
    const make = (sx: (v: number) => number, flip: number) => {
      const a: Pt = [sx(x), height + 2];
      const b: Pt = [sx(x + lean), height - h];
      return blade(a, b, bend * flip, base / Math.max(h, 1));
    };
    out.push(make((v) => v, 1));
    out.push(make((v) => width - v, -1));
  }
  return out;
}
