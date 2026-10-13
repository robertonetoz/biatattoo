// Conteúdo editável do site: links, estilos, destaques e textos curtos.

export const site = {
  name: "Bia Tattoo",
  handle: "bia_tattoo0",
  kana: "ビア",
  base: "Uberlândia, MG",
  guest: "São Paulo, SP",
  instagram: "https://www.instagram.com/bia_tattoo0/",
  threads: "https://www.threads.net/@bia_tattoo0",
  whatsapp: "https://wa.me/message/OO2L3A3LI4TBI1",
};

export type StyleSlug = "blackwork" | "linhas-finas" | "manga" | "sigilism" | "army";

export type Style = {
  slug: StyleSlug;
  name: string;
  text: string;
  seed: number;
  variant: "hollow" | "line" | "fill" | "tone";
  note?: string;
};

export const styles: Style[] = [
  {
    slug: "blackwork",
    name: "Blackwork",
    text: "Preto sólido, contraste alto e composições grandes que fecham braço, costas e peito.",
    seed: 3,
    variant: "fill",
  },
  {
    slug: "linhas-finas",
    name: "Linhas finas",
    text: "Traço delicado para escritas, florais e peças pequenas, com respiro na pele.",
    seed: 8,
    variant: "line",
  },
  {
    slug: "manga",
    name: "Mangá",
    text: "Painéis, retículas e personagens de anime e mangá reinterpretados em preto e cinza.",
    seed: 1,
    variant: "tone",
  },
  {
    slug: "sigilism",
    name: "Sigilism",
    text: "Formas afiadas e simétricas que seguem a anatomia, entre o tribal e o futurista.",
    seed: 9,
    variant: "hollow",
  },
  {
    slug: "army",
    name: "Army",
    text: "Projetos para armys: letras, datas e símbolos do BTS redesenhados no traço da Bia.",
    seed: 2,
    variant: "line",
    note: "보라해",
  },
];

export const styleName = (slug: string) =>
  styles.find((s) => s.slug === slug)?.name ?? slug;

export const highlights = [
  { name: "Cicatrizados", href: "https://www.instagram.com/stories/highlights/18023298980599005/", seed: 101 },
  { name: "BTS", href: "https://www.instagram.com/stories/highlights/18071982877474242/", seed: 102 },
  { name: "Disponível", href: "https://www.instagram.com/stories/highlights/18298249786181323/", seed: 109 },
  { name: "Estilos", href: "https://www.instagram.com/stories/highlights/18095791679159346/", seed: 104 },
  { name: "Estruture", href: "https://www.instagram.com/stories/highlights/17903813451380010/", seed: 115 },
];

export const steps = [
  {
    title: "Mande a ideia",
    text: "Conte o que você quer tatuar, o local do corpo, o tamanho aproximado e envie suas referências.",
  },
  {
    title: "Receba o orçamento",
    text: "A Bia responde com o valor e as datas disponíveis em Uberlândia ou em São Paulo.",
  },
  {
    title: "Desenho e sessão",
    text: "O desenho é criado para você e posicionado no corpo antes de a agulha encostar.",
  },
  {
    title: "Cicatrização",
    text: "Você sai com as orientações de cuidado e manda a foto da peça curada.",
  },
];
