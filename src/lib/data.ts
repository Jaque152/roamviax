import type { Reservation, QuoteRequest,PackageLevel } from "./types";

export const MOCK_RESERVATIONS: Reservation[] = []; 
export const MOCK_QUOTES: QuoteRequest[] = [];

export const CATEGORIES = [
  { name: "Naturaleza", slug: "naturaleza", count: 2 },
  { name: "Aventura", slug: "aventura", count: 3 },
  { name: "Cultura", slug: "cultura", count: 2 },
  { name: "Gastronomía", slug: "gastronomia", count: 1 }
];
