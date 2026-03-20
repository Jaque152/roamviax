"use client";

import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/CartContext";
import {
  Trash2, Minus, Plus, ShoppingCart, ArrowRight,
  Calendar, Users, MapPin, ShoppingBag
} from "lucide-react";
import {supabase} from '@/lib/supabase';

export default function CarritoPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-MX", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-semibold mb-2">
                Tu Carrito
              </h1>
              <p className="text-muted-foreground">
                {cart.items.length === 0
                  ? "No tienes experiencias en tu carrito"
                  : `${cart.items.length} ${cart.items.length === 1 ? "experiencia" : "experiencias"} seleccionadas`
                }
              </p>
            </div>
            {cart.items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Vaciar carrito
              </Button>
            )}
          </div>

          {cart.items.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="py-16 text-center">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                  <ShoppingCart className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-serif font-semibold mb-2">Tu carrito está vacío</h2>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  Explora nuestras experiencias y agrega las que más te gusten para comenzar tu aventura.
                </p>
                <Button asChild>
                  <Link href="/experiencias">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Explorar Experiencias
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                  <Card key={`${item.experienceId}-${item.date}`} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row">
                        {/* Image */}
                        <div className="w-full sm:w-48 h-48 sm:h-auto flex-shrink-0">
                          <img
                            src={item.experience.image_url || (item.experience.images && item.experience.images[0]) || '/placeholder.png'}
                            alt={item.experience.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 p-5">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                            <Badge variant="secondary" className="mb-2">
                              {item.experience.category || "General"}
                            </Badge>
                              <h3 className="text-lg font-serif font-semibold">
                                <Link href={`/experiencias/${item.experienceId}`} className="hover:text-primary transition-colors">
                                  {item.experience.title}
                                </Link>
                              </h3>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.experienceId, item.date)}
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                              title="Eliminar"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {item.experience.location}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDate(item.date)}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                              {/* People Selector */}
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-muted-foreground" />
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => updateQuantity(item.experienceId, item.date, Math.max(1, item.people - 1))}
                                  disabled={item.people <= 1}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">{item.people}</span>
                                {/* Botón de incremento (+) en el carrito */}
                                <Button
                                  variant="outline"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => 
                                    updateQuantity(
                                      item.experienceId, 
                                      item.date, 
                                      Math.min(item.experience.maxPeople ?? 20, item.people + 1)
                                    )
                                  }
                                  
                                  disabled={item.people >= (item.experience.maxPeople ?? 20)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>

                              {/* Package Badge */}
                              <Badge variant="outline" className="font-normal">
                                {item.packageLevel.name}
                              </Badge>
                            </div>

                            <div className="text-right">
                              <p className="text-xl font-semibold text-primary">
                                {formatPrice(item.totalPrice)}
                              </p>
                              <p className="text-xs text-muted-foreground">IVA incluido</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <Card className="sticky top-28">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-serif font-semibold mb-6">Resumen del Pedido</h2>

                    <div className="space-y-3 mb-6">
                      {cart.items.map((item) => (
                        <div key={`${item.experienceId}-${item.date}`} className="flex justify-between text-sm">
                          <span className="text-muted-foreground truncate pr-2">
                            {item.experience.title} ({item.people}p)
                          </span>
                          <span className="font-medium flex-shrink-0">{formatPrice(item.totalPrice)}</span>
                        </div>
                      ))}
                    </div>

                    <hr className="border-border mb-4" />

                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">{formatPrice(cart.subtotal)}</span>
                    </div>

                    <div className="flex justify-between text-lg font-semibold mb-6">
                      <span>Total</span>
                      <span className="text-primary">{formatPrice(cart.total)}</span>
                    </div>

                    <p className="text-xs text-center text-muted-foreground mb-4">
                      IVA incluido en todos los precios
                    </p>

                    <Button asChild className="w-full h-12 rounded-full text-base gap-2">
                      <Link href="/checkout">
                        Proceder al Pago
                        <ArrowRight className="w-5 h-5" />
                      </Link>
                    </Button>

                    <div className="mt-6 pt-6 border-t border-border">
                      <Link
                        href="/experiencias"
                        className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
                      >
                        Seguir explorando experiencias
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
