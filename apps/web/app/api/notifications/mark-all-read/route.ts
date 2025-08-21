import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest) {
  try {
    // Session is guaranteed by middleware
    const session = await auth.api.getSession({ headers: await headers() })
    
    if (!session) {
      throw new Error('Session not found after middleware authentication')
    }

    // Mark all unread notifications as read
    const result = await prisma.notification.updateMany({
      where: {
        userId: session.user.id,
        status: 'UNREAD',
      },
      data: {
        status: 'READ',
        readAt: new Date(),
      },
    })

    return NextResponse.json({
      message: 'All notifications marked as read',
      updatedCount: result.count,
    })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}