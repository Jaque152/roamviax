// src/components/Footer.tsx
"use client";

import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              {/* Logo en lugar de la V genérica */}
              <div className="w-12 h-12 flex items-center justify-center bg-white/10 rounded-lg p-1">
                <img src="/logo 2.png" alt="Logo DTour" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="text-xl font-serif font-semibold text-background">Viajes</span>
                <span className="text-xl font-serif font-light text-primary">.mx</span>
              </div>
            </div>
            <p className="text-background/60 mb-6 max-w-md">
              Diseñamos experiencias personalizadas donde tú eres el protagonista.
            </p>
            {/* ... Resto de logos de Visa/Mastercard que ya tienes ... */}
          </div>
          {/* ... Enlaces y contacto se mantienen ... */}
        </div>
        <div className="border-t border-background/10 pt-8 text-center md:text-left">
           <p className="text-sm text-background/40">© {new Date().getFullYear()} Viajes.mx - Ingeniería de Sistemas IPN</p>
        </div>
      </div>
    </footer>
  );
}