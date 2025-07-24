import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(`
    Missing Supabase configuration!
    NEXT_PUBLIC_SUPABASE_URL: ${supabaseUrl ? 'configured' : 'missing'}
    NEXT_PUBLIC_SUPABASE_ANON_KEY: ${supabaseKey ? 'configured' : 'missing'}
    
    Please check your .env.local file
  `)
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    flowType: 'pkce',
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
})

export type Database = {} // Tipado de tu base de datos