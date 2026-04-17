"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from '@/lib/supabase';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { Experience, ActivityPackage } from "@/lib/types"; 
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";
import {
  Check, Minus, Plus, Loader2, Info, AlertTriangle, X, MapPin, Clock, CalendarDays, Compass
} from "lucide-react";

function TranslatedOption({ value, label }: { value: number, label: string }) {
  const translatedText = useT(label);
  return (
    <option value={value} className="font-sans not-italic text-sm">
      {translatedText}
    </option>
  );
}

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [packages, setPackages] = useState<ActivityPackage[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState("");
  const [people, setPeople] = useState(1);
  const [selectedPackageId, setSelectedPackageId] = useState<number | "">("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function loadFullDetail() {
      if (!params.id) return;
      setLoading(true);
      try {
        const { data: activity } = await supabase
          .from('activities_roamviax')
          .select('*, categories(name, slug)')
          .eq('id', params.id)
          .single();

        const { data: paks } = await supabase
          .from('activity_packages')
          .select('*')
          .eq('activity_id', params.id)
          .order('id', { ascending: true });

        if (activity) {
          setExperience(activity);
        }
        
        if (paks && paks.length > 0) {
          setPackages(paks);
          setSelectedPackageId(paks[0].id);
        }
      } catch (error) {
        console.error("Error loadFullDetail:", error);
      } finally {
        setLoading(false);
      }
    }
    loadFullDetail();
  }, [params.id]);

  const selectedPackage = packages.find(p => p.id === selectedPackageId);
  
  const formatPrice = (price: number) => {
    const formatter = new Intl.NumberFormat("es-MX", {
      style: "currency", currency: "MXN", minimumFractionDigits: 0,
    });
    return `${formatter.format(price)} MXN`;
  };

  const handleAddToCart = () => {
    if (!experience || !selectedDate || !selectedPackage) return;
    setIsAdding(true);

    addToCart({
      packageId: selectedPackage.id,
      experience: experience,
      date: selectedDate,
      people: people,
      levelName: selectedPackage.package_name,
      pricePerPerson: Number(selectedPackage.price),
    });

    setTimeout(() => {
      setIsAdding(false);
      router.push("/carrito");
    }, 500);
  };

  const minDateStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-10 h-10 animate-spin text-foreground" />
    </div>
  );

  if (!experience) return null;

  const mainImage = experience.images?.length > 0 ? experience.images[0] : '/placeholder.jpg';

  // Widget Form Editorial
  const WidgetForm = () => (
    <div className="bg-background border border-border p-6 md:p-10 shadow-xl relative">
      <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
      
      <div className="mb-8">
        <h2 className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground mb-2">
          <T>Reserva tu lugar</T>
        </h2>
        <p className="font-serif italic text-2xl text-foreground">Planifica tu viaje</p>
      </div>
      
      <div className="space-y-8">
        {/* Selector de Paquete */}
        <div className="space-y-3">
          <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-foreground block">
            {packages.length > 1 ? <T>Elige una opción</T> : <T>Opción de servicio</T>}
          </label>
          {packages.length > 1 ? (
            <select 
              className="w-full h-12 bg-transparent border-0 border-b border-foreground/20 text-foreground font-serif italic text-lg focus:outline-none focus:ring-0 focus:border-primary transition-all cursor-pointer px-0"
              value={selectedPackageId}
              onChange={(e) => setSelectedPackageId(Number(e.target.value))}
            >
              {packages.map(pkg => (
                <TranslatedOption key={pkg.id} value={pkg.id} label={pkg.package_name} />
              ))}
            </select>

          ): (
            <div className="w-full h-12 flex items-center border-0 border-b border-foreground/20 bg-transparent px-0 text-foreground font-serif italic text-lg">
              <T>{packages[0]?.package_name || ""}</T>
            </div>
          )} 
        </div>

        {/* Detalles del Paquete */}
        {selectedPackage && (
          <div className="bg-muted/30 p-6 border border-border animate-fade-in">
            <div className="flex flex-col mb-6 pb-4 border-b border-border/50">
              <span className="font-serif text-xl text-foreground mb-2"><T>{selectedPackage.package_name}</T></span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-serif text-primary">{formatPrice(selectedPackage.price)}</span>
                <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-[0.2em]"><T>IVA inc.</T></span>
              </div>
            </div>
            
            {selectedPackage.features?.incluye && (
              <div className="mb-6">
                <p className="text-[9px] uppercase tracking-[0.2em] font-medium text-foreground mb-3"><T>Incluye</T></p>
                <ul className="space-y-3">
                  {selectedPackage.features.incluye.map((inc, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="w-4 h-4 text-primary shrink-0"/> <T>{inc}</T>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {selectedPackage.features?.no_incluye && (
              <div className="pt-6 border-t border-border/50">
                <p className="text-[9px] uppercase tracking-[0.2em] font-medium text-foreground mb-3"><T>No Incluye</T></p>
                <ul className="space-y-3">
                  {selectedPackage.features.no_incluye.map((noInc, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground/70">
                      <X className="w-4 h-4 text-destructive shrink-0"/> <T>{noInc}</T>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-6">
          {/* Fecha */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-foreground block"><T>Fecha</T></label>
            <Input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              min={minDateStr} 
              className="h-12 bg-transparent border-0 border-b border-foreground/20 rounded-none px-0 text-foreground focus-visible:ring-0 focus-visible:border-primary font-serif" 
            />
          </div>

          {/* Viajeros */}
          <div className="space-y-3">
            <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-foreground block"><T>Viajeros</T></label>
            <div className="flex items-center justify-between border-b border-foreground/20 h-12">
              <button className="h-full px-2 text-foreground hover:text-primary transition-colors" onClick={() => setPeople(Math.max(1, people - 1))}><Minus className="w-4 h-4"/></button>
              <span className="font-serif text-xl text-foreground">{people}</span>
              <button className="h-full px-2 text-foreground hover:text-primary transition-colors" onClick={() => setPeople(people + 1)}><Plus className="w-4 h-4"/></button>
            </div>
          </div>
        </div>

        {/* Botón de Añadir */}
        <button 
          className="w-full h-16 bg-foreground text-background hover:bg-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-6"
          onClick={handleAddToCart}
          disabled={!selectedDate || isAdding}
        >
          {isAdding ? <Loader2 className="animate-spin w-5 h-5" /> : null}
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium">
            {isAdding ? <T>Añadiendo...</T> : <T>Añadir al carrito</T>}
          </span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-24">
        <div className="container mx-auto px-6 lg:px-12">
          
          {/* Título Principal Editorial (Arriba de todo en ambos layouts) */}
          <div className="max-w-4xl mb-12">
            <div className="flex items-center gap-4 mb-6">
              <span className="w-8 h-[1px] bg-foreground/30"></span>
              <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground">
                <T>{experience.categories?.name || "Experiencia"}</T>
              </p>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-foreground leading-[0.95] mb-6">
              <T>{experience.title}</T>
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-[10px] font-medium tracking-[0.2em] uppercase text-muted-foreground border-t border-border pt-6">
              <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary" /> <T>{experience.location}</T></div>
              {experience.duration && (
                <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-primary" /> <T>{experience.duration}</T></div>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* COLUMNA IZQUIERDA: Imagen y Contenido */}
            <div className="lg:col-span-7 space-y-16 w-full">
              
              {/* Imagen Principal asimétrica/editorial sin bordes redondeados */}
              <div className="w-full aspect-[4/3] overflow-hidden border border-border">
                <img src={mainImage} alt={experience.title} className="w-full h-full object-cover" />
              </div>

              {/* Layout Mobile: Widget se inserta aquí */}
              <div className="lg:hidden w-full">
                 <WidgetForm />
              </div>

              {/* Qué harás */}
              {experience.what_you_will_do && experience.what_you_will_do.length > 0 && (
                <section className="pt-8 border-t border-border">
                  <h2 className="text-3xl font-serif text-foreground mb-8"><T>Qué harás</T></h2>
                  <ul className="space-y-6">
                    {experience.what_you_will_do.map((item, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="text-[10px] font-serif italic text-primary mt-1">0{i+1}</span>
                        <span className="text-muted-foreground leading-relaxed font-sans text-base"><T>{item}</T></span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* Descripción */}
              <section className="pt-8 border-t border-border">
                <h2 className="text-3xl font-serif text-foreground mb-8"><T>La Experiencia</T></h2>
                <div className="text-muted-foreground leading-relaxed space-y-6 whitespace-pre-wrap font-sans text-base">
                  <T>{experience.description}</T>
                </div>
              </section>

              {/* Itinerario (Diseño de línea de tiempo minimalista) */}
              {experience.itinerary && experience.itinerary.length > 0 && (
                <section className="pt-8 border-t border-border">
                  <h2 className="text-3xl font-serif text-foreground mb-10"><T>Itinerario</T></h2>
                  <div className="relative border-l border-foreground/20 ml-2 space-y-12">
                    {experience.itinerary.map((step, i) => (
                      <div key={i} className="relative pl-10">
                        <div className="absolute w-2 h-2 bg-primary rounded-none -left-[4.5px] top-2"></div>
                        <p className="text-foreground font-sans leading-relaxed text-base"><T>{step}</T></p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Qué Llevar */}
              {experience.requirements && experience.requirements.length > 0 && (
                <section className="pt-8 border-t border-border">
                  <h2 className="text-3xl font-serif text-foreground mb-8"><T>Esenciales para el viaje</T></h2>
                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
                    {experience.requirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-3 border-b border-border py-3">
                        <Check className="w-4 h-4 text-primary shrink-0"/>
                        <span className="text-sm text-foreground font-sans"><T>{req}</T></span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Información Importante */}
              {experience.important_info && Object.keys(experience.important_info).length > 0 && (
                 <section className="bg-muted/20 p-8 md:p-12 border border-border">
                    <h2 className="text-2xl font-serif text-foreground mb-8 flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-primary"/> <T>A tomar en cuenta</T>
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-10">
                      {Object.entries(experience.important_info).map(([category, items], idx) => (
                        <div key={idx}>
                          <h3 className="text-[10px] uppercase tracking-[0.2em] font-medium text-foreground mb-4"><T>{category}</T></h3>
                          <ul className="space-y-3">
                            {(items as string[]).map((item, i) => (
                              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                                <div className="w-1 h-1 bg-foreground/30 mt-2 shrink-0"></div>
                                <span><T>{item}</T></span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                 </section>
              )}

            </div>

            {/* COLUMNA DERECHA: Widget Sticky en Web */}
            <div className="hidden lg:block lg:col-span-5 sticky top-28">
              <WidgetForm />
            </div>
            
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}