"use client";
import { useLocale } from 'next-intl';
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { supabase } from '@/lib/supabase';
import { MapPin, Search, ArrowRight, Loader2 } from "lucide-react";
import { Experience, SupabaseExperienceResponse } from "@/lib/types";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";

type ExperienceWithPrice = Experience & { displayPrice: number };

function ExperienciasContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("categoria");
  const locale = useLocale();
  const [experiences, setExperiences] = useState<ExperienceWithPrice[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [searchTerm, setSearchTerm] = useState("");
  const phSearch = useT("Buscar experiencias...");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const { data: catData } = await supabase.from('categories').select('*');
        if (catData) setCategories(catData);

        const { data: actData } = await supabase
          .from('activities')
          .select(`
            id, title, slug, description, location, images, category_id,
            categories (id, name, slug),
            activity_packages (price)
          `);

        if (actData) {
          const mappedData: ExperienceWithPrice[] = (actData as unknown as SupabaseExperienceResponse[]).map((item) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description || "",
            location: item.location,
            images: item.images || [], 
            category_id: item.category_id,
            categories: item.categories || undefined,
            displayPrice: item.activity_packages?.[0]?.price || 0
          }));
          setExperiences(mappedData);
        }
      } catch (error) {
        console.error("Error fetchData:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const filteredExperiences = experiences.filter((exp) => {
    const matchesCategory = !selectedCategory || exp.categories?.slug === selectedCategory;
    const matchesSearch = !searchTerm ||
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => {
    const formatter = new Intl.NumberFormat("es-MX", {
      style: "currency", currency: "MXN", minimumFractionDigits: 0,
    });
    return `${formatter.format(price)} MXN`;
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-10 h-10 animate-spin text-foreground" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        
        {/* Header Section Editorial */}
        <section className="bg-background pt-0 pb-12 border-b border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-[1px] bg-foreground/30"></span>
              <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground">
                <T>Catálogo de Experiencias</T>
              </p>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[0.95] text-foreground">
              <span className="block"><T>Descubre</T></span>
              <span className="block italic text-primary"><T>aventuras únicas</T></span>
            </h1>
          </div>
        </section>

        {/* Filter Bar Editorial */}
        <section className="border-b border-border bg-background sticky top-20 z-40">
          <div className="container mx-auto px-6 lg:px-12 py-4">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              
              {/* Categorías (Minimalist Text Buttons) */}
              <div className="flex flex-wrap gap-6 items-center">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`text-[10px] uppercase tracking-[0.2em] font-medium transition-colors ${!selectedCategory ? 'text-primary border-b border-primary pb-1' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <T>Todas</T>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`text-[10px] uppercase tracking-[0.2em] font-medium transition-colors ${selectedCategory === cat.slug ? 'text-primary border-b border-primary pb-1' : 'text-muted-foreground hover:text-foreground'}`}
                  >
                    <T>{cat.name}</T>
                  </button>
                ))}
              </div>

              {/* Búsqueda */}
              <div className="flex items-center w-full lg:w-72 h-10 border-b border-border bg-transparent group focus-within:border-primary transition-colors">
                <div className="flex items-center justify-center w-8 shrink-0">
                  <Search 
                    className="w-4 h-4 text-muted-foreground group-focus-within:text-foreground transition-colors" 
                    strokeWidth={1.5} 
                  />
                </div>
                <Input
                  placeholder={phSearch}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 border-0 bg-transparent rounded-none h-full px-0 focus-visible:ring-0 focus-visible:border-0 text-sm font-serif italic text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Grid de Experiencias */}
        <section className="py-16 lg:py-24 bg-muted/10">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-16">
              {filteredExperiences.map((exp) => {
                const thumbImage = exp.images?.length > 0 ? exp.images[0] : '/placeholder.jpg';

                return (
                  <Link key={exp.id} href={`/${locale}/experiencias/${exp.id}`} className="group flex flex-col">
                    <div className="aspect-[4/5] relative overflow-hidden bg-muted mb-6 border border-border/50">
                      <img 
                        src={thumbImage} 
                        alt={exp.title} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                      />
                    </div>
                    
                    <div className="flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                          <T>{exp.categories?.name || "Sin Categoría"}</T>
                        </p>
                        <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                          <MapPin className="w-3 h-3 text-primary" /> <T>{exp.location}</T>
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-serif text-foreground mb-4 group-hover:text-primary transition-colors">
                        <T>{exp.title}</T>
                      </h3>
                      
                      <div className="mt-auto pt-6 border-t border-border flex items-center justify-between">
                        <div>
                          <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1"><T>Desde</T></p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-lg font-serif font-medium text-foreground">
                              {formatPrice(exp.displayPrice)}
                            </p>
                          </div>
                        </div>
                        <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium text-foreground group-hover:text-primary transition-colors">
                          <T>Explorar</T> <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            
            {filteredExperiences.length === 0 && (
              <div className="text-center py-20 border border-border">
                <p className="text-muted-foreground font-serif text-xl italic"><T>No encontramos experiencias con esos filtros.</T></p>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default function ExperienciasPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-foreground" />
      </div>
    }>
      <ExperienciasContent />
    </Suspense>
  );
}