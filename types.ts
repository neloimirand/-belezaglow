
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
  planTier?: PlanTier;
}

export interface Service {
  id: string;
  providerId: string;
  name: string;
  price: number;
  durationMinutes: number;
  categoryId: string;
  specification?: string;
  photoUrl?: string;
  subcategoria?: string;
  locationStrategy?: 'onsite' | 'home';
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  phone?: string;
  photoUrl?: string;
  commissionPercent: number;
  active: boolean;
  services: Service[];
  location?: { 
    address: string; 
    latitude: number; 
    longitude: number; 
  };
}

export interface Category {
  id: string;
  nome: string;
  publico: GenderTarget;
  ordem: number;
  status: 'ativo' | 'inativo';
  subcategorias: string[];
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
