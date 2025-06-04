import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { chatMessageStore } from '@/lib/chat/real-time-events'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')
    const since = searchParams.get('since')

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID required' }, { status: 400 })
    }

    let messages
    if (since) {
      // Get messages since timestamp
      messages = chatMessageStore.getMessagesSince(roomId, since)
      console.log(`[CHAT POLL] Getting messages since ${since} for room ${roomId}: ${messages.length} new messages`)
    } else {
      // Get all messages
      messages = chatMessageStore.getMessages(roomId)
      console.log(`[CHAT POLL] Getting all messages for room ${roomId}: ${messages.length} messages`)
    }
    
    return NextResponse.json({
      messages,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error in chat poll:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
