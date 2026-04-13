"use client";
import { T } from "@/components/T";
import { useLocale } from 'next-intl';
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight, MapPin } from "lucide-react";

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const locale = useLocale();

  const formatPrice = (price: number) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(price);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-MX", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-24">
        <div className="container mx-auto px-6 lg:px-12 max-w-6xl">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-border pb-8">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <span className="w-8 h-[1px] bg-foreground/30"></span>
                <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground">
                  <T>Tu Selección</T>
                </p>
              </div>
              <h1 className="text-5xl font-serif text-foreground"><T>Carrito</T></h1>
            </div>
            {cart.items.length > 0 && (
              <button onClick={clearCart} className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground hover:text-destructive transition-colors flex items-center gap-2">
                <Trash2 className="w-3.5 h-3.5" /> <T>Vaciar carrito</T>
              </button>
            )}
          </div>

          {cart.items.length === 0 ? (
            <div className="border border-border p-16 text-center bg-muted/10">
              <ShoppingCart className="w-12 h-12 text-muted-foreground/50 mx-auto mb-6" />
              <h2 className="text-2xl font-serif text-foreground mb-4"><T>Tu carrito está vacío</T></h2>
              <Link href={`/${locale}/experiencias`} className="inline-flex items-center justify-center gap-3 bg-foreground text-background px-8 py-4 hover:bg-primary transition-colors mt-4">
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium"><T>Explorar Experiencias</T></span>
              </Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
              
              <div className="lg:col-span-7 space-y-8">
                {cart.items.map((item) => {
                  const itemImage = item.experience.images && item.experience.images.length > 0 ? item.experience.images[0] : '/placeholder.jpg';
                  
                  return (
                    <div key={`${item.packageId}-${item.date}`} className="flex flex-col sm:flex-row gap-6 border-b border-border pb-8">
                      <div className="w-full sm:w-40 aspect-[4/5] overflow-hidden border border-border flex-shrink-0">
                        <img src={itemImage} alt={item.experience.title} className="w-full h-full object-cover" />
                      </div>
                      
                      <div className="flex-1 flex flex-col">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-[9px] uppercase tracking-[0.2em] font-medium text-muted-foreground"><T>{item.levelName}</T></p>
                          <button onClick={() => removeFromCart(item.packageId, item.date)} className="text-muted-foreground hover:text-destructive transition-colors">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                        
                        <h3 className="text-2xl font-serif text-foreground mb-3"><T>{item.experience.title}</T></h3>
                        <p className="text-sm text-muted-foreground font-sans mb-4 flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-primary" /> {item.experience.location}
                        </p>
                        <p className="text-sm text-foreground font-medium mb-6"><T>{formatDate(item.date)}</T></p>
                        
                        <div className="mt-auto flex items-end justify-between">
                          <div className="flex flex-col gap-2">
                            <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground"><T>Viajeros</T></span>
                            <div className="flex items-center border border-border h-10">
                              <button className="px-3 hover:text-primary transition-colors" onClick={() => updateQuantity(item.packageId, item.date, item.people - 1)} disabled={item.people <= 1}><Minus className="w-3 h-3" /></button>
                              <span className="font-serif text-lg px-2 w-8 text-center">{item.people}</span>
                              <button className="px-3 hover:text-primary transition-colors" onClick={() => updateQuantity(item.packageId, item.date, item.people + 1)}><Plus className="w-3 h-3" /></button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-serif text-primary">{formatPrice(item.totalPrice)}</p>
                            <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-1"><T>IVA incluido</T></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="lg:col-span-5">
                <div className="bg-muted/10 border border-border p-8 sticky top-28">
                  <h2 className="text-[10px] uppercase tracking-[0.3em] font-medium text-foreground mb-8 pb-4 border-b border-border"><T>Resumen</T></h2>
                  <div className="flex justify-between items-end mb-10">
                    <span className="font-serif text-2xl text-foreground"><T>Total</T></span>
                    <span className="text-3xl font-serif text-primary">{formatPrice(cart.total)}</span>
                  </div>
                  <Link href={`/${locale}/checkout`} className="w-full h-16 bg-foreground text-background hover:bg-primary transition-all duration-300 flex items-center justify-center gap-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium"><T>Proceder al Pago</T></span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Icon helper missing in original but needed for close button
function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );
}