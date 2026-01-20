
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pqxcapebufqvsbvvzkka.supabase.co';
const supabaseAnonKey = 'sb_publishable_EzZ17Iw-A0jPgDu9kABl4A_cpF-O2O4';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const stringifySupabaseError = (error: any): string => {
  if (!error) return 'Operação concluída.';
  if (typeof error === 'string') return error;
  
  if (error.message === 'Failed to fetch' || error.message?.includes('NetworkError')) {
    return 'Sinal de Rede Fraco em Luanda.';
  }

  const msg = error.message || error.details || error.hint || error.msg;
  const code = error.code ? `[ID:${error.code}] ` : '';

  if (msg && typeof msg === 'string') {
    return `${code}${msg}`;
  }

  return 'Erro de integridade de dados.';
};

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
