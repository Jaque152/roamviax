"use client";
import { T } from "@/components/T";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

interface LegalPageProps {
  title: string;
  sections: {
    heading: string;
    content: string;
  }[];
}

export function LegalPage({ title, sections }: LegalPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-32 pb-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-3xl">
          
          {/* Header Legal */}
          <div className="mb-16 pb-8 border-b border-border">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-[1px] bg-foreground/30"></span>
              <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground">
                <T>Información Legal</T>
              </p>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-[1.1]">
              <T>{title}</T>
            </h1>
          </div>

          {/* Contenido Legal */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div key={index} className="group">
                <h2 className="text-xl font-serif text-foreground mb-4">
                  <T>{section.heading}</T>
                </h2>
                <div className="text-muted-foreground font-sans leading-relaxed text-sm md:text-base text-justify">
                  <T>{section.content}</T>
                </div>
              </div>
            ))}
          </div>

          {/* Footer del Documento */}
          <div className="mt-20 pt-8 border-t border-border">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Roamviax — Viajes de lujo
            </p>
          </div>
          
        </div>
      </main>
      <Footer />
    </div>
  );
}