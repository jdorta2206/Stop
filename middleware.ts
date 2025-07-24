import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    // 1. Crear cliente Supabase
    const response = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res: response })

    // 2. Obtener sesión actual
    const { data: { session } } = await supabase.auth.getSession()

    // 3. Definir rutas públicas
    const publicPaths = [
        '/',
        '/login',
        '/auth/callback',
        '/_next/static',
        '/_next/image',
        '/favicon.ico'
    ]

    const isPublicPath = publicPaths.some(path =>
        request.nextUrl.pathname === path ||
        request.nextUrl.pathname.startsWith('/_next') ||
        /\.(ico|png|jpg|jpeg|svg)$/.test(request.nextUrl.pathname)
    )

    // 4. Redirigir si no hay sesión y no es ruta pública
    if (!session && !isPublicPath) {
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('from', request.nextUrl.pathname)
        return NextResponse.redirect(loginUrl)
    }

    return response
}

// 5. Configuración de rutas a proteger
export const config = {
    matcher: [
        /*
         * Protege todas las rutas excepto:
         * - Rutas API (/api/...)
         * - Archivos estáticos
         * - Rutas públicas definidas
         */
        '/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)'
    ]
}