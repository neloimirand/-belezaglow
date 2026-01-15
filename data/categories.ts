
import { Category } from '../types';

export const CATEGORIES: Category[] = [
  // FEMININAS
  {
    id: 'f-cabelo',
    nome: 'Cabelo',
    publico: 'feminino',
    ordem: 1,
    status: 'ativo',
    subcategorias: [
      'Corte feminino', 'Corte infantil', 'Corte com hidratação', 'Escova', 
      'Penteado para festa', 'Penteado noiva/madrinha', 'Hidratação capilar', 
      'Reconstrução capilar', 'Progressiva/Alisamento', 'Permanente/Cachos', 
      'Mechas/Luzes/Ombré Hair', 'Coloração total/parcial', 'Tonalização/Matização', 
      'Lavagem e tratamento capilar'
    ]
  },
  {
    id: 'f-unhas',
    nome: 'Unhas',
    publico: 'feminino',
    ordem: 2,
    status: 'ativo',
    subcategorias: [
      'Manicure básica', 'Manicure com esmaltação tradicional', 'Manicure com gel', 
      'Manicure francesa', 'Pedicure básica', 'Pedicure com gel', 
      'Alongamento de unhas (gel/acrílico)', 'Nail art/decoração'
    ]
  },
  {
    id: 'f-estetica-facial',
    nome: 'Estética Facial',
    publico: 'feminino',
    ordem: 3,
    status: 'ativo',
    subcategorias: [
      'Limpeza de pele', 'Hidratação facial', 'Peeling facial', 'Microdermoabrasão', 
      'Massagem facial', 'Tratamento antiacne', 'Tratamento anti-idade', 
      'Design de sobrancelhas', 'Depilação facial (sobrancelha, buço, queixo)'
    ]
  },
  {
    id: 'f-maquiagem',
    nome: 'Maquiagem',
    publico: 'feminino',
    ordem: 4,
    status: 'ativo',
    subcategorias: [
      'Maquiagem casual', 'Maquiagem para festa', 'Maquiagem noiva', 
      'Maquiagem profissional para fotos', 'Maquiagem temática/artística'
    ]
  },
  {
    id: 'f-depilacao',
    nome: 'Depilação Corporal',
    publico: 'feminino',
    ordem: 5,
    status: 'ativo',
    subcategorias: [
      'Depilação cera (pernas, axilas, braços)', 'Depilação íntima/completa', 'Depilação facial'
    ]
  },
  {
    id: 'f-spa',
    nome: 'SPA e Massagem',
    publico: 'feminino',
    ordem: 6,
    status: 'ativo',
    subcategorias: [
      'Massagem relaxante', 'Massagem modeladora', 'Massagem terapêutica', 
      'Aromaterapia', 'Reflexologia', 'Banho de ofurô ou hidromassagem'
    ]
  },
  {
    id: 'f-outros',
    nome: 'Outros Cuidados',
    publico: 'feminino',
    ordem: 7,
    status: 'ativo',
    subcategorias: [
      'Bronzeamento artificial', 'Tratamentos corporais', 'Micropigmentação', 
      'Alongamento de cílios', 'Lash lift', 'Design de sobrancelha + henna'
    ]
  },

  // MASCULINAS
  {
    id: 'm-cabelo',
    nome: 'Cabelo',
    publico: 'masculino',
    ordem: 1,
    status: 'ativo',
    subcategorias: [
      'Corte masculino', 'Corte infantil masculino', 'Corte com máquina ou tesoura', 
      'Corte degradê/fade', 'Barba e cabelo combinados', 'Hidratação capilar masculina', 
      'Coloração masculina', 'Raspar/desenho na cabeça'
    ]
  },
  {
    id: 'm-barba',
    nome: 'Barba',
    publico: 'masculino',
    ordem: 2,
    status: 'ativo',
    subcategorias: [
      'Aparar barba', 'Barba completa', 'Barba design/contorno', 
      'Hidratação e cuidados da barba', 'Barboterapia'
    ]
  },
  {
    id: 'm-unhas',
    nome: 'Unhas',
    publico: 'masculino',
    ordem: 3,
    status: 'ativo',
    subcategorias: [
      'Manicure masculina', 'Pedicure masculina', 'Alongamento ou tratamento de unhas'
    ]
  },
  {
    id: 'm-estetica-facial',
    nome: 'Estética Facial',
    publico: 'masculino',
    ordem: 4,
    status: 'ativo',
    subcategorias: [
      'Limpeza de pele masculina', 'Hidratação facial masculina', 
      'Peeling facial masculina', 'Depilação facial (sobrancelhas, buço)'
    ]
  },
  {
    id: 'm-depilacao',
    nome: 'Depilação Corporal',
    publico: 'masculino',
    ordem: 5,
    status: 'ativo',
    subcategorias: [
      'Depilação a cera (peito, costas, braços, pernas)', 'Depilação íntima masculina'
    ]
  },
  {
    id: 'm-spa',
    nome: 'SPA e Massagem',
    publico: 'masculino',
    ordem: 6,
    status: 'ativo',
    subcategorias: [
      'Massagem relaxante', 'Massagem desportiva', 'Massagem terapêutica', 'Banho relaxante/ofurô'
    ]
  },
  {
    id: 'm-outros',
    nome: 'Outros Cuidados',
    publico: 'masculino',
    ordem: 7,
    status: 'ativo',
    subcategorias: [
      'Micropigmentação masculina', 'Tratamento capilar antiqueda', 'Tratamento de pele masculina'
    ]
  }
];

export const getCategoriesByGender = (gender: 'feminino' | 'masculino') => {
  return CATEGORIES.filter(c => c.publico === gender && c.status === 'ativo').sort((a, b) => a.ordem - b.ordem);
};
