import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`)
  }

  const supabase = createRouteHandlerClient({ cookies })

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      throw error
    }

    return NextResponse.redirect(requestUrl.origin)

  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=auth_failed`
    )
  }
}