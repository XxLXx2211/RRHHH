import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { chatMessageStore, userStatusTracker } from '@/lib/chat/real-time-events'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const roomId = searchParams.get('roomId')

    if (!roomId) {
      return NextResponse.json({ error: 'Room ID required' }, { status: 400 })
    }

    // Update user's last seen
    userStatusTracker.updateLastSeen(session.user.id!)

    // Get messages from store
    const roomMessages = chatMessageStore.getMessages(roomId)

    console.log(`[CHAT API] GET messages for room ${roomId}:`, roomMessages.length, 'messages')

    return NextResponse.json(roomMessages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, chatRoomId, messageType = 'text' } = body

    if (!content || !chatRoomId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create new message
    const newMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      senderId: session.user.id!,
      senderName: session.user.name!,
      senderRole: session.user.role!,
      timestamp: new Date().toISOString(),
      chatRoomId,
      messageType,
      isEdited: false
    }

    console.log(`[CHAT API] Creating new message:`, newMessage)

    // Add to store (this will broadcast to all connected clients)
    const savedMessage = chatMessageStore.addMessage(newMessage)

    console.log(`[CHAT API] Message saved:`, savedMessage.id)

    // Update user status
    userStatusTracker.setUserOnline(session.user.id!)

    return NextResponse.json(savedMessage, { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { messageId, content } = body

    if (!messageId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Find message in store
    const allMessages = chatMessageStore.getAllMessages()
    let foundMessage = null

    for (const [roomId, messages] of allMessages.entries()) {
      foundMessage = messages.find(msg => msg.id === messageId)
      if (foundMessage) break
    }

    if (!foundMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Only allow editing own messages or admin
    if (foundMessage.senderId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update message in store (this will broadcast to all connected clients)
    const updatedMessage = chatMessageStore.updateMessage(messageId, {
      content,
      isEdited: true,
      editedAt: new Date().toISOString()
    })

    return NextResponse.json(updatedMessage)
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const messageId = searchParams.get('messageId')

    if (!messageId) {
      return NextResponse.json({ error: 'Message ID required' }, { status: 400 })
    }

    // Find message in store
    const allMessages = chatMessageStore.getAllMessages()
    let foundMessage = null

    for (const [roomId, messages] of allMessages.entries()) {
      foundMessage = messages.find(msg => msg.id === messageId)
      if (foundMessage) break
    }

    if (!foundMessage) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Only allow deleting own messages or admin
    if (foundMessage.senderId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Delete message from store (this will broadcast to all connected clients)
    const deleted = chatMessageStore.deleteMessage(messageId)

    if (deleted) {
      return NextResponse.json({ message: 'Message deleted successfully' })
    } else {
      return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
