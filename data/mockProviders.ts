
import { ProviderProfile } from '../types';

export const MOCK_PROVIDERS: ProviderProfile[] = [
  {
    id: '1',
    userId: 'u1',
    businessName: 'L’Atelier Beauty Luanda',
    location: { address: 'Avenida Lenine, Edifício Crystal', latitude: -8.8399, longitude: 13.2355 },
    rating: 4.9,
    reviewCount: 342,
    bio: 'Alta costura em estética. Especialistas em transformações capilares e visagismo internacional.',
    openingHours: '09:00 - 20:00',
    hasActiveSubscription: true,
    planTier: 'GOLD',
    employees: [
      { id: 'emp1', name: 'Carla Silva', role: 'Master Hairstylist', photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200', commission: 30, phone: '923000111' },
      { id: 'emp2', name: 'Mauro Vaz', role: 'Colorista Senior', photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200', commission: 25, phone: '923000222' }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=1000&auto=format&fit=crop'
    ],
    services: [
      { id: 's1', providerId: '1', name: 'Tranças de Elite', price: 25000, durationMinutes: 180, categoryId: 'f-cabelo', subcategoria: 'Penteado noiva/madrinha', locationStrategy: 'onsite' },
      { id: 's2', providerId: '1', name: 'Glow Facial Treatment', price: 18000, durationMinutes: 90, categoryId: 'f-estetica-facial', subcategoria: 'Limpeza de pele', locationStrategy: 'onsite' },
    ]
  },
  {
    id: '2',
    userId: 'u2',
    businessName: 'The Gent’s Club Talatona',
    location: { address: 'Via AL-12, Talatona Center', latitude: -8.9200, longitude: 13.1800 },
    rating: 5.0,
    reviewCount: 189,
    bio: 'Experiência sensorial masculina. Barboterapia clássica com toalhas quentes e destilados premium.',
    openingHours: '08:00 - 21:00',
    hasActiveSubscription: true,
    planTier: 'GOLD',
    employees: [
      { id: 'emp3', name: 'Bruno M.', role: 'Barbeiro Chefe', photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', commission: 40, phone: '923000333' }
    ],
    portfolio: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1599351431247-f10b21ce963f?q=80&w=1000&auto=format&fit=crop'
    ],
    services: [
      { id: 's3', providerId: '2', name: 'Corte Executive Fade', price: 9000, durationMinutes: 60, categoryId: 'm-cabelo', subcategoria: 'Corte degradê/fade', locationStrategy: 'onsite' },
    ]
  },
  {
    id: '3',
    userId: 'u3',
    businessName: 'Maison de l’Ongle',
    location: { address: 'Maianga, Rua da Missão', latitude: -8.8350, longitude: 13.2310 },
    rating: 4.8,
    reviewCount: 521,
    bio: 'A arte do design de unhas em Luanda. Especialistas em Bio-Gel e Soft Gel minimalista.',
    openingHours: '10:00 - 19:00',
    hasActiveSubscription: true,
    planTier: 'SILVER',
    portfolio: [
      'https://images.unsplash.com/photo-1604654894610-df490668711d?q=80&w=1000&auto=format&fit=crop'
    ],
    services: [
      { id: 's4', providerId: '3', name: 'Manicure Minimalista Luxe', price: 12000, durationMinutes: 60, categoryId: 'f-unhas', subcategoria: 'Manicure com gel', locationStrategy: 'onsite' },
    ]
  }
];
