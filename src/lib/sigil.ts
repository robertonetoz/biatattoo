// Gerador procedural de sigilos (cyber sigilism) em forma de asa: uma espinha
// central, dois braços arqueados e garras longas penduradas neles, tudo
// espelhado em torno do eixo vertical. Determinístico a partir de uma seed.

export type Pt = readonly [number, number];

export type Sigil = {
  /** ossos ocos: desenhados só pelo contorno, fundidos onde se cruzam */
  bones: string[];
  /** preenchimentos sólidos: membranas nas juntas e espinhos */
  accents: string[];
  /** fios finos que prolongam as pontas */
  hairlines: string[];
};

export type SigilOptions = {
  /** garras por asa */
  talons?: number;
  /** alcance horizontal de cada asa */
  span?: number;
  /** multiplicador de espessura dos ossos */
  weight?: number;
  /** segundo par de asas, menor, mais abaixo */
  lower?: boolean;
};

const SIZE = 1000;
const CX = SIZE / 2;

const n = (v: number) => Math.round(v * 10) / 10;
const p = (pt: Pt) => `${n(pt[0])} ${n(pt[1])}`;
const mirror = (pt: Pt): Pt => [SIZE - pt[0], pt[1]];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mix = (a: Pt, b: Pt, t: number): Pt => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];

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

/** Lente vertical sobre o eixo; `peak` diz onde ela é mais larga. */
function lens(top: number, bottom: number, half: number, peak = 0.4): string {
  const y = lerp(top, bottom, peak);
  return `M${CX} ${n(top)}Q${n(CX + half * 2)} ${n(y)} ${CX} ${n(bottom)}Q${n(CX - half * 2)} ${n(y)} ${CX} ${n(top)}Z`;
}

export function makeSigil(seed: number, options: SigilOptions = {}): Sigil {
  const rand = rng(seed);
  const between = (lo: number, hi: number) => lerp(lo, hi, rand());
  const weight = options.weight ?? 1;
  // os sorteios acontecem sempre, para a mesma seed dar o mesmo desenho com ou sem opções
  const spanRoll = between(440, 475);
  const talonRoll = Math.round(between(3, 4));
  const span = options.span ?? spanRoll;
  const talons = options.talons ?? talonRoll;

  const bones: string[] = [];
  const accents: string[] = [];
  const hairlines: string[] = [];

  const pair = (list: string[], a: Pt, b: Pt, bend: number, width: number, twist = 0.82) => {
    list.push(blade(a, b, bend, width, twist));
    list.push(blade(mirror(a), mirror(b), -bend, width, twist));
  };
  const pairPath = (list: string[], make: (flip: (pt: Pt) => Pt) => string) => {
    list.push(make((pt) => pt));
    list.push(make(mirror));
  };

  const hubY = between(300, 340);

  // espinha: uma adaga longa com vértebras empilhadas abaixo do centro
  const top = hubY - between(170, 230);
  const bottom = hubY + between(520, 590);
  bones.push(lens(top, bottom, between(9, 13) * weight, 0.3));
  let vy = hubY - between(20, 40);
  const vertebrae = Math.round(between(2, 3));
  for (let v = 0; v < vertebrae; v++) {
    const h = between(90, 130) * (1 - v * 0.14);
    bones.push(lens(vy, vy + h, between(15, 21) * weight * (1 - v * 0.2), 0.38));
    vy += h * between(0.7, 0.82);
  }
  hairlines.push(`M${CX} ${n(bottom)}L${CX} ${n(bottom + between(30, 60))}`);

  // asa: braço arqueado para cima que desce até uma ponta, com garras penduradas
  const wing = (origin: Pt, tip: Pt, count: number, reach: number) => {
    const armBend = -between(0.13, 0.21);
    const armTwist = between(0.2, 0.7);
    pair(bones, origin, tip, armBend, between(0.11, 0.14) * weight, armTwist);
    const onArm = (t: number) => along(origin, tip, armBend, armTwist, t);

    for (let i = 0; i < count; i++) {
      const t = lerp(0.2, 0.76, count === 1 ? 0.5 : i / (count - 1)) + between(-0.025, 0.025);
      const base = onArm(t);
      const len = reach * (1.12 - 0.62 * t) * between(0.94, 1.06);
      // a ponta desce e volta para o centro, como uma garra
      const end: Pt = [base[0] - len * between(0, 0.16), base[1] + len];
      const bend = -between(0.2, 0.32);
      const twist = between(0.25, 0.9);
      pair(bones, base, end, bend, between(0.15, 0.2) * weight, twist);

      // membrana preta na junta, do lado de dentro
      const onTalon = along(base, end, bend, twist, between(0.3, 0.42));
      const back = onArm(Math.max(0.02, t - between(0.13, 0.19)));
      const inner = mix(mix(onTalon, back, 0.5), base, 0.25);
      pairPath(accents, (f) => `M${p(f(onTalon))}Q${p(f(base))} ${p(f(back))}Q${p(f(inner))} ${p(f(onTalon))}Z`);
    }

    // espinhos curtos no dorso do braço
    const barbs = Math.round(between(1, 2));
    for (let k = 0; k < barbs; k++) {
      const b = onArm(between(0.22, 0.7));
      const end: Pt = [b[0] + between(-10, 46), b[1] - between(60, 110)];
      pair(accents, b, end, between(-0.2, 0.2), 0.3);
    }

    // fio fino prolongando a ponta da asa
    const far: Pt = [tip[0] + between(-30, 14), tip[1] + between(50, 110)];
    const ctrl: Pt = [tip[0] + between(10, 26), tip[1] + between(20, 50)];
    pairPath(hairlines, (f) => `M${p(f(tip))}Q${p(f(ctrl))} ${p(f(far))}`);
  };

  const droop = span * between(0.26, 0.42);
  wing([CX, hubY], [CX + span, hubY + droop], talons, between(400, 470));

  if (options.lower) {
    const y = hubY + between(230, 280);
    wing([CX, y], [CX + span * between(0.42, 0.55), y + droop * between(0.5, 0.8)], 2, between(130, 170));
  }

  // chifres: sobem do centro e fecham em lira
  const hornTip: Pt = [CX + between(55, 105), hubY - between(140, 200)];
  pair(bones, [CX, hubY - 6], hornTip, between(0.28, 0.42), 0.17 * weight, between(0.2, 0.7));

  // pinças: abraçam a cauda da espinha
  const my = hubY + between(260, 320);
  const pincer: Pt = [CX + between(24, 58), my + between(170, 230)];
  pair(bones, [CX, my], pincer, -between(0.3, 0.46), 0.18 * weight, between(0.3, 0.8));

  return { bones, accents, hairlines };
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
