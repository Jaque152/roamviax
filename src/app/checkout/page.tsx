"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from '@/lib/supabase';
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import {
  ChevronLeft, User, CreditCard, FileText,
  Lock, CheckCircle, Calendar, Users, Loader2
} from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");

  const [contactInfo, setContactInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [billingInfo, setBillingInfo] = useState({
    rfc: "",
    businessName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [needsInvoice, setNeedsInvoice] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency", currency: "MXN", minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-MX", {
      day: "numeric", month: "short", year: "numeric",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    setIsProcessing(true);

    try {
      // 1. Manejar el Cliente (Upsert)
      const { data: customer, error: custError } = await supabase
        .from('customers')
        .upsert({
          first_name: contactInfo.firstName,
          last_name: contactInfo.lastName,
          email: contactInfo.email,
          phone: contactInfo.phone
        }, { onConflict: 'email' })
        .select()
        .single();

      if (custError) throw custError;

      // 2. Insertar Reserva en 'bookings'
      const { data: booking, error: bookError } = await supabase
        .from('bookings')
        .insert({
          customer_id: customer.id,
          total_amount: cart.total,
          payment_status: 'paid',
          rfc: needsInvoice ? billingInfo.rfc : null,
          razon_social: needsInvoice ? billingInfo.businessName : null,
          direccion_facturacion: needsInvoice ? billingInfo.address : null,
          ciudad_facturacion: needsInvoice ? billingInfo.city : null,
          estado_facturacion: needsInvoice ? billingInfo.state : null,
          codigo_postal_facturacion: needsInvoice ? billingInfo.zipCode : null
        })
        .select()
        .single();

      if (bookError) throw bookError;

      // 3. Insertar Items en 'booking_items' (Buscando IDs numéricos de paquetes)
      for (const item of cart.items) {
        // Buscamos el ID del paquete en la tabla activity_packages
        const { data: pkgData } = await supabase
          .from('activity_packages')
          .select('id')
          .eq('activity_id', parseInt(item.experienceId))
          .eq('level_id', item.packageLevel.name === 'Básico' ? 1 : (item.packageLevel.name === 'Premium' ? 2 : 3))
          .single();

        const { error: itemError } = await supabase
          .from('booking_items')
          .insert({
            booking_id: booking.id,
            package_id: pkgData?.id || 1, // Fallback al ID 1 si no encuentra coincidencia
            scheduled_date: item.date,
            pax_qty: item.people,
            unit_price: item.totalPrice / item.people
          });

        if (itemError) throw itemError;
      }

      const visualCode = `RES-${booking.id.slice(0, 8).toUpperCase()}`;
      setConfirmationCode(visualCode);
      setShowSuccess(true);
      clearCart();

    } catch (error) {
      console.error("Error en checkout:", error);
      alert("Error al procesar la reserva. Verifica la consola para más detalles.");
    } finally {
      setIsProcessing(false);
    }
  };

  const isFormValid = contactInfo.firstName && contactInfo.lastName && contactInfo.email && contactInfo.phone;

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-stone-50">
        <Header />
        <main className="flex-1 pt-32 flex items-center justify-center px-4">
          <Card className="max-w-lg w-full border-none shadow-2xl">
            <CardContent className="p-10 text-center">
              <CheckCircle className="w-20 h-20 text-green-600 mx-auto mb-6" />
              <h1 className="text-3xl font-serif font-bold mb-3">¡Reservación Confirmada!</h1>
              <p className="text-stone-500 mb-8">
                Tu reserva ha sido registrada para <strong>{contactInfo.email}</strong>.
              </p>
              <div className="p-6 bg-orange-50 rounded-2xl mb-8 border border-orange-100">
                <p className="text-xs font-bold text-orange-700 uppercase mb-2">Código de Reservación</p>
                <p className="font-mono text-2xl font-black text-orange-900">{confirmationCode}</p>
              </div>
              <Button asChild className="w-full h-12 rounded-full bg-orange-400"><Link href="/">Volver al Inicio</Link></Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-stone-50/50">
      <Header />
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card><CardContent className="p-6">
                <h2 className="text-xl font-serif font-semibold mb-6 flex items-center gap-2"><User className="text-orange-600"/> Datos de Contacto</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input value={contactInfo.firstName} onChange={(e)=>setContactInfo({...contactInfo, firstName:e.target.value})} placeholder="Nombre *" required />
                  <Input value={contactInfo.lastName} onChange={(e)=>setContactInfo({...contactInfo, lastName:e.target.value})} placeholder="Apellidos *" required />
                  <Input type="email" value={contactInfo.email} onChange={(e)=>setContactInfo({...contactInfo, email:e.target.value})} placeholder="Email *" required />
                  <Input type="tel" value={contactInfo.phone} onChange={(e)=>setContactInfo({...contactInfo, phone:e.target.value})} placeholder="Teléfono *" required />
                </div>
              </CardContent></Card>

              <Card><CardContent className="p-6">
                <h2 className="text-xl font-serif font-semibold mb-6 flex items-center gap-2"><FileText className="text-orange-600"/> Facturación</h2>
                <label className="flex items-center gap-2 mb-6 cursor-pointer">
                  <input type="checkbox" checked={needsInvoice} onChange={(e)=>setNeedsInvoice(e.target.checked)} className="w-4 h-4" />
                  <span className="text-sm">Requiero factura</span>
                </label>
                {needsInvoice && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input value={billingInfo.rfc} onChange={(e)=>setBillingInfo({...billingInfo, rfc:e.target.value})} placeholder="RFC" />
                    <Input value={billingInfo.businessName} onChange={(e)=>setBillingInfo({...billingInfo, businessName:e.target.value})} placeholder="Razón Social" />
                    <Input className="sm:col-span-2" value={billingInfo.address} onChange={(e)=>setBillingInfo({...billingInfo, address:e.target.value})} placeholder="Dirección" />
                  </div>
                )}
              </CardContent></Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="sticky top-28 shadow-xl">
                <CardContent className="p-6">
                  <h2 className="text-xl font-serif font-semibold mb-6">Resumen</h2>
                  {cart.items.map((item) => (
                    <div key={item.experienceId} className="flex gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{item.experience.title}</p>
                        <p className="text-[10px] text-stone-500">{item.people}p • {formatDate(item.date)}</p>
                      </div>
                      <p className="text-xs font-bold">{formatPrice(item.totalPrice)}</p>
                    </div>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between text-xl font-bold text-orange-700">
                      <span>Total</span><span>{formatPrice(cart.total)}</span>
                    </div>
                    <Button type="submit" disabled={!isFormValid || isProcessing} className="w-full mt-6 bg-orange-400 h-12 rounded-full">
                      {isProcessing ? <Loader2 className="animate-spin" /> : "Confirmar Reserva"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}