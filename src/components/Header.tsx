"use client";
import { T } from "@/components/T";
import { useLocale } from 'next-intl';
import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";

const navLinks = [
  { href: "/", label: <T>Inicio</T> },
  { href: "/experiencias", label: <T>Experiencias</T> },
  { href: "/#contacto", label: <T>Contacto</T> },
];

export function Header() {
  const locale = useLocale();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMiniCart, setShowMiniCart] = useState(false);
  const { cart, getItemCount } = useCart();
  const itemCount = getItemCount();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md">
        <div className="border-b border-border">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="flex items-center justify-between h-20">
              {/* Logo Roamviax */}
              <Link href={`/${locale}/`} className="flex items-center gap-3 group">
                <div className="w-12 h-12 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                   {/* Aquí va el isotipo de la R con la brújula */}
                  <img src="/logo 2.png" alt="Logo Roamviax" className="w-full h-full object-contain" />
                </div>
                <div className="hidden sm:flex flex-col">
                  <span className="text-2xl font-serif font-semibold tracking-tight leading-none text-foreground">roam<span className="text-primary italic">viax</span></span>
                  <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-1">Viajes de lujo </span>
                </div>
              </Link>

              {/* Center Navigation - Desktop */}
              <nav className="hidden lg:flex items-center gap-12">
                {navLinks.map((link, i) => (
                  <Link
                    key={i}
                    href={`/${locale}${link.href}`}
                    className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>

              {/* Right - Cart & Menu */}
              <div className="flex items-center gap-6">
                <div 
                  className="relative"
                  onMouseEnter={() => setShowMiniCart(true)}
                  onMouseLeave={() => setShowMiniCart(false)}
                >
                  <Link
                    href={`/${locale}/carrito`}
                    className="relative group flex items-center gap-2 text-foreground hover:text-primary transition-colors py-4"
                  >
                    <span className="hidden md:block text-xs uppercase tracking-[0.15em] font-medium">
                      <T>Carrito</T>
                    </span>
                    <div className="relative">
                      <ShoppingBag className="w-5 h-5" />
                      {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 w-4 h-4 bg-primary text-primary-foreground text-[9px] rounded-full flex items-center justify-center font-bold">
                          {itemCount}
                        </span>
                      )}
                    </div>
                  </Link>

                  {showMiniCart && (
                    <div className="absolute right-0 top-[100%] mt-0 w-80 bg-background border border-border shadow-2xl z-50">
                      <div className="p-4 border-b border-border bg-muted/30">
                        <h3 className="font-serif font-semibold text-sm uppercase tracking-widest"><T>Tu Carrito</T></h3>
                      </div>
                      {cart.items.length === 0 ? (
                        <div className="p-8 text-center text-xs uppercase tracking-widest text-muted-foreground">
                          <T>Tu carrito está vacío</T>
                        </div>
                      ) : (
                        <>
                          <div className="max-h-64 overflow-y-auto no-scrollbar">
                            {cart.items.slice(0, 3).map((item) => {
                              const miniImage = item.experience.images && item.experience.images.length > 0 ? item.experience.images[0] : '/placeholder.jpg';
                              return (
                                <div key={`${item.packageId}-${item.date}`} className="p-4 border-b border-border/50 hover:bg-muted/20 transition-colors">
                                  <div className="flex gap-4">
                                    <img src={miniImage} className="w-16 h-16 object-cover" alt={item.experience.title} />
                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                      <h4 className="text-sm font-serif font-medium truncate"><T>{item.experience.title}</T></h4>
                                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{item.people}p • <T>{item.levelName}</T></p>
                                      <p className="text-sm font-semibold text-primary mt-1">{formatPrice(item.totalPrice)}</p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          <div className="p-4">
                            <Link href={`/${locale}/carrito`} className="block w-full py-3 bg-foreground text-background text-center text-xs uppercase tracking-[0.2em] font-medium hover:bg-primary transition-colors">
                              <T>Ver Carrito</T>
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                  className="lg:hidden p-2 -mr-2 text-foreground"
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-label="Toggle menu"
                >
                  {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Marquee - Editorial Touch */}
        <div className="overflow-hidden border-b border-border py-2 bg-muted/30">
          <div className="animate-marquee">
            {/* Renderiza el array 8 veces para llenar pantallas grandes */}
            {[...Array(8)].map((_, i) => (
              <span key={i} className="inline-flex items-center gap-8 px-8 text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
                <span><T>Aventuras Auténticas</T></span>
                <span className="w-1 h-1 rounded-full bg-primary" />
                <span><T>México Mágico</T></span>
                <span className="w-1 h-1 rounded-full bg-primary" />
                <span><T>Travesías Exclusivas</T></span>
                <span className="w-1 h-1 rounded-full bg-primary" />
                <span>FIFA 2026</span>
                <span className="w-1 h-1 rounded-full bg-primary" />
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Mobile Menu - Full Screen Takeover */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-background lg:hidden animate-fade-in">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {navLinks.map((link, i) => (
              <Link key={i} href={`/${locale}${link.href}`} className="text-4xl font-serif italic text-foreground hover:text-primary transition-colors" onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
            <Link href={`/${locale}/cotizar`} className="text-4xl font-serif italic text-primary" onClick={() => setMenuOpen(false)}>
              <T>Cotizar</T>
            </Link>
          </div>
        </div>
      )}
      <div className="h-[108px]" />
    </>
  );
}