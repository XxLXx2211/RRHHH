import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// In-memory storage for chat messages (in production, use a real database)
let chatMessages: any[] = [
  {
    id: '1',
    content: '¡Bienvenidos al chat interno de CandidatoScope! 🎉',
    senderId: '1',
    senderName: 'Administrador',
    senderRole: 'admin',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    chatRoomId: '1',
    messageType: 'text'
  },
  {
    id: '2',
    content: 'Perfecto, ya podemos coordinar mejor el proceso de reclutamiento.',
    senderId: '2',
    senderName: 'Reclutador',
    senderRole: 'recruiter',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    chatRoomId: '1',
    messageType: 'text'
  },
  {
    id: '3',
    content: 'Excelente herramienta para mantener la comunicación fluida entre equipos.',
    senderId: '3',
    senderName: 'María García',
    senderRole: 'manager',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    chatRoomId: '1',
    messageType: 'text'
  }
]

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

    // Filter messages by room
    const roomMessages = chatMessages.filter(msg => msg.chatRoomId === roomId)
    
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
      id: (chatMessages.length + 1).toString(),
      content,
      senderId: session.user.id!,
      senderName: session.user.name!,
      senderRole: session.user.role!,
      timestamp: new Date().toISOString(),
      chatRoomId,
      messageType,
      isEdited: false
    }

    chatMessages.push(newMessage)

    return NextResponse.json(newMessage, { status: 201 })
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

    const messageIndex = chatMessages.findIndex(msg => msg.id === messageId)
    if (messageIndex === -1) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    const message = chatMessages[messageIndex]
    
    // Only allow editing own messages or admin
    if (message.senderId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Update message
    chatMessages[messageIndex] = {
      ...message,
      content,
      isEdited: true,
      editedAt: new Date().toISOString()
    }

    return NextResponse.json(chatMessages[messageIndex])
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

    const messageIndex = chatMessages.findIndex(msg => msg.id === messageId)
    if (messageIndex === -1) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    const message = chatMessages[messageIndex]
    
    // Only allow deleting own messages or admin
    if (message.senderId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Remove message
    chatMessages.splice(messageIndex, 1)

    return NextResponse.json({ message: 'Message deleted successfully' })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
