import { supabase } from '@/lib/supabase/client'

export const AuthService = {
    async signInWithProvider(provider: 'google' | 'facebook' | 'apple') {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                redirectTo: AuthService.getRedirectUrl(),
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent'
                }
            }
        })

        if (error) throw AuthService.handleAuthError(error, provider)
        return data
    },

    async signOut() {
        const { error } = await supabase.auth.signOut()
        if (error) throw AuthService.handleAuthError(error, 'logout')
    },

    async getSession() {
        const { data, error } = await supabase.auth.getSession()
        if (error) throw AuthService.handleAuthError(error, 'get_session')
        return data.session
    },

    // Métodos "privados" (simulados)
    getRedirectUrl(): string {
        if (typeof window !== 'undefined') {
            return `${window.location.origin}/auth/callback`
        }
        return `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`
    },

    handleAuthError(error: unknown, context: string): Error {
        console.error(`Auth Error (${context}):`, error)
        return new Error(
            context === 'get_session'
                ? 'Error al verificar la sesión'
                : `Error al iniciar sesión con ${context}`
        )
    }
}