import { Contact } from "@/components/Contact";
import { IntroScreen } from "@/components/IntroScreen";
import { Gallery } from "@/components/gallery/Gallery";
import { GalleryIntro } from "@/components/gallery/GalleryIntro";
import { ScrollHero } from "@/components/hero/ScrollHero";

export default function Home() {
  return (
    <>
      <IntroScreen />
      <ScrollHero />
      <GalleryIntro />
      <Gallery />
      <Contact />
    </>
  );
}
