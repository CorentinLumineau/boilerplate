import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Session is guaranteed by middleware
    const session = await auth.api.getSession({ headers: await headers() })
    
    if (!session) {
      throw new Error('Session not found after middleware authentication')
    }

    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        status: 'UNREAD',
      },
    })

    return NextResponse.json({ unreadCount })
  } catch (error) {
    console.error('Error fetching notification count:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}