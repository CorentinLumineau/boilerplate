import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  // Single domain architecture - no CORS handling needed
  // All requests are same-origin, which simplifies authentication and security
  
  // Handle OPTIONS requests for API routes (minimal handling for potential edge cases)
  if (request.method === 'OPTIONS' && request.nextUrl.pathname.startsWith('/api')) {
    return new Response(null, { status: 200 })
  }

  // Handle root path redirects
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/api')) {
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session) {
      return new Response(null, { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*']
}