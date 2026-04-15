'use client';
import { T } from "@/components/T";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Loader2, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Guardar en Supabase
      const { error: dbError } = await supabase.from("contact_messages").insert([
        { full_name: formData.name, email: formData.email, phone: formData.phone, message: formData.message },
      ]);
      if (dbError) throw dbError;

      // 2. Enviar correo vía API
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CONTACT",
          customerName: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result?.error || "No se pudo enviar el correo");

      alert("¡Mensaje enviado con éxito! Nos pondremos en contacto pronto.");
      setFormData({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      console.error("Error al enviar:", error);
      alert("Hubo un error al enviar tu mensaje. Intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-16 lg:py-24 bg-muted/20 border-t border-border">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Left - Info */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-4 mb-8">
              <span className="w-8 h-[1px] bg-foreground/30"></span>
              <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-muted-foreground">
                <T>Próximos Destinos</T>
              </p>
            </div>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[0.95] mb-8 text-foreground">
              <span className="block"><T>Comencemos</T></span>
              <span className="block italic text-primary"><T>a planear</T></span>
            </h2>

            <p className="text-base md:text-lg text-muted-foreground mb-16 max-w-md leading-relaxed font-sans">
              <T>Cuidamos cada aspecto de tu itinerario para garantizar una experiencia irrepetible y sin contratiempos. Estamos preparados para hacer realidad el viaje de tus sueños.</T>
            </p>

            {/* Contact Info */}
            <div className="space-y-10">
              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 border border-foreground/20 flex items-center justify-center flex-shrink-0 group-hover:border-primary transition-colors">
                  <Mail className="w-4 h-4 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground mb-2"><T>Email</T></p>
                  <a href="mailto:contacto@roamviax.com" className="text-foreground hover:text-primary transition-colors font-serif text-lg">
                    contacto@roamviax.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 border border-foreground/20 flex items-center justify-center flex-shrink-0 group-hover:border-primary transition-colors">
                  <Phone className="w-4 h-4 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground mb-2"><T>Teléfono</T></p>
                  <a href="tel:+525555555555" className="text-foreground hover:text-primary transition-colors font-serif text-lg">
                    +52 55 5555 5555
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-12 h-12 border border-foreground/20 flex items-center justify-center flex-shrink-0 group-hover:border-primary transition-colors">
                  <MapPin className="w-4 h-4 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground mb-2"><T>Ubicación</T></p>
                  <p className="text-foreground font-serif text-lg">Ciudad de México, México</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Minimalist Form */}
          <div className="bg-background p-8 lg:p-14 border border-border shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground mb-3 block">
                  <T>Nombre</T> <span className="text-primary">*</span>
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="h-12 border-0 border-b border-foreground/20 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-foreground placeholder:text-muted-foreground/50"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground mb-3 block">
                  <T>Teléfono</T> <span className="text-primary">*</span>
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="h-12 border-0 border-b border-foreground/20 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-foreground placeholder:text-muted-foreground/50"
                  placeholder="+52 55 0000 0000"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground mb-3 block">
                  <T>Email</T> <span className="text-primary">*</span>
                </label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="h-12 border-0 border-b border-foreground/20 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-foreground placeholder:text-muted-foreground/50"
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-3">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground">
                    <T>Mensaje</T>
                  </label>
                  <span className="text-[10px] text-muted-foreground/70 tracking-widest">
                    {formData.message.length} / 180
                  </span>
                </div>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  maxLength={180}
                  className="border-0 border-b border-foreground/20 bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary text-foreground resize-none placeholder:text-muted-foreground/50"
                  placeholder="Cuéntanos sobre el viaje de tus sueños..."
                />
              </div>

              <button
                type="submit"
                disabled={!formData.name || !formData.email || !formData.phone || isSubmitting}
                className="w-full h-16 bg-foreground text-background hover:bg-primary transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-4 mt-4"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <>
                    <span className="text-[10px] uppercase tracking-[0.2em] font-medium">
                      <T>Enviar mensaje</T>
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}