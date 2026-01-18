import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase(), isActive: true }
    })

    if (!user) {
      // Return success even if user doesn't exist to prevent email enumeration
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, you will receive password reset instructions.'
      })
    }

    // Generate reset token (64-character hex string)
    const resetToken = Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
    ).join('')

    // Hash the token for storage
    const hashedToken = hashPassword(resetToken)

    // Set expiration time (24 hours from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // Store the reset token in database
    await prisma.passwordResetToken.create({
      data: {
        email: email.toLowerCase(),
        token: hashedToken,
        expiresAt,
      }
    })

    // In a real application, you would send an email here
    // For now, we'll log the reset link to console
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/auth/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`
    
    console.log('=== PASSWORD RESET LINK ===')
    console.log(`Reset link for ${email}:`)
    console.log(resetUrl)
    console.log('===========================')

    // In production, you would integrate with an email service like:
    // - Nodemailer with SMTP
    // - SendGrid
    // - Amazon SES
    // - Resend
    // - Postmark

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, you will receive password reset instructions.'
    })

  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}