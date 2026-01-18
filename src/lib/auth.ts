import { cookies } from 'next/headers'
import { jwtVerify, SignJWT } from 'jose'
import { prisma } from './database'
import { createHash } from 'crypto'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_jwt_secret_for_development'
)

export interface SessionPayload {
  userId: string
  email: string
  role: string
  iat: number
  exp: number
}

// Simple password hashing (in production, use bcrypt)
export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  return hashPassword(password) === hashedPassword
}

export async function createSession(userId: string, email: string, role: string) {
  const iat = Math.floor(Date.now() / 1000)
  const exp = iat + 7 * 24 * 60 * 60 // 7 days

  const token = await new SignJWT({ userId, email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(JWT_SECRET)

  // Await the cookies promise
  const cookieStore = await cookies()
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60, // 7 days
    path: '/',
    sameSite: 'strict',
  })

  return token
}

export async function getSession() {
  // Await the cookies promise
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  
  if (!token) {
    return null
  }

  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    // Cast the payload to our SessionPayload type
    return verified.payload as unknown as SessionPayload
  } catch (error) {
    console.error('Token verification failed:', error)
    return null
  }
}

export async function destroySession() {
  // Await the cookies promise
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
}

export async function authenticateAdmin(email: string, password: string) {
  // Hash the provided password
  const hashedPassword = hashPassword(password)
  
  // Find user in database
  const user = await prisma.user.findUnique({
    where: { 
      email,
      isActive: true 
    }
  })

  if (!user) {
    return null
  }

  // Check if user has admin role
  if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
    return null
  }

  // Verify password
  if (user.passwordHash && !verifyPassword(password, user.passwordHash)) {
    return null
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  }
}

export async function requireAuth(redirect = true) {
  const session = await getSession()
  
  if (!session) {
    if (redirect) {
      // Import here to avoid circular dependencies
      const { redirect } = await import('next/navigation')
      redirect('/admin/login')
    }
    return null
  }
  
  return session
}

export async function requireAdmin(redirect = true) {
  const session = await requireAuth(redirect)
  
  if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
    if (redirect) {
      const { redirect } = await import('next/navigation')
      redirect('/admin/login')
    }
    return null
  }
  
  return session
}
