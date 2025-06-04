import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { realTimeChatEvents } from '@/lib/chat/real-time-events'

// Server-Sent Events endpoint for real-time chat updates
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Create a readable stream for Server-Sent Events
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        const data = `data: ${JSON.stringify({ type: 'connected', userId: session.user.id })}\n\n`
        controller.enqueue(new TextEncoder().encode(data))

        // Set up event listeners
        const handleNewMessage = (message: any) => {
          const data = `data: ${JSON.stringify({ type: 'new_message', data: message })}\n\n`
          controller.enqueue(new TextEncoder().encode(data))
        }

        const handleMessageUpdate = (message: any) => {
          const data = `data: ${JSON.stringify({ type: 'message_updated', data: message })}\n\n`
          controller.enqueue(new TextEncoder().encode(data))
        }

        const handleMessageDeletion = (messageId: string) => {
          const data = `data: ${JSON.stringify({ type: 'message_deleted', data: { messageId } })}\n\n`
          controller.enqueue(new TextEncoder().encode(data))
        }

        const handleUserStatusChange = (statusData: any) => {
          const data = `data: ${JSON.stringify({ type: 'user_status_changed', data: statusData })}\n\n`
          controller.enqueue(new TextEncoder().encode(data))
        }

        const handleUserTyping = (typingData: any) => {
          const data = `data: ${JSON.stringify({ type: 'user_typing', data: typingData })}\n\n`
          controller.enqueue(new TextEncoder().encode(data))
        }

        // Register event listeners
        realTimeChatEvents.on('new_message', handleNewMessage)
        realTimeChatEvents.on('message_updated', handleMessageUpdate)
        realTimeChatEvents.on('message_deleted', handleMessageDeletion)
        realTimeChatEvents.on('user_status_changed', handleUserStatusChange)
        realTimeChatEvents.on('user_typing', handleUserTyping)

        // Keep connection alive with heartbeat
        const heartbeat = setInterval(() => {
          const data = `data: ${JSON.stringify({ type: 'heartbeat', timestamp: Date.now() })}\n\n`
          controller.enqueue(new TextEncoder().encode(data))
        }, 30000) // Every 30 seconds

        // Cleanup function
        const cleanup = () => {
          clearInterval(heartbeat)
          realTimeChatEvents.off('new_message', handleNewMessage)
          realTimeChatEvents.off('message_updated', handleMessageUpdate)
          realTimeChatEvents.off('message_deleted', handleMessageDeletion)
          realTimeChatEvents.off('user_status_changed', handleUserStatusChange)
          realTimeChatEvents.off('user_typing', handleUserTyping)
        }

        // Handle client disconnect
        request.signal.addEventListener('abort', () => {
          cleanup()
          controller.close()
        })
      }
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      }
    })
  } catch (error) {
    console.error('Error in SSE endpoint:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
