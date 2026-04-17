"use client";
import { useLocale } from 'next-intl';
import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";
import { Loader2, ArrowRight, MapPin, Calendar, Users, Wallet, MessageSquare, User } from "lucide-react";
import { supabase } from '@/lib/supabase';
import { CustomQuote } from "@/lib/types";


const BUDGET_OPTIONS = [
  "Menos de $10,000 MXN",
  "$10,000 - $25,000 MXN",
  "$25,000 - $50,000 MXN",
  "$50,000 - $100,000 MXN",
  "Más de $100,000 MXN",
];

function TranslatedOption({ value }: { value: string }) {
  const translatedText = useT(value);
  return <option value={value} className="font-sans not-italic text-sm">{translatedText}</option>;
}

export default function CotizarPage() {
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    destination: "", startDate: "", travelers: 2, budget: "", requirements: "", firstName: "", lastName: "", email: "", phone: "",
  });

  const phDestination = useT("Ej: Oaxaca, Riviera Maya...");
  const phRequirements = useT("¿Qué experiencias buscas?");
  const phFirstName = useT("Nombre");
  const phLastName = useT("Apellidos");
  const phEmail = useT("Email");
  const phPhone = useT("Teléfono *");
  const phSelectRange = useT("Selecciona un rango");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsSubmitting(true);

    try {
      const customer_name = `${formData.firstName} ${formData.lastName}`.trim();
      const { error: dbError } = await supabase.from('custom_quotes').insert([
        {
          customer_name: customer_name, customer_email: formData.email, phone: formData.phone, destination: formData.destination,
          start_date: formData.startDate, pax_qty: formData.travelers, budget: formData.budget,
          special_requests: formData.requirements, status: 'pending'
        }
      ]);

      if (dbError) throw dbError;

      await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'QUOTE', locale: locale, email: formData.email, customerName: formData.firstName, destination: formData.destination,
          budget: formData.budget, startDate: formData.startDate, travelers: formData.travelers, message: formData.requirements || "Solicitud de itinerario personalizado."
        }),
      });

      setShowSuccess(true);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Error desconocido';
      alert(`Hubo un error: ${message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.destination && formData.startDate && formData.email && formData.firstName && formData.phone;

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  const inputClass = "h-12 border-0 border-b border-foreground/20 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-foreground placeholder:text-muted-foreground/50 font-serif italic text-base";
  const labelClass = "text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground mb-2 flex items-center gap-2";

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 pt-32 pb-24 flex items-center justify-center px-6">
          <div className="max-w-xl w-full border border-border p-12 text-center shadow-xl">
            <h1 className="text-4xl font-serif font-semibold mb-4 text-foreground"><T>¡Solicitud Recibida!</T></h1>
            <p className="text-muted-foreground mb-8 leading-relaxed font-sans">
              <T>Hola</T> <strong className="text-foreground">{formData.firstName}</strong>, <T>hemos enviado un correo a</T> <strong className="text-foreground">{formData.email}</strong> <T>confirmando tu solicitud.</T>
            </p>
            <Link href={`/${locale}/`} className="inline-flex items-center justify-center gap-3 bg-foreground text-background px-8 py-4 hover:bg-primary transition-colors w-full">
              <span className="text-[10px] uppercase tracking-[0.2em] font-medium"><T>Volver al Inicio</T></span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-20">
        
        <section className="bg-background pt-16 pb-12 border-b border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-[1px] bg-foreground/30"></span>
              <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground">
                <T>Viaje a Tu Medida</T>
              </p>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[0.95] text-foreground max-w-3xl mb-6">
              <span className="block"><T>Confeccionamos tu</T></span>
              <span className="block italic text-primary"><T>travesía ideal</T></span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl font-sans">
              <T>Comparte tu visión con nosotros. Nuestros expertos orquestarán un itinerario exclusivo donde cada detalle lleve tu firma.</T>
            </p>
          </div>
        </section>

        <section className="py-16 lg:py-24 bg-muted/10">
          <div className="container mx-auto px-6 lg:px-12 max-w-4xl">
            <form onSubmit={handleSubmit} className="space-y-12">
              
              <div className="bg-background border border-border p-8 lg:p-12 shadow-sm">
                <h2 className="text-2xl font-serif text-foreground mb-8 pb-4 border-b border-border flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" /> <T>Detalles del Viaje</T>
                </h2>
                <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                  <div className="md:col-span-2">
                    <label className={labelClass}><T>¿A dónde quieres ir? *</T></label>
                    <Input value={formData.destination} onChange={(e) => setFormData({ ...formData, destination: e.target.value })} placeholder={phDestination} required className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}><Calendar className="w-3.5 h-3.5" /> <T>Inicio *</T></label>
                    <Input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} min={minDateStr} required className={inputClass} />
                  </div>
                  {/* <div>
                    <label className={labelClass}><Calendar className="w-3.5 h-3.5" /> <T>Regreso</T></label>
                    <Input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} min={formData.startDate || minDateStr} className={inputClass} />
                  </div> */}
                  <div>
                    <label className={labelClass}><Users className="w-3.5 h-3.5" /> <T>Viajeros</T></label>
                    <Input type="number" value={formData.travelers} onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })} min={1} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}><Wallet className="w-3.5 h-3.5" /> <T>Presupuesto</T></label>
                    <select value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className={`${inputClass} w-full cursor-pointer`}>
                      <option value="" className="font-sans not-italic text-sm">{phSelectRange}</option>
                      {BUDGET_OPTIONS.map((o) => <TranslatedOption key={o} value={o} />)}
                    </select>
                  </div>
                  <div className="md:col-span-2 mt-4">
                    <label className={labelClass}><MessageSquare className="w-3.5 h-3.5" /> <T>Requerimientos Especiales</T></label>
                    <Textarea value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} placeholder={phRequirements} rows={4} className="border-0 border-b border-foreground/20 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-foreground placeholder:text-muted-foreground/50 font-serif italic text-base resize-none" />
                  </div>
                </div>
              </div>

              <div className="bg-background border border-border p-8 lg:p-12 shadow-sm">
                <h2 className="text-2xl font-serif text-foreground mb-8 pb-4 border-b border-border flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" /> <T>Datos de Contacto</T>
                </h2>
                <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
                  <Input value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder={phFirstName} required className={inputClass} />
                  <Input value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder={phLastName} className={inputClass} />
                  <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder={phEmail} required className={inputClass} />
                  <Input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder={phPhone} required className={inputClass} />
                </div>
              </div>

              <button type="submit" disabled={!isFormValid || isSubmitting} className="w-full h-16 bg-foreground text-background hover:bg-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                {isSubmitting ? <Loader2 className="animate-spin w-5 h-5" /> : null}
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">
                  {isSubmitting ? <T>Enviando...</T> : <T>Solicitar Cotización</T>}
                </span>
                {!isSubmitting && <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            <div className="mt-16 pt-12 border-t border-border text-center">
              <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground mb-6">
                <T>¿Ya cuentas con una cotización de tu asesor?</T>
              </p>
              <Link href={`/${locale}/pago-folio`} className="inline-flex items-center justify-center gap-3 border border-foreground text-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-colors">
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium"><T>Ir a Pagar Folio</T></span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}