"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { CartItem, Cart, Experience, PackageLevel } from "@/lib/types";

interface CartContextType {
  cart: Cart;
  addToCart: (item: Omit<CartItem, "totalPrice">) => void;
  removeFromCart: (experienceId: string, date: string) => void;
  updateQuantity: (experienceId: string, date: string, people: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const calculateItemTotal = (basePrice: number, people: number, multiplier: number): number => {
  return basePrice * people * multiplier;
};

const calculateCartTotals = (items: CartItem[]): { subtotal: number; total: number } => {
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  return { subtotal, total: subtotal }; // Could add taxes or fees here
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart>({ items: [], subtotal: 0, total: 0 });
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("viajes-mx-cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        setCart(parsed);
      } catch (e) {
        console.error("Error parsing cart:", e);
      }
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("viajes-mx-cart", JSON.stringify(cart));
    }
  }, [cart, isHydrated]);

  const addToCart = (item: Omit<CartItem, "totalPrice">) => {
    setCart((prev) => {
      // Check if item already exists
      const existingIndex = prev.items.findIndex(
        (i) => i.experienceId === item.experienceId && i.date === item.date
      );

      let newItems: CartItem[];

      if (existingIndex >= 0) {
        // Update existing item
        newItems = [...prev.items];
        const totalPrice = calculateItemTotal(
          item.experience.basePrice,
          item.people,
          item.packageLevel.multiplier
        );
        newItems[existingIndex] = { ...item, totalPrice };
      } else {
        // Add new item
        const totalPrice = calculateItemTotal(
          item.experience.basePrice,
          item.people,
          item.packageLevel.multiplier
        );
        newItems = [...prev.items, { ...item, totalPrice }];
      }

      const totals = calculateCartTotals(newItems);
      return { items: newItems, ...totals };
    });
  };

  const removeFromCart = (experienceId: string, date: string) => {
    setCart((prev) => {
      const newItems = prev.items.filter(
        (item) => !(item.experienceId === experienceId && item.date === date)
      );
      const totals = calculateCartTotals(newItems);
      return { items: newItems, ...totals };
    });
  };

  const updateQuantity = (experienceId: string, date: string, people: number) => {
    setCart((prev) => {
      const newItems = prev.items.map((item) => {
        if (item.experienceId === experienceId && item.date === date) {
          const totalPrice = calculateItemTotal(
            item.experience.basePrice,
            people,
            item.packageLevel.multiplier
          );
          return { ...item, people, totalPrice };
        }
        return item;
      });
      const totals = calculateCartTotals(newItems);
      return { items: newItems, ...totals };
    });
  };

  const clearCart = () => {
    setCart({ items: [], subtotal: 0, total: 0 });
  };

  const getItemCount = () => {
    return cart.items.length;
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, getItemCount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
