import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/database'
import { hashPassword, verifyPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { token, email, newPassword } = await request.json()

    if (!token || !email || !newPassword) {
      return NextResponse.json(
        { error: 'Token, email, and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      )
    }

    // Find the reset token
    const resetRecord = await prisma.passwordResetToken.findFirst({
      where: {
        email: email.toLowerCase(),
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    if (!resetRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      )
    }

    // Check if token has expired
    if (resetRecord.expiresAt < new Date()) {
      // Clean up expired token
      await prisma.passwordResetToken.delete({
        where: { id: resetRecord.id }
      })
      
      return NextResponse.json(
        { error: 'Reset token has expired. Please request a new one.' },
        { status: 400 }
      )
    }

    // Verify the token
    if (!verifyPassword(token, resetRecord.token)) {
      return NextResponse.json(
        { error: 'Invalid reset token' },
        { status: 400 }
      )
    }

    // Find the user
    const user = await prisma.user.findUnique({
      where: { 
        email: email.toLowerCase(),
        isActive: true 
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Hash the new password
    const newPasswordHash = hashPassword(newPassword)

    // Update user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        passwordHash: newPasswordHash,
        updatedAt: new Date()
      }
    })

    // Delete the used reset token
    await prisma.passwordResetToken.delete({
      where: { id: resetRecord.id }
    })

    // Clean up any other expired tokens for this email
    await prisma.passwordResetToken.deleteMany({
      where: {
        email: email.toLowerCase(),
        expiresAt: {
          lt: new Date()
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully'
    })

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}