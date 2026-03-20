"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { MOCK_RESERVATIONS, MOCK_QUOTES } from "@/lib/data";
import {
  LogOut, Calendar, Users, DollarSign, TrendingUp,
  Clock, CheckCircle, XCircle, MessageSquare, Eye,
  ShoppingBag, FileText
} from "lucide-react";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/admin/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("es-MX", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
      pending: { variant: "outline", label: "Pendiente" },
      confirmed: { variant: "default", label: "Confirmado" },
      completed: { variant: "secondary", label: "Completado" },
      cancelled: { variant: "destructive", label: "Cancelado" },
      contacted: { variant: "secondary", label: "Contactado" },
      quoted: { variant: "default", label: "Cotizado" },
      closed: { variant: "secondary", label: "Cerrado" },
    };
    const style = styles[status] || { variant: "outline" as const, label: status };
    return <Badge variant={style.variant}>{style.label}</Badge>;
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/30">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Calculate stats
  const totalRevenue = MOCK_RESERVATIONS.reduce((sum, r) => sum + r.total, 0);
  const pendingReservations = MOCK_RESERVATIONS.filter(r => r.status === "pending").length;
  const pendingQuotes = MOCK_QUOTES.filter(q => q.status === "pending").length;

  return (
    <div className="min-h-screen bg-secondary/20">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white font-bold text-lg font-serif">V</span>
                </div>
                <span className="font-serif font-semibold hidden sm:inline">Viajes.mx</span>
              </Link>
              <Badge variant="secondary">Admin</Badge>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                Hola, {user?.name}
              </span>
              <Button variant="ghost" size="sm" onClick={logout} className="gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-semibold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Vista general del negocio
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Ingresos Totales</p>
                  <p className="text-2xl font-semibold">{formatPrice(totalRevenue)}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Reservaciones</p>
                  <p className="text-2xl font-semibold">{MOCK_RESERVATIONS.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Pendientes</p>
                  <p className="text-2xl font-semibold">{pendingReservations}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Cotizaciones</p>
                  <p className="text-2xl font-semibold">{MOCK_QUOTES.length}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Reservations */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-semibold">Últimas Reservaciones</h2>
                <Badge variant="outline">{MOCK_RESERVATIONS.length} total</Badge>
              </div>

              <div className="space-y-4">
                {MOCK_RESERVATIONS.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">
                          {reservation.contactInfo.firstName} {reservation.contactInfo.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {reservation.contactInfo.email}
                        </p>
                      </div>
                      {getStatusBadge(reservation.status)}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(reservation.createdAt)}
                      </span>
                      <span className="flex items-center gap-1">
                        <ShoppingBag className="w-4 h-4" />
                        {reservation.items.length} {reservation.items.length === 1 ? "experiencia" : "experiencias"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <span className="text-lg font-semibold text-primary">
                        {formatPrice(reservation.total)}
                      </span>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Eye className="w-4 h-4" />
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pending Quotes */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-serif font-semibold">Cotizaciones Pendientes</h2>
                <Badge variant="outline">{pendingQuotes} pendientes</Badge>
              </div>

              <div className="space-y-4">
                {MOCK_QUOTES.map((quote) => (
                  <div
                    key={quote.id}
                    className="p-4 rounded-lg border border-border hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium">
                          {quote.contactInfo.firstName} {quote.contactInfo.lastName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {quote.contactInfo.email}
                        </p>
                      </div>
                      {getStatusBadge(quote.status)}
                    </div>

                    <div className="mb-3">
                      <p className="text-sm font-medium flex items-center gap-1">
                        <span className="w-4 h-4">📍</span>
                        {quote.destination}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {quote.travelers} viajeros • {quote.budget}
                      </p>
                    </div>

                    {quote.requirements && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2 p-2 bg-secondary/50 rounded">
                        "{quote.requirements}"
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(quote.createdAt)}
                      </span>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <MessageSquare className="w-4 h-4" />
                        Responder
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
