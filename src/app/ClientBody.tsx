"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

export function ClientBody({ children }: { children: ReactNode }) {
  return (
    <body className="antialiased" suppressHydrationWarning>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </body>
  );
}
