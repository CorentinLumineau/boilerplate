import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

export async function middleware(request: NextRequest) {
  // Single domain architecture - no CORS handling needed
  // All requests are same-origin, which simplifies authentication and security
  
  // Handle OPTIONS requests for API routes (minimal handling for potential edge cases)
  if (request.method === 'OPTIONS' && request.nextUrl.pathname.startsWith('/api')) {
    return new Response(null, { status: 200 })
  }

  const { pathname } = request.nextUrl

  // API route authentication - optimistic cookie check only
  if (pathname.startsWith('/api')) {
    // Skip authentication for public endpoints
    const publicEndpoints = ['/api/auth', '/api/health']
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      pathname.startsWith(endpoint)
    )
    
    if (!isPublicEndpoint) {
      // Optimistic check using cookie only (fast, no DB calls)
      const sessionCookie = getSessionCookie(request)
      
      if (!sessionCookie) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        )
      }
      
      // Note: This is optimistic authentication only
      // Full session verification still happens in individual API routes
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
}