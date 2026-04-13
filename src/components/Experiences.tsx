"use client";
import { useLocale } from 'next-intl';
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/T";

const experiences = [
  {
    id: 1,
    title: "Santuarios Naturales",
    description: "Camina entre bosques milenarios donde el tiempo parece detenerse.",
    tag: "01",
    slug: "naturaleza",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
  },
  {
    id: 2,
    title: "Aventura Marina",
    description: "Domina la energía del mar y conecta con el Pacífico.",
    tag: "02",
    slug: "aventura",
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800",
  },
  {
    id: 3,
    title: "Tradiciones Vivas",
    description: "Adéntrate en el corazón de la cultura local y sus mitos.",
    tag: "03",
    slug: "cultura",
    image: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800",
  },
  {
    id: 4,
    title: "Rutas Gastronómicas",
    description: "Descubre los sabores auténticos de México guiado por expertos.",
    tag: "04",
    slug: "gastronomia",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800",
  },
];

export function Experiences() {
  const locale = useLocale();
  return (
    <section id="experiencias" className="py-24 lg:py-32 bg-background">
      {/* Section Header - Editorial Style */}
      <div className="container mx-auto px-6 lg:px-12 mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-[1px] bg-foreground/30"></span>
              <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground">
                <T>Nuestras Experiencias</T>
              </p>
            </div>
            <h2 className="text-5xl md:text-6xl font-serif leading-[0.95] text-foreground">
              <span className="block"><T>Vive el México que</T></span>
              <span className="block italic text-primary"><T>siempre soñaste</T></span>
            </h2>
          </div>

          <Link
            href={`/${locale}/experiencias`}
            className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-medium hover:text-primary transition-colors text-foreground"
          >
            <T>Ver todas</T>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Horizontal Scroll Gallery */}
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto pb-8 px-6 lg:px-12 no-scrollbar cursor-grab active:cursor-grabbing">
          {experiences.map((exp) => (
            <Link
              key={exp.id}
              href={`/${locale}/experiencias?categoria=${exp.slug}`}
              className="group flex-shrink-0 w-[85vw] md:w-[45vw] lg:w-[30vw] relative"
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-muted">
                <img
                  src={exp.image}
                  alt={exp.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Overlay oscuro para legibilidad */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Number Tag */}
                <div className="absolute top-6 left-6">
                  <span className="text-7xl font-serif text-white/20 font-light">
                    {exp.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/70 mb-2">
                    <T>{exp.slug}</T>
                  </p>
                  <div className="flex items-end justify-between">
                    <div className="pr-4">
                      <h3 className="text-2xl lg:text-3xl font-serif text-white mb-2">
                        <T>{exp.title}</T>
                      </h3>
                      <p className="text-sm text-white/60 line-clamp-2"><T>{exp.description}</T></p>
                    </div>
                    <ArrowUpRight className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 mt-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-border">
          {[
            { number: "01", title: "Guías Certificados", desc: "Expertos locales" },
            { number: "02", title: "100% Seguro", desc: "Viajes protegidos" },
            { number: "03", title: "Reserva Fácil", desc: "En línea" },
            { number: "04", title: "Experiencias Únicas", desc: "Personalizadas" },
          ].map((feature, idx) => (
            <div key={idx} className="group">
              <span className="text-xs font-serif italic text-muted-foreground">{feature.number}</span>
              <h4 className="text-xs uppercase tracking-[0.1em] font-semibold mt-3 mb-1 text-foreground">
                <T>{feature.title}</T>
              </h4>
              <p className="text-sm text-muted-foreground">
                <T>{feature.desc}</T>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}