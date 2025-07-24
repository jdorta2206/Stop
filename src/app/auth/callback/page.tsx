'use client'

import { useEffect } from 'react'
import { redirect } from 'next/navigation'
import { AuthService } from '@/services/auth'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function AuthCallbackPage() {
    useEffect(() => {
        const handleAuth = async () => {
            try {
                const session = await AuthService.getSession()

                if (!session) {
                    throw new Error('No active session found. Please login again.')
                }

                // Lógica adicional opcional (ej: registro de primer login)
                // await trackFirstLogin(session.user.id)

                redirect('/dashboard')

            } catch (error) {
                console.error('Authentication callback failed:', error)

                let errorMessage = 'Authentication failed'

                if (error instanceof Error) {
                    errorMessage = error.message
                } else if (typeof error === 'string') {
                    errorMessage = error
                }

                redirect(`/login?error=${encodeURIComponent(errorMessage)}&from=callback`)
            }
        }

        handleAuth()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []) // Dependencias vacías para ejecutar solo en mount

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-lg font-medium text-gray-600">Processing authentication...</p>
        </div>
    )
}