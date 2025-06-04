import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { userStatusTracker } from '@/lib/chat/real-time-events'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status } = body

    if (status === 'online') {
      userStatusTracker.setUserOnline(session.user.id!)
    } else if (status === 'offline') {
      userStatusTracker.setUserOffline(session.user.id!)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating user status:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const onlineUsers = userStatusTracker.getOnlineUsers()
    
    return NextResponse.json({ onlineUsers })
  } catch (error) {
    console.error('Error getting online users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
