import type { Metadata, Viewport } from "next";
import { Grenze_Gotisch, Hanken_Grotesk, Michroma } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { Providers } from "@/components/Providers";

const michroma = Michroma({
  variable: "--font-michroma",
  weight: "400",
  subsets: ["latin"],
});

const grenze = Grenze_Gotisch({
  variable: "--font-grenze",
  subsets: ["latin"],
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bia Tattoo | Blackwork, linhas finas, mangá e sigilism",
  description:
    "Tatuagem autoral da Bia em Uberlândia (MG) e São Paulo: blackwork, linhas finas, mangá, sigilism e projetos para armys. Veja os trabalhos e peça seu orçamento.",
  openGraph: {
    title: "Bia Tattoo",
    description: "Blackwork, linhas finas, mangá e sigilism. Uberlândia, MG ~ São Paulo, SP.",
    locale: "pt_BR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#ecedee",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${michroma.variable} ${grenze.variable} ${hanken.variable} antialiased`}
    >
      <body className="overflow-x-clip">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
