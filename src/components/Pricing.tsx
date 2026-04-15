"use client";
import { useLocale } from 'next-intl';
import { Check } from "lucide-react";
import Link from "next/link";
import { T } from "@/components/T";

export function Pricing() {
  const locale = useLocale();
  const features = [
    "Itinerario 100% personalizado",
    "Precio ajustado a tu presupuesto",
    "Asesoría de expertos en destinos",
    "Atención dedicada ",
    "Sin cargos ocultos - IVA incluido",
  ];

  return (
    <section id="precios" className="py-24 lg:py-32 bg-background overflow-hidden border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Split Layout */}
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left - Content */}
          <div className="order-2 lg:order-1">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-[1px] bg-foreground/30"></span>
              <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground">
                <T>Servicio Personalizado</T>
              </p>
            </div>
            
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[0.95] mb-8 text-foreground">
              <span className="block"><T>Trazamos tu</T></span>
              <span className="block italic text-primary"><T>ruta ideal</T></span>
            </h2>

            <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-md leading-relaxed font-sans">
              <T>
                Entendemos que cada viajero tiene su propia visión. Por ello, moldeamos viajes exclusivos que se alinean a tus preferencias, agenda y estilo. Nuestros especialistas diseñarán un itinerario que solo te pertenezca a ti.
              </T>
            </p>

            {/* Features List */}
            <div className="space-y-5 mb-12">
              {features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-5">
                  <div className="w-6 h-6 border border-foreground/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm text-foreground font-medium tracking-wide">
                    <T>{feature}</T>
                  </span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <Link
                href={`/${locale}/cotizar`}
                className="group inline-flex items-center justify-center gap-4 bg-foreground text-background px-10 py-5 hover:bg-primary transition-colors duration-300 w-full sm:w-auto"
              >
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">
                  <T>Cotizar ahora</T>
                </span>
              </Link>
              <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground text-center sm:text-left">
                <T>Respuesta en menos de 24 horas</T>
              </p>
            </div>
          </div>

          {/* Right - Image Collage (Polaroid Style) */}
          <div className="relative order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-6 lg:gap-8">
              {/* Columna Izquierda */}
              <div className="space-y-6 lg:space-y-8 mt-8">
                {/* Polaroid 1 */}
                <div className="bg-white p-2 pb-10 lg:p-3 lg:pb-14 shadow-2xl border border-black/5 -rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1552083375-1447ce886485?w=600" alt="Cenote" className="w-full h-full object-cover" />
                  </div>
                </div>
                {/* Polaroid 2 */}
                <div className="bg-white p-2 pb-10 lg:p-3 lg:pb-14 shadow-2xl border border-black/5 rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-square overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400" alt="Cultura" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              
              {/* Columna Derecha */}
              <div className="space-y-6 lg:space-y-8 pt-16 lg:pt-24">
                {/* Polaroid 3 */}
                <div className="bg-white p-2 pb-10 lg:p-3 lg:pb-14 shadow-2xl border border-black/5 rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-square overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=400" alt="Chichen Itza" className="w-full h-full object-cover" />
                  </div>
                </div>
                {/* Polaroid 4 */}
                <div className="bg-white p-2 pb-10 lg:p-3 lg:pb-14 shadow-2xl border border-black/5 -rotate-1 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600" alt="Gastronomia" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Quote */}
            <div className="absolute -bottom-6 -left-6 lg:-bottom-12 lg:-left-12 bg-background border border-border p-6 lg:p-8 max-w-[260px] shadow-xl z-10 hidden sm:block">
              <p className="font-serif italic text-lg lg:text-xl mb-3 text-foreground">
                Una experiencia inolvidable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}