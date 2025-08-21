import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

export async function middleware(request: NextRequest) {
  // Single domain architecture - no CORS handling needed
  // All requests are same-origin, which simplifies authentication and security
  
  // Handle OPTIONS requests for API routes (minimal handling for potential edge cases)
  if (request.method === 'OPTIONS' && request.nextUrl.pathname.startsWith('/api')) {
    return new Response(null, { status: 200 })
  }

  const { pathname } = request.nextUrl

  // API route authentication
  if (pathname.startsWith('/api')) {
    // Skip authentication for public endpoints
    const publicEndpoints = ['/api/auth', '/api/health']
    const isPublicEndpoint = publicEndpoints.some(endpoint => 
      pathname.startsWith(endpoint)
    )
    
    if (!isPublicEndpoint) {
      try {
        const session = await auth.api.getSession({
          headers: await headers()
        })

        if (!session) {
          return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
          )
        }
      } catch (error) {
        console.error('Middleware auth error:', error)
        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 401 }
        )
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/:path*', '/((?!_next/static|_next/image|favicon.ico).*)'],
}