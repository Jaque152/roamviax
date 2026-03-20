// src/components/Hero.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin, Compass } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary/30 to-background" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="space-y-8 animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
              <Compass className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Experiencias Auténticas</span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold leading-tight">
              Descubre el <span className="relative text-primary">México</span><br />que siempre soñaste
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
              Diseñamos experiencias personalizadas donde tú eres el protagonista.
              Desde santuarios naturales hasta tradiciones ancestrales.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="rounded-full px-8 group bg-primary">
                <Link href="#experiencias">
                  Ver Experiencias
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-3xl overflow-hidden relative group shadow-2xl">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=600')] bg-cover bg-center transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm font-medium">Chichén Itzá</span>
                  </div>
                </div>
                {/* Logo dinámico en el grid */}
                <div className="bg-white/50 backdrop-blur-sm rounded-3xl aspect-[1.2] flex items-center justify-center p-10 group border border-white/20">
                  <img 
                    src="/logo 2.png" 
                    alt="Logo" 
                    className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity" 
                  />
                </div>
              </div>

              <div className="space-y-4 pt-12">
                <div className="aspect-square rounded-3xl overflow-hidden relative shadow-2xl">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1570737209810-87a8e7245f88?w=600')] bg-cover bg-center" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white text-sm font-medium">Oaxaca de Juárez</div>
                </div>
                <div className="aspect-[3/4] rounded-3xl overflow-hidden relative shadow-2xl">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512813195386-6cf811ad3542?w=600')] bg-cover bg-center" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white text-sm font-medium">Riviera Maya</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}