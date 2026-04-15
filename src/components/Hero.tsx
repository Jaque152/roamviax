"use client";
import { T } from "@/components/T";
import Link from "next/link";
import { useLocale } from 'next-intl';
import { ArrowDownRight, ArrowRight } from "lucide-react";

export function Hero() {
  const locale = useLocale();
  
  return (
    <section className="relative min-h-[90vh] flex flex-col bg-background">
      {/* Main Content - Split Layout */}
      <div className="flex-1 grid lg:grid-cols-2">
        
        {/* Left - Text Content */}
        <div className="flex flex-col justify-center px-6 lg:px-12 xl:px-20 py-24 lg:py-0 order-2 lg:order-1 relative z-10 bg-background animate-fade-up">
          <div className="max-w-xl">

            {/* Main Title - Typography Editorial */}
            <h1 className="text-6xl md:text-7xl lg:text-[5.5rem] font-serif mb-8 leading-[0.95] text-foreground tracking-tight">
              <span className="block"><T>Explora el</T></span>
              <span className="block italic text-primary"><T>México</T></span>
              <span className="block"><T>más autentico</T></span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-md leading-relaxed font-sans">
              <T>Diseñamos itinerarios a la medida donde tú dictas el ritmo. Desde retiros intocados por el tiempo hasta el corazón vibrante de nuestras tradiciones.</T>
            </p>

            {/* CTA - Editorial Buttons */}
            <div className="flex flex-wrap items-center gap-8">
              <Link
                href={`/${locale}/experiencias`}
                className="group inline-flex items-center gap-4 bg-foreground text-background px-8 py-4 hover:bg-primary transition-all duration-300"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">
                  <T>Ver experiencias</T>
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href={`/${locale}/#contacto`}
                className="text-[10px] uppercase tracking-[0.2em] font-medium text-foreground underline underline-offset-8 hover:text-primary transition-colors"
              >
                <T>Contactar</T>
              </Link>
            </div>
          </div>
        </div>

        {/* Right - Image with Editorial Fade */}
        <div className="relative h-[55vh] lg:h-auto order-1 lg:order-2">
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('https://lugares.inah.gob.mx/sites/default/files/zonas/185_A_slider_chichen_itza_3.jpg')" }}
          />
          
          {/* EL DIFUMINADO EDITORIAL: 
              Este gradiente funde el fondo claro de la izquierda con la imagen. 
              Al usar "to-transparent", evitamos la mancha blanca en el centro de la foto. */}
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent w-full md:w-3/4 opacity-100" />

          {/* Gradiente sutil inferior para asegurar la lectura de la etiqueta */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />

          {/* Floating Label */}
          <div className="absolute bottom-8 right-8 bg-background/95 backdrop-blur-md px-6 py-4 border border-border">
            <p className="font-serif text-2xl italic text-foreground">Chichén Itzá</p>
          </div>

          {/* Scroll Indicator (Solo Desktop) */}
          <div className="absolute bottom-10 left-12 hidden lg:flex items-center gap-3 text-background">
            <ArrowDownRight className="w-6 h-6 animate-bounce drop-shadow-md" />
            <span className="text-[10px] uppercase tracking-[0.3em] font-medium drop-shadow-md">
              <T>Scroll</T>
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}