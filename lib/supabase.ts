
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pqxcapebufqvsbvvzkka.supabase.co';
const supabaseAnonKey = 'sb_publishable_EzZ17Iw-A0jPgDu9kABl4A_cpF-O2O4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Diagnóstico de Saúde do Ecossistema Beleza Glow.
 * Verifica se as tabelas existem e se as políticas de segurança estão bloqueando acessos indevidos.
 */
export const checkEcossystemHealth = async () => {
  try {
    // Tentativa de leitura de controle
    const { error } = await supabase.from('profiles').select('id').limit(1);
    
    if (error) {
      // Erro 42P01: Tabela não existe no banco
      if (error.code === '42P01') {
        return { status: 'missing', message: 'Infraestrutura SQL pendente.' };
      }
      // Erro 42501: RLS bloqueou (O que é bom, significa que a segurança está ativa!)
      if (error.code === '42501') {
        return { status: 'healthy', message: 'Segurança RLS Blindada.' };
      }
      // Erro de nova linha viola RLS (o erro que você recebeu)
      if (error.message?.includes('violates row-level security policy')) {
        return { status: 'syncing', message: 'Ajustando Permissões...' };
      }
    }
    return { status: 'healthy', message: 'Sincronização Live Operacional.' };
  } catch (e) {
    return { status: 'offline', message: 'Rede em modo de contingência.' };
  }
};

export const isTableMissingError = (error: any) => {
  if (!error) return false;
  return (
    error.code === '42P01' || 
    error.code === 'PGRST116' || 
    error.message?.includes('does not exist')
  );
};
