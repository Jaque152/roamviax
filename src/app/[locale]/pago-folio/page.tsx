"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle } from "lucide-react";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";
import { useCart } from "@/context/CartContext";

export default function PagoFolioPage() {
  const router = useRouter();
  const locale = useLocale();
  const { addToCart } = useCart();
  
  // Estados
  const [monto, setMonto] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [folio, setFolio] = useState("");
  const [fecha, setFecha] = useState("");

  const btnConfirmar = useT(" Añadir al carrito ");

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.]/g, ''); 
    setMonto(val);
  };

  const isFormValid = 
    parseFloat(monto) > 0 && 
    nombre.trim().length > 0 && 
    email.includes("@") && 
    folio.trim().length > 0 && 
    fecha !== "";

  const handleConfirmarReserva = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    const montoNumerico = parseFloat(monto);

    const customExperienceItem = {
      packageId: 0,
      experience: {
        id: 0,
        title: "Aventura Personalizada",
        slug: "aventura-personalizada",
        description: `Pago de folio: ${folio}`,
        location: "Múltiples Destinos",
        images: ["https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop"],
        category_id: 0
      },
      levelName: "Personalizado",
      date: fecha,
      people: 1, 
      pricePerPerson: montoNumerico,
      totalPrice: montoNumerico
    };

    addToCart(customExperienceItem);
    sessionStorage.setItem("zenith_temp_contact", JSON.stringify({ nombre, email, folio }));
    router.push(`/${locale}/checkout`);
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-24 px-4 lg:pt-36">
        <div className="container mx-auto max-w-6xl">
          
          <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 items-start">
            
            {/* Columna Izquierda: Imagen y Textos (Fija en escritorio) */}
            <div className="w-full relative rounded-2xl overflow-hidden shadow-2xl h-[350px] md:h-[450px] lg:h-[700px] lg:sticky lg:top-32 mb-10 lg:mb-0">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop')] bg-cover bg-center"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              
              <div className="absolute bottom-6 left-6 right-6 lg:bottom-10 lg:left-10 lg:right-10 z-10">
                <p className="text-primary font-bold mb-3 text-xs md:text-sm uppercase tracking-widest"><T>Servicios Especiales</T></p>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-4 uppercase">
                  <T>Aventura</T> <br/>
                  <T>Personalizada</T>
                </h1>
                <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-sm hidden md:block">
                  <T>Si alguna de nuestras experiencias no cumple con tus expectativas, organizaremos una experiencia totalmente personalizada.</T>
                </p>
              </div>
            </div>

            {/* Columna Derecha: Formulario */}
            <div className="w-full flex flex-col justify-center lg:pt-4">
              
              <div className="mb-10">
                <h2 className="text-2xl font-serif font-bold text-foreground mb-4">
                  <T>Sujeto a cotización</T>
                </h2>
                
                <p className="text-muted-foreground leading-relaxed mb-8">
                  <T>Si alguna de nuestras experiencias no cumple con tus expectativas, o si deseas agendar una actividad para un grupo, contáctanos. Organizaremos una experiencia </T>
                  <strong className="text-foreground"><T>totalmente personalizada</T></strong>
                  <T>, en la que uno de nuestros agentes se comunicará contigo para recopilar los detalles de tu aventura y asegurarse de que cada aspecto se ajuste a tus necesidades.</T>
                </p>
              </div>

              <form onSubmit={handleConfirmarReserva} className="space-y-6 bg-card p-6 md:p-8 rounded-2xl border border-border shadow-lg">
                
                {/* Costo */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" /> <T>Costo del Servicio MXN + IVA</T>
                  </label>
                  <div className="relative flex items-center">
                    <span className="absolute left-4 text-muted-foreground font-bold">$</span>
                    <Input 
                      type="text" 
                      value={monto}
                      onChange={handleMontoChange}
                      placeholder="0.00"
                      required
                      className="bg-background border-border focus-visible:ring-primary pl-8 text-foreground h-12 rounded-xl"
                    />
                  </div>
                </div>

                {/* Nombre */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" /> 
                    <span><T>Nombre</T> <span className="text-destructive">*</span></span>
                  </label>
                  <Input 
                    type="text" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                    className="bg-background border-border focus-visible:ring-primary text-foreground h-12 rounded-xl"
                  />
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" /> 
                    <span><T>Correo Electrónico</T> <span className="text-destructive">*</span></span>
                  </label>
                  <Input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-background border-border focus-visible:ring-primary text-foreground h-12 rounded-xl"
                  />
                </div>

                {/* Folio */}
                <div className="space-y-3">
                  <label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" /> 
                    <span><T>Número de folio Acordado</T> <span className="text-destructive">*</span></span>
                  </label>
                  <Input 
                    type="text" 
                    value={folio}
                    onChange={(e) => setFolio(e.target.value.toUpperCase())}
                    required
                    className="bg-background border-border focus-visible:ring-primary text-foreground uppercase font-mono h-12 rounded-xl"
                  />
                </div>

                {/* Fecha */}
                <div className="space-y-3 pb-4">
                  <label className="text-sm font-bold text-foreground flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary" /> 
                    <span><T>Selecciona tu fecha de salida:</T></span>
                  </label>
                  <Input 
                    type="date" 
                    value={fecha}
                    min={minDateStr}
                    onChange={(e) => setFecha(e.target.value)}
                    required
                    className="bg-background border-border focus-visible:ring-primary text-foreground h-12 rounded-xl"
                  />
                </div>

                {/* Botón Confirmar */}
                <Button 
                  type="submit" 
                  disabled={!isFormValid}
                  className="w-full md:w-auto h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all shadow-lg px-8 text-base"
                >
                  {btnConfirmar}
                </Button>
                
              </form>
              
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}