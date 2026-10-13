import { Contact } from "@/components/Contact";
import { Cursor } from "@/components/Cursor";
import { Gallery } from "@/components/Gallery";
import { Hero } from "@/components/Hero";
import { Highlights } from "@/components/Highlights";
import { Marquee } from "@/components/Marquee";
import { Nav } from "@/components/Nav";
import { Process } from "@/components/Process";
import { ScrollNeedle } from "@/components/ScrollNeedle";
import { Statement } from "@/components/Statement";
import { StylesSection } from "@/components/StylesSection";
import { getWorks } from "@/lib/works";

export default function Home() {
  const { works, demo } = getWorks();

  return (
    <>
      <Nav />
      <ScrollNeedle />
      <Cursor />
      <main>
        <Hero />
        <Statement />
        <StylesSection />
        <Marquee />
        <Gallery works={works} demo={demo} />
        <Highlights />
        <Process />
        <Contact />
      </main>
    </>
  );
}
