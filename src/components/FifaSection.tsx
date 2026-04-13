"use client";
import { useLocale } from 'next-intl';
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { FifaExp } from "@/lib/types";
import { T } from "@/components/T";

export function FifaSection() {
  const locale = useLocale();
  const [fifaExps, setFifaExps] = useState<FifaExp[]>([]);

  useEffect(() => {
    async function loadFifaData() {
      const { data } = await supabase
        .from("fifa_experiences")
        .select("*")
        .order("order_index", { ascending: true });
      if (data) setFifaExps(data);
    }
    loadFifaData();
  }, []);

  return (
    <section className="py-24 lg:py-32 bg-primary text-primary-foreground">
      {/* Header */}
      <div className="container mx-auto px-6 lg:px-12 mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
          <div>
            <div className="border border-primary-foreground/30 px-3 py-1 text-primary-foreground/70 text-[10px] uppercase tracking-widest mb-6 inline-block">
              FIFA 2026
            </div>
            <h2 className="text-5xl md:text-6xl font-serif leading-[0.95]">
              <span className="block text-primary-foreground/60"><T>¿Cómo participar en</T></span>
              <span className="block italic text-secondary"><T>la gran fiesta?</T></span>
            </h2>
          </div>

          <Link
            href={`/${locale}/cotizar`}
            className="group inline-flex items-center gap-4 bg-background text-foreground px-8 py-4 hover:bg-secondary hover:text-foreground transition-colors"
          >
            <span className="text-xs uppercase tracking-[0.15em] font-medium">
              <T>Organizar aventura</T>
            </span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Numbered List of Experiences */}
      <div className="container mx-auto px-6 lg:px-12">
        <div className="border-t border-primary-foreground/20">
          {fifaExps.map((exp, index) => (
            <div
              key={exp.id}
              className="group grid lg:grid-cols-12 gap-6 lg:gap-12 py-12 border-b border-primary-foreground/20 hover:bg-white/5 transition-colors px-4 -mx-4"
            >
              {/* Number */}
              <div className="lg:col-span-1">
                <span className="text-5xl font-serif text-primary-foreground/30">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* Title & Description */}
              <div className="lg:col-span-4">
                <p className="text-[10px] uppercase tracking-[0.2em] text-secondary mb-3">
                  <T>{exp.subtitle}</T>
                </p>
                <h3 className="text-2xl lg:text-3xl font-serif mb-4">
                  <T>{exp.title}</T>
                </h3>
                <p className="text-primary-foreground/70 text-sm leading-relaxed">
                  <T>{exp.description}</T>
                </p>
              </div>

              {/* Items */}
              <div className="lg:col-span-4 pt-2">
                <ul className="space-y-3">
                  {exp.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-primary-foreground/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-2 flex-shrink-0" />
                      <T>{item}</T>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image */}
              <div className="lg:col-span-3">
                <div className="aspect-[4/3] overflow-hidden bg-background/10">
                  <img
                    src={exp.image_url}
                    alt={exp.title}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-12 mt-16">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 py-8 border-t border-primary-foreground/20">
          <p className="text-primary-foreground/70 text-sm text-center md:text-left">
            <T>Todas nuestras experiencias son personalizadas. Cuéntanos tu presupuesto y nosotros organizamos una aventura a tu medida.</T>
          </p>
          <div className="flex flex-wrap justify-center items-center gap-4 text-[10px] uppercase tracking-[0.2em]">
            <span className="text-secondary"><T>Comodidad</T></span>
            <span className="w-1 h-1 rounded-full bg-primary-foreground/30" />
            <span className="text-secondary"><T>Diversión</T></span>
            <span className="w-1 h-1 rounded-full bg-primary-foreground/30" />
            <span className="text-secondary"><T>Organización Profesional</T></span>
          </div>
        </div>
      </div>
    </section>
  );
}