
export enum UserRole {
  CLIENT = 'CLIENT',
  PROFESSIONAL = 'PROFESSIONAL',
  SALON = 'SALON',
  ADMIN = 'ADMIN'
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED'
}

export type GenderTarget = 'feminino' | 'masculino' | 'unissex';

export interface Coupon {
  id: string;
  code: string;
  discountPercent: number;
  validUntil: string;
  type: 'PLATFORM' | 'PROVIDER';
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
  phone?: string;
  photoUrl?: string;
  isVerified: boolean;
  status: 'active' | 'suspended' | 'blocked';
  glowPoints?: number;
  // planTier added to fix missing property errors in AdminDashboard and ensure consistency with UserProfile
  planTier?: PlanTier;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  benefits: string[];
  target: 'PROFESSIONAL' | 'SALON';
}

export interface Service {
  id: string;
  providerId: string;
  name: string;
  price: number;
  durationMinutes: number;
  categoryId: string;
  subcategoria?: string;
  locationStrategy?: 'onsite' | 'offsite' | 'both';
  assignedEmployeeIds?: string[];
  benefits?: string;
  specification?: string; // Novo campo solicitado
  photoUrl?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  commission: number;
  phone: string;
  photoUrl: string;
  location?: { address: string; latitude: number; longitude: number; };
  services?: string[];
  isPro?: boolean;
}

export interface Category {
  id: string;
  nome: string;
  publico: GenderTarget;
  ordem: number;
  status: 'ativo' | 'inativo';
  subcategorias: string[];
}

export interface GalleryItem {
  id: string;
  url: string;
  description?: string;
}

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

export interface ProviderProfile {
  id: string;
  userId: string;
  businessName: string;
  location: { address: string; latitude: number; longitude: number; };
  services: Service[];
  rating: number;
  reviewCount: number;
  portfolio: string[];
  planTier?: PlanTier;
  bio: string;
  openingHours?: string;
  employees?: Employee[];
  hasActiveSubscription?: boolean;
}

export type PlanTier = 'FREE' | 'SILVER' | 'GOLD' | 'ANNUAL' | 'DIAMOND' | 'BLACK';
