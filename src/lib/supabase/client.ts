// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

// Validación mejorada de variables de entorno
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

if (!supabaseUrl || !supabaseKey) {
  const errorMessage = [
    '🚨 Missing Supabase configuration!',
    `NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? '***' + supabaseUrl.slice(-8) : 'undefined'}`,
    `NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? '***' + supabaseKey.slice(-4) : 'undefined'}`,
    '',
    'How to fix:',
    '1. Create a .env.local file in your project root',
    '2. Add your Supabase credentials:',
    '   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url',
    '   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key',
    '3. Restart your development server'
  ].join('\n');

  throw new Error(errorMessage);
}

// Configuración extendida del cliente Supabase
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // Mejor seguridad para autenticación
    storage: typeof window !== 'undefined' ? localStorage : undefined,
  },
  global: {
    headers: {
      'X-Client-Info': 'stop-game/1.0'
    }
  }
});

// Opcional: Tipado de la base de datos
export type Database = {}; // Reemplaza con tu tipado generado