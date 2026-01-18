import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Define the secret key for JWT verification
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_jwt_secret_for_development'
)

export async function middleware(request: NextRequest) {
  // Define the path that should be accessible without authentication
  const publicPaths = ['/admin/login']
  
  // Check if the current path is public
  const isPublicPath = publicPaths.some(path => 
    request.nextUrl.pathname === path || 
    request.nextUrl.pathname.startsWith(path + '/')
  )
  
  // If it's a public path, allow access
  if (isPublicPath) {
    return NextResponse.next()
  }
  
  // Check if it's an admin path that requires authentication
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Get the token from cookies
    const token = request.cookies.get('auth_token')?.value
    
    if (!token) {
      // Redirect to login if no token
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    
    try {
      // Verify the token
      await jwtVerify(token, JWT_SECRET)
      // Token is valid, allow access
      return NextResponse.next()
    } catch (error) {
      // Token is invalid, redirect to login
      console.error('Token verification failed:', error)
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  
  // For non-admin paths, allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    // Specifically include admin routes
    '/admin/:path*',
  ],
}