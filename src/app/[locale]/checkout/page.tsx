"use client";

import { useLocale } from 'next-intl';
import { useState, Suspense, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/context/CartContext";
import { CheckCircle, Loader2, Lock, ArrowRight } from "lucide-react";
import { T } from "@/components/T";
import { useT } from "@/hooks/useT";

function CheckoutContent() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const finalTotal = cart.total;
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [contactInfo, setContactInfo] = useState({ firstName: "", lastName: "", email: "", phone: "" });
  const [billingInfo, setBillingInfo] = useState({ pais: "", direccion: "", localidad: "", estado: "", codigo_postal: "" });
  const [addNotes, setAddNotes] = useState(false);
  const [orderNotes, setOrderNotes] = useState("");
  const [cardInfo, setCardInfo] = useState({ number: "", name: "", expiry: "", cvv: "" });

  const locale = useLocale();

  useEffect(() => {
    const savedData = sessionStorage.getItem("roamviax_temp_contact");
    if (savedData) {
      const { nombre, email, folio } = JSON.parse(savedData);
      setContactInfo(prev => ({ ...prev, firstName: nombre, email: email }));
      setOrderNotes(`Pago referente al Folio: ${folio}`);
      setAddNotes(true);
      sessionStorage.removeItem("roamviax_temp_contact"); 
    }
  }, []);

  const phNombre = useT("Nombre");
  const phApellidos = useT("Apellidos");
  const phEmail = useT("Email");
  const phTelefono = useT("Teléfono");
  const phPais = useT("País / Región");
  const phDireccion = useT("Dirección completa");
  const phLocalidad = useT("Localidad / Ciudad");
  const phEstado = useT("Región / Estado");
  const phCP = useT("Código Postal");
  const phTarjeta = useT("0000 0000 0000 0000");
  const phNombreTarjeta = useT("Nombre en la tarjeta");
  const phFecha = useT("MM/AA");
  const phCvv = useT("CVV");
  const textProcesando = useT("Procesando...");
  const textPagar = useT("Pagar");

  const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(price);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale: locale, contactInfo, billingInfo, orderNotes: addNotes ? orderNotes : null, cart: cart, cardInfo, formattedTotal: formatPrice(finalTotal), manualFolioData:null
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Error procesando el pago");
      
      setShowSuccess(true);
      clearCart();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error desconocido";
      alert(`Error al procesar el pago: ${errorMessage}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = contactInfo.firstName && contactInfo.email && contactInfo.phone && billingInfo.pais && billingInfo.direccion && billingInfo.localidad && billingInfo.estado && billingInfo.codigo_postal && cardInfo.number.length >= 15 && cardInfo.name && cardInfo.expiry.length === 5 && cardInfo.cvv.length >= 3 && cart.items.length > 0;

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 4) val = val.slice(0, 4);
    if (val.length > 2) val = `${val.slice(0, 2)}/${val.slice(2)}`;
    setCardInfo({ ...cardInfo, expiry: val });
  };

  const inputClass = "h-12 border-0 border-b border-foreground/20 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-foreground placeholder:text-muted-foreground/40 font-serif italic text-base";
  const labelClass = "text-[10px] uppercase tracking-[0.2em] font-medium text-foreground mb-2 block";

  if (showSuccess) {
    return (
      <main className="flex-1 pt-32 pb-24 flex items-center justify-center px-6">
        <div className="max-w-xl w-full border border-border p-12 text-center shadow-xl bg-background">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-serif font-semibold mb-4 text-foreground"><T>¡Pago Exitoso!</T></h1>
          <p className="text-muted-foreground mb-8 leading-relaxed font-sans">
            <T>Tu transacción ha sido confirmada y tu aventura está lista.</T>
          </p>
          <Link href={`/${locale}/`} className="inline-flex items-center justify-center gap-3 bg-foreground text-background px-8 py-4 hover:bg-primary transition-colors w-full">
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium"><T>Volver al Inicio</T></span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 pt-24 pb-24 bg-background">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        <div className="flex items-center gap-4 mb-10">
          <span className="w-8 h-[1px] bg-foreground/30"></span>
          <h1 className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground"><T>Checkout Seguro</T></h1>
        </div>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Formularios Izquierda */}
          <div className="lg:col-span-7 space-y-16">
            
            <section>
              <h2 className="text-3xl font-serif text-foreground mb-8 pb-4 border-b border-border"><T>Datos de Contacto</T></h2>
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
                <div><label className={labelClass}><T>Nombre</T></label><Input value={contactInfo.firstName} onChange={(e)=>setContactInfo({...contactInfo, firstName:e.target.value})} placeholder={phNombre} required className={inputClass} /></div>
                <div><label className={labelClass}><T>Apellidos</T></label><Input value={contactInfo.lastName} onChange={(e)=>setContactInfo({...contactInfo, lastName:e.target.value})} placeholder={phApellidos} className={inputClass} /></div>
                <div><label className={labelClass}><T>Email</T></label><Input type="email" value={contactInfo.email} onChange={(e)=>setContactInfo({...contactInfo, email:e.target.value})} placeholder={phEmail} required className={inputClass} /></div>
                <div><label className={labelClass}><T>Teléfono</T></label><Input type="tel" value={contactInfo.phone} onChange={(e)=>setContactInfo({...contactInfo, phone:e.target.value})} placeholder={phTelefono} required className={inputClass} /></div>
              </div>
            </section>
              
            <section>
              <h2 className="text-3xl font-serif text-foreground mb-8 pb-4 border-b border-border"><T>Facturación</T></h2>
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
                <div className="sm:col-span-2"><label className={labelClass}><T>País / Región</T></label><Input placeholder={phPais} required value={billingInfo.pais} onChange={(e)=>setBillingInfo({...billingInfo, pais:e.target.value})} className={inputClass} /></div>
                <div className="sm:col-span-2"><label className={labelClass}><T>Dirección completa</T></label><Input placeholder={phDireccion} required value={billingInfo.direccion} onChange={(e)=>setBillingInfo({...billingInfo, direccion:e.target.value})} className={inputClass} /></div>
                <div><label className={labelClass}><T>Localidad / Ciudad</T></label><Input placeholder={phLocalidad} required value={billingInfo.localidad} onChange={(e)=>setBillingInfo({...billingInfo, localidad:e.target.value})} className={inputClass} /></div>
                <div><label className={labelClass}><T>Estado / Provincia</T></label><Input placeholder={phEstado} required value={billingInfo.estado} onChange={(e)=>setBillingInfo({...billingInfo, estado:e.target.value})} className={inputClass} /></div>
                <div><label className={labelClass}><T>Código Postal</T></label><Input placeholder={phCP} required value={billingInfo.codigo_postal} onChange={(e)=>setBillingInfo({...billingInfo, codigo_postal:e.target.value})} className={inputClass} /></div>
              </div>

              <div className="mt-10 pt-6">
                <label className="flex items-center gap-3 cursor-pointer text-muted-foreground hover:text-foreground transition-colors group">
                  <input type="checkbox" checked={addNotes} onChange={(e)=>setAddNotes(e.target.checked)} className="rounded-none border-border text-foreground focus:ring-foreground w-4 h-4" /> 
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium"><T>Añadir nota al pedido (Opcional)</T></span>
                </label>
                {addNotes && (
                  <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                    <Textarea placeholder="Ej: Alergias, solicitudes de horario..." value={orderNotes} onChange={(e) => setOrderNotes(e.target.value)} className="bg-transparent border-0 border-b border-foreground/20 min-h-[100px] font-serif italic text-base focus-visible:ring-0 focus-visible:border-primary rounded-none px-0 resize-none" />
                  </div>
                )}
              </div>
            </section>

            <section className="bg-muted/10 border border-border p-8 lg:p-12 relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-4 border-b border-border">
                <h2 className="text-3xl font-serif text-foreground flex items-center gap-3"><T>Pago</T></h2>
                <div className="h-6 opacity-80"><img src="/etomin_logo.svg" alt="Powered by Etomin" className="h-full object-contain filter grayscale" /></div>
              </div>
                
              <div className="grid gap-y-8 max-w-md">
                <div><label className={labelClass}><T>Número de Tarjeta</T></label><Input placeholder={phTarjeta} required maxLength={19} value={cardInfo.number} onChange={(e)=>setCardInfo({...cardInfo, number: e.target.value.replace(/\D/g, '')})} className={`${inputClass} font-mono not-italic tracking-widest text-lg`} /></div>
                <div><label className={labelClass}><T>Nombre en la Tarjeta</T></label><Input placeholder={phNombreTarjeta} required value={cardInfo.name} onChange={(e)=>setCardInfo({...cardInfo, name: e.target.value.toUpperCase()})} className={`${inputClass} not-italic`} /></div>
                <div className="grid grid-cols-2 gap-8">
                  <div><label className={labelClass}><T>Vencimiento</T></label><Input placeholder={phFecha} required maxLength={5} value={cardInfo.expiry} onChange={handleExpiryChange} className={`${inputClass} font-mono not-italic tracking-widest text-center`} /></div>
                  <div><label className={labelClass}><T>CVV</T></label><Input placeholder="***" type="password" required maxLength={4} value={cardInfo.cvv} onChange={(e)=>setCardInfo({...cardInfo, cvv: e.target.value.replace(/\D/g, '')})} className={`${inputClass} font-mono not-italic tracking-widest text-center`} /></div>
                </div>
                
                <div className="mt-4 flex flex-col items-start gap-4">
                  <div className="h-8 opacity-70"><img src="/etomin_secbadge.svg" alt="Secure Payment" className="h-full object-contain filter grayscale" /></div>
                  <p className="text-[10px] uppercase tracking-[0.1em] text-muted-foreground"><T>Datos encriptados de extremo a extremo.</T></p>
                </div>
              </div>
            </section>
          </div>
            
          {/* Resumen Derecha */}
          <div className="lg:col-span-5">
            <div className="bg-background border border-border p-8 lg:p-10 sticky top-28 shadow-2xl">
              <h2 className="text-[10px] uppercase tracking-[0.3em] font-medium text-foreground mb-8 pb-4 border-b border-border"><T>Resumen de Compra</T></h2>
              
              <div className="space-y-6 mb-10">
                {cart.items.length === 0 ? (
                  <p className="text-muted-foreground font-serif italic"><T>Tu carrito está vacío.</T></p>
                ) : (
                  cart.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-start gap-4">
                      <span className="text-sm text-muted-foreground font-sans leading-relaxed flex-1">
                        <T>{item.experience.title}</T> <span className="text-foreground font-medium ml-1">(x{item.people})</span>
                      </span>
                      <span className="font-serif text-foreground whitespace-nowrap">{formatPrice(item.totalPrice)}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-border pt-8 mt-8">
                <div className="flex justify-between items-end mb-10">
                  <span className="font-serif text-2xl text-foreground"><T>Total</T></span>
                  <div className="text-right">
                    <div className="text-3xl font-serif text-primary">{formatPrice(finalTotal)}</div>
                    <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-2"><T>IVA incluido</T></div>
                  </div>
                </div>
                
                <button type="submit" disabled={!isFormValid || isProcessing} className="w-full h-16 bg-foreground text-background hover:bg-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3">
                  {isProcessing ? <Loader2 className="animate-spin w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium">
                    {isProcessing ? textProcesando : `${textPagar} ${formatPrice(finalTotal)}`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <Suspense fallback={
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="animate-spin w-10 h-10 text-foreground" />
        </div>
      }>
        <CheckoutContent />
      </Suspense>
      <Footer />
    </div>
  );
}