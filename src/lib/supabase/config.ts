export const validateSupabaseConfig = () => {
    const requiredEnvVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY'
    ]

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName])

    if (missingVars.length > 0) {
        throw new Error(`
      Missing required environment variables:
      ${missingVars.join(', ')}
    `)
    }
}

// Ejecuta la validación al importar el módulo
validateSupabaseConfig()