export interface Experience {
  id: string;
  title: string;
  category?: string;
  categorySlug?: string;
  description?: string;
  location: string;
  image_url: string;
  images?: string[];
  maxPeople?: number;
  basePrice: number;
  
}

export interface PackageLevel {
  id: string;
  name: string;
  multiplier: number;
  includes: string[];
}

export interface CartItem {
  experienceId: string;
  experience: Experience;
  date: string;
  people: number;
  packageLevel: PackageLevel;
  totalPrice: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface BillingInfo {
  rfc?: string;
  businessName?: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Reservation {
  id: string;
  items: CartItem[];
  contactInfo: ContactInfo;
  billingInfo: BillingInfo;
  total: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  createdAt: string;
}

export interface QuoteRequest {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  budget: string;
  requirements: string;
  contactInfo: ContactInfo;
  status: "pending" | "contacted" | "quoted" | "closed";
  createdAt: string;
}

export const PACKAGE_LEVELS: PackageLevel[] = [
  {
    id: "basico",
    name: "Básico",
    multiplier: 1,
    includes: [
      "Transporte incluido",
      "Guía local certificado",
      "Seguro de viaje básico",
      "Soporte por WhatsApp"
    ]
  },
  {
    id: "premium",
    name: "Premium",
    multiplier: 1.8,
    includes: [
      "Transporte premium",
      "Guía local certificado",
      "Seguro de viaje completo",
      "Hospedaje incluido",
      "Comidas típicas",
      "Soporte 24/7"
    ]
  },
  {
    id: "aventurero",
    name: "Aventurero",
    multiplier: 2.5,
    includes: [
      "Transporte VIP",
      "Guía personal dedicado",
      "Seguro premium todo riesgo",
      "Hospedaje 5 estrellas",
      "Todas las comidas",
      "Actividades exclusivas",
      "Recuerdos personalizados"
    ]
  }
];
