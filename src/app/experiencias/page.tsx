"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from '@/lib/supabase';
import { MapPin, Search, X, ArrowRight, Loader2 } from "lucide-react";

export default function ExperienciasPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("categoria");

  const [experiences, setExperiences] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      
      // Traer Categorías reales
      const { data: catData } = await supabase.from('categories').select('*');
      if (catData) setCategories(catData);

      // Traer Experiencias con sus categorías y precios
      const { data: actData } = await supabase
        .from('activities')
        .select(`
          *,
          categories (name, slug),
          activity_packages (price)
        `);
      
      if (actData) setExperiences(actData);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Sincronizar con el parámetro de la URL si cambia
  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // FILTRADO IDÉNTICO AL ORIGINAL
  const filteredExperiences = experiences.filter((exp) => {
    const matchesCategory = !selectedCategory || exp.categories?.slug === selectedCategory;
    const matchesSearch = !searchTerm ||
      exp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-10 h-10 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20">
        <section className="bg-gradient-to-br from-secondary/50 via-background to-secondary/30 py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <Badge variant="outline" className="mb-4 rounded-full px-4 py-1 border-primary/30 text-primary">
              Catálogo de Experiencias
            </Badge>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
              Descubre <span className="text-gradient">aventuras únicas</span>
            </h1>
          </div>
        </section>

        <section className="border-b border-border bg-background sticky top-20 z-40">
          <div className="container mx-auto px-4 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={!selectedCategory ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                  className="rounded-full"
                >Todas</Button>
                {categories.map((cat) => (
                  <Button
                    key={cat.id}
                    variant={selectedCategory === cat.slug ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat.slug)}
                    className="rounded-full"
                  >{cat.name}</Button>
                ))}
              </div>
              <div className="relative w-full lg:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar experiencias..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rounded-full"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredExperiences.map((exp) => (
                <Link key={exp.id} href={`/experiencias/${exp.id}`} className="group">
                  <Card className="h-full overflow-hidden hover:shadow-xl transition-all">
                    <div className="aspect-[4/3] relative overflow-hidden">
                      <img src={exp.image_url} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <Badge className="absolute top-4 left-4 bg-background/90 text-foreground">{exp.categories?.name}</Badge>
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-serif font-semibold mb-2">{exp.title}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                        <MapPin className="w-4 h-4" /> {exp.location}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Desde</p>
                          <p className="text-lg font-semibold text-primary">
                            {formatPrice(exp.activity_packages?.[0]?.price || 0)}
                          </p>
                        </div>
                        <span className="flex items-center gap-1 text-sm text-primary font-medium">
                          Ver detalles <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}