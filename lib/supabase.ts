
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pqxcapebufqvsbvvzkka.supabase.co';
const supabaseAnonKey = 'sb_publishable_EzZ17Iw-A0jPgDu9kABl4A_cpF-O2O4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Converte erros complexos do Supabase/Postgres em mensagens legíveis.
 */
export const stringifySupabaseError = (error: any): string => {
  if (!error) return 'Erro desconhecido no ecossistema.';
  if (typeof error === 'string') return error;
  
  if (error.message === 'Failed to fetch' || error.message?.includes('NetworkError')) {
    return 'Sinal de Rede Fraco: Verifique sua conexão em Luanda.';
  }

  const msg = error.message || error.details || error.hint || error.msg;
  const code = error.code ? `[ID:${error.code}] ` : '';

  if (msg && typeof msg === 'string') {
    return `${code}${msg}`;
  }

  try {
    const stringified = JSON.stringify(error);
    return stringified === '{}' ? `Erro técnico: ${error.toString()}` : stringified;
  } catch {
    return 'Erro de integridade de dados no servidor.';
  }
};

/**
 * Detecta se o erro é especificamente de tabela inexistente (Schema desatualizado)
 */
export const isTableMissingError = (error: any) => {
  if (!error) return false;
  const msg = stringifySupabaseError(error).toLowerCase();
  const code = String(error.code || '');
  return (
    code === '42P01' || 
    code === 'PGRST204' || 
    code === 'PGRST205' ||
    msg.includes('does not exist') || 
    msg.includes('not found') ||
    msg.includes('schema cache')
  );
};
