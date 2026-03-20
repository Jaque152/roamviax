import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Experiences } from "@/components/Experiences";
import { Pricing } from "@/components/Pricing";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Experiences />
      <Pricing />
      <Contact />
      <Footer />
    </main>
  );
}
