"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";
import { useCart } from "@/context/CartContext";
import { ArrowRight } from "lucide-react";

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

  const btnConfirmar = useT("Añadir al carrito");

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
    sessionStorage.setItem("roamviax_temp_contact", JSON.stringify({ nombre, email, folio }));
    router.push(`/${locale}/checkout`);
  };

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  // Estilos compartidos para inputs editoriales
  const inputClass = "h-12 border-0 border-b border-foreground/20 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-foreground placeholder:text-muted-foreground/40 font-serif italic text-base w-full";
  const labelClass = "text-[10px] uppercase tracking-[0.2em] font-medium text-foreground block mb-2";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
          
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            
            {/* Columna Izquierda: Contexto Editorial (Sticky para que acompañe el scroll) */}
            <div className="lg:col-span-5 space-y-10 lg:sticky lg:top-32">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <span className="w-8 h-[1px] bg-foreground/30"></span>
                  <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground">
                    <T>Servicios Especiales</T>
                  </p>
                </div>
                <h1 className="text-5xl md:text-6xl font-serif text-foreground leading-[0.95] mb-6">
                  <span className="block"><T>Aventura</T></span>
                  <span className="block italic text-primary"><T>Personalizada</T></span>
                </h1>
                <p className="text-muted-foreground leading-relaxed font-sans text-base">
                  <T>Si tienes un itinerario diseñado previamente por tu agente o deseas agendar una actividad privada para un grupo, ingresa los detalles aquí para asegurar tu lugar.</T>
                </p>
              </div>

              {/* Imagen contenida en un marco (Nunca se cortará) */}
              <div className="aspect-[4/5] w-full overflow-hidden border border-border bg-muted shadow-sm">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop"
                  alt="Aventura Personalizada"
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </div>

            {/* Columna Derecha: Formulario Editorial */}
            <div className="lg:col-span-7">
              <div className="bg-background border border-border p-8 md:p-12 lg:p-14 shadow-sm">
                
                <h2 className="text-2xl font-serif text-foreground mb-8 pb-4 border-b border-border">
                  <T>Detalles de la cotización</T>
                </h2>

                <form onSubmit={handleConfirmarReserva} className="space-y-10">
                  
                  {/* Costo - FIX LUPA/BORROSO: Usando Flexbox en lugar de absolute */}
                  <div>
                    <label className={labelClass}>
                      <T>Costo del Servicio (MXN + IVA)</T> <span className="text-primary">*</span>
                    </label>
                    <div className="flex items-center w-full h-12 border-b border-foreground/20 group focus-within:border-primary transition-colors">
                      <div className="flex items-center justify-center w-6 shrink-0">
                        <span className="font-serif italic text-muted-foreground group-focus-within:text-foreground text-lg transition-colors">$</span>
                      </div>
                      <Input 
                        type="text" 
                        value={monto}
                        onChange={handleMontoChange}
                        placeholder="0.00"
                        required
                        className="flex-1 bg-transparent border-0 rounded-none px-0 h-full focus-visible:ring-0 text-lg font-mono tracking-wider not-italic text-foreground placeholder:text-muted-foreground/40"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
                    {/* Nombre */}
                    <div>
                      <label className={labelClass}>
                        <T>Nombre completo</T> <span className="text-primary">*</span>
                      </label>
                      <Input 
                        type="text" 
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        required
                        placeholder="Tu nombre"
                        className={inputClass}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className={labelClass}>
                        <T>Correo Electrónico</T> <span className="text-primary">*</span>
                      </label>
                      <Input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="correo@ejemplo.com"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10">
                    {/* Folio */}
                    <div>
                      <label className={labelClass}>
                        <T>Folio Acordado</T> <span className="text-primary">*</span>
                      </label>
                      <Input 
                        type="text" 
                        value={folio}
                        onChange={(e) => setFolio(e.target.value.toUpperCase())}
                        required
                        placeholder="Ej: RX-001"
                        className={`${inputClass} uppercase font-mono not-italic tracking-wider`}
                      />
                    </div>

                    {/* Fecha */}
                    <div>
                      <label className={labelClass}>
                        <T>Fecha de salida</T> <span className="text-primary">*</span>
                      </label>
                      <Input 
                        type="date" 
                        value={fecha}
                        min={minDateStr}
                        onChange={(e) => setFecha(e.target.value)}
                        required
                        className={`${inputClass} font-sans not-italic`}
                      />
                    </div>
                  </div>

                  {/* Botón Confirmar */}
                  <div className="pt-8 mt-4 border-t border-border">
                    <button 
                      type="submit" 
                      disabled={!isFormValid}
                      className="w-full h-16 bg-foreground text-background hover:bg-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      <span className="text-[10px] uppercase tracking-[0.2em] font-medium">
                        {btnConfirmar}
                      </span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}