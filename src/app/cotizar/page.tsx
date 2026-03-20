"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  MapPin, Calendar, Users, Wallet, MessageSquare,
  User, Mail, Phone, CheckCircle, Sparkles, Clock
} from "lucide-react";
import {supabase} from '@/lib/supabase';

const BUDGET_OPTIONS = [
  "Menos de $10,000 MXN",
  "$10,000 - $25,000 MXN",
  "$25,000 - $50,000 MXN",
  "$50,000 - $100,000 MXN",
  "Más de $100,000 MXN",
];

export default function CotizarPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    travelers: 2,
    budget: "",
    requirements: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Unir el nombre y apellido para que coincidan con la BD
      const customer_name = `${formData.firstName} ${formData.lastName}`.trim();
      
      const { data, error } = await supabase
        .from('custom_quotes')
        .insert([
          {
            customer_name: customer_name,
            customer_email: formData.email,
            phone: formData.phone,
            destination: formData.destination,
            start_date: formData.startDate,
            end_date: formData.endDate || null, // Por si no ponen fecha de regreso
            pax_qty: formData.travelers,
            budget: formData.budget, 
            special_requests: formData.requirements
          }
        ]);
        
      if (error) throw error;

      setShowSuccess(true);
    } catch (error: any) {
      // Este console.log es vital. Si falla, nos dirá EXACTAMENTE por qué
      console.error("Error detallado de Supabase:", error.message || error);
      alert(`Hubo un error: ${error.message || 'Intenta de nuevo.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.destination && formData.startDate &&
    formData.email && formData.firstName && formData.phone;

  // Get minimum date (tomorrow)
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-32 flex items-center justify-center px-4">
          <Card className="max-w-lg w-full">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-serif font-semibold mb-2">¡Solicitud Enviada!</h1>
              <p className="text-muted-foreground mb-6">
                Hemos recibido tu solicitud de cotización. Nuestro equipo de expertos
                te contactará en menos de 24 horas a <strong>{formData.email}</strong>.
              </p>
              <div className="p-4 bg-secondary/50 rounded-lg mb-6 text-left">
                <p className="text-sm text-muted-foreground mb-1">Número de solicitud</p>
                <p className="font-mono font-semibold text-lg">COT-{Date.now().toString(36).toUpperCase()}</p>
              </div>
              <Button asChild className="w-full">
                <Link href="/">Volver al Inicio</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-16 lg:py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="outline" className="mb-4 rounded-full px-4 py-1 border-primary/30 text-primary">
                <Sparkles className="w-3 h-3 mr-1" />
                Viaje a Tu Medida
              </Badge>
              <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6">
                Diseñamos tu{" "}
                <span className="text-gradient">aventura perfecta</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Cuéntanos sobre el viaje de tus sueños y nuestros expertos crearán
                un itinerario único adaptado a tus gustos y presupuesto.
              </p>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8 max-w-4xl">
            <form onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Trip Details */}
                <Card className="md:col-span-2">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-serif font-semibold mb-6 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      Detalles del Viaje
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-2 block">
                          ¿A dónde quieres ir? *
                        </label>
                        <Input
                          value={formData.destination}
                          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                          placeholder="Ej: Oaxaca, Riviera Maya, Baja California..."
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          Fecha de inicio *
                        </label>
                        <Input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          min={minDateStr}
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          Fecha de regreso
                        </label>
                        <Input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          min={formData.startDate || minDateStr}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          Número de viajeros
                        </label>
                        <Input
                          type="number"
                          value={formData.travelers}
                          onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value) || 1 })}
                          min={1}
                          max={50}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                          <Wallet className="w-4 h-4 text-muted-foreground" />
                          Presupuesto estimado
                        </label>
                        <select
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                        >
                          <option value="">Selecciona un rango</option>
                          {BUDGET_OPTIONS.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          Requerimientos especiales
                        </label>
                        <Textarea
                          value={formData.requirements}
                          onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                          placeholder="Cuéntanos más sobre lo que buscas: tipo de experiencias, necesidades especiales, intereses, alergias alimentarias, etc."
                          rows={4}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Contact Info */}
                <Card className="md:col-span-2">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-serif font-semibold mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Datos de Contacto
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Nombre *</label>
                        <Input
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          placeholder="Tu nombre"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Apellidos</label>
                        <Input
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          placeholder="Tus apellidos"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          Correo electrónico *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="tu@email.com"
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          Teléfono *
                        </label>
                        <Input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+52 55 1234 5678"
                          required
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Submit */}
                <div className="md:col-span-2">
                  <Card className="bg-secondary/30 border-primary/20">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">Respuesta en menos de 24 horas</p>
                            <p className="text-sm text-muted-foreground">
                              Nuestro equipo se pondrá en contacto contigo
                            </p>
                          </div>
                        </div>
                        <Button
                          type="submit"
                          size="lg"
                          className="w-full md:w-auto rounded-full px-8"
                          disabled={!isFormValid || isSubmitting}
                        >
                          {isSubmitting ? "Enviando..." : "Solicitar Cotización"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
