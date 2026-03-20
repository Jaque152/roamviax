"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from '@/lib/supabase';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { Experience, PackageLevel } from "@/lib/types"; 
import {
  MapPin, Clock, Users, Check, ChevronLeft,
  Calendar, Minus, Plus, ShoppingCart, Star, Loader2
} from "lucide-react";

export default function ExperienceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  const [experience, setExperience] = useState<Experience | null>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedDate, setSelectedDate] = useState("");
  const [people, setPeople] = useState(1);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function loadFullDetail() {
      setLoading(true);
      const { data: activity } = await supabase
        .from('activities')
        .select('*, categories(name, slug)')
        .eq('id', params.id)
        .single();

      const { data: paks } = await supabase
        .from('activity_packages')
        .select('*, service_levels(name)')
        .eq('activity_id', params.id)
        .order('level_id', { ascending: true });

      if (activity) {
        const mappedExp: Experience = {
          ...activity,
          id: activity.id.toString(),
          category: activity.categories?.name,
          categorySlug: activity.categories?.slug,
          image_url: activity.image_url,
          images: [activity.image_url], 
          // Importante: Guardamos el precio base de la actividad si existe
          basePrice: paks?.[0]?.price || 2499, 
          maxPeople: activity.max_people || 20
        };
        setExperience(mappedExp);
      }
      
      setPackages(paks || []);
      if (paks && paks.length > 0) setSelectedPackage(paks[0]);
      setLoading(false);
    }
    if (params.id) loadFullDetail();
  }, [params.id]);

  const totalPrice: number = useMemo(() => {
    if (!selectedPackage) return 0;
    return Number(selectedPackage.price) * people;
  }, [selectedPackage, people]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency", currency: "MXN", minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!experience || !selectedDate || !selectedPackage) return;
    setIsAdding(true);

    const packageLevelForCart: PackageLevel = {
      id: selectedPackage.service_levels.name.toLowerCase(),
      name: selectedPackage.service_levels.name,
      multiplier:1,
      includes: selectedPackage.features || []
    };

    // SOLUCIÓN AL NaN: 
    // Enviamos el objeto experience con el precio numérico correcto
    // y nos aseguramos de que el contexto reciba los datos necesarios.
    addToCart({
      experienceId: experience.id,
      experience: {
        ...experience,
        basePrice: Number(selectedPackage.price) // Inyectamos el precio del paquete seleccionado
      },
      date: selectedDate,
      people: people,
      packageLevel: packageLevelForCart,
    });

    setTimeout(() => {
      setIsAdding(false);
      router.push("/carrito");
    }, 500);
  };

  const minDateStr = new Date(Date.now() + 86400000).toISOString().split("T")[0];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  if (!experience) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            
            {/* Columna Izquierda */}
            <div className="lg:col-span-2 space-y-8">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-secondary shadow-lg">
                <img src={experience.image_url} alt={experience.title} className="w-full h-full object-cover" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="secondary" className="bg-orange-50 text-orange-700">{experience.category}</Badge>
                  <span className="flex items-center gap-1 text-sm text-stone-500"><MapPin className="w-4 h-4" /> {experience.location}</span>
                </div>
                <h1 className="text-4xl font-serif font-bold mb-4">{experience.title}</h1>
                <p className="text-lg text-stone-600 leading-relaxed">{experience.description}</p>
              </div>

              <div className="pt-4 border-t border-stone-100">
                <h2 className="text-2xl font-serif font-bold mb-6">
                  Lo que incluye el nivel {selectedPackage?.service_levels?.name}
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedPackage?.features?.map((item: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-4 rounded-xl bg-stone-50 border border-stone-100 transition-all hover:shadow-md">
                      <div className="mt-1 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-orange-600" />
                      </div>
                      <span className="text-sm text-stone-700 leading-tight">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Columna Derecha */}
            <div className="lg:col-span-1">
              <div className="sticky top-28">
                <Card className="border-none shadow-2xl bg-stone-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-sm text-stone-500">Desde</span>
                      <span className="text-3xl font-bold text-orange-700">{formatPrice(Number(selectedPackage?.price) || 2499)}</span>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Fecha de la experiencia</label>
                        <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} min={minDateStr} className="bg-white" />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Número de personas</label>
                        <div className="flex items-center gap-4 bg-white p-1 rounded-md border w-fit">
                          <Button variant="ghost" size="icon" onClick={() => setPeople(Math.max(1, people - 1))}><Minus className="w-3 h-3"/></Button>
                          <span className="font-bold w-4 text-center">{people}</span>
                          <Button variant="ghost" size="icon" onClick={() => setPeople(people + 1)}><Plus className="w-3 h-3"/></Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-stone-500">Nivel de Paquete</label>
                        {packages.map((pkg) => (
                          <div 
                            key={pkg.id}
                            onClick={() => setSelectedPackage(pkg)}
                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                              selectedPackage?.id === pkg.id ? "border-orange-600 bg-white shadow-sm" : "border-transparent bg-white/50 hover:border-orange-200"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-bold text-sm">{pkg.service_levels.name}</span>
                              <span className="text-[10px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded">
                                {pkg.level_id === 1 ? 'Base' : (pkg.level_id === 2 ? 'Premium' : 'VIP')}
                              </span>
                            </div>
                            
                            <div className="space-y-1">
                              {pkg.features?.slice(0, 3).map((f: string, i: number) => (
                                <p key={i} className="text-[10px] text-stone-500 flex items-center gap-1">
                                  <Check className="w-2 h-2 text-orange-600"/> {f}
                                </p>
                              ))}
                              {pkg.features?.length > 3 && (
                                <p className="text-[10px] text-orange-700 font-bold mt-1 ml-3">
                                  +{pkg.features.length - 3} más incluido
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 mt-6 border-t border-stone-200">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-stone-500 text-sm">Total</span>
                        <span className="text-2xl font-bold">{formatPrice(totalPrice)}</span>
                      </div>
                      <p className="text-[10px] text-orange-700 text-right font-bold italic">IVA Incluido</p>
                    </div>

                    <Button 
                      className="w-full bg-orange-400 hover:bg-orange-500 text-white rounded-full py-6 mt-6 shadow-lg gap-2"
                      onClick={handleAddToCart}
                      disabled={!selectedDate || isAdding}
                    >
                      <ShoppingCart className="w-5 h-5" /> {isAdding ? "Agregando..." : "Agregar al Carrito"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}