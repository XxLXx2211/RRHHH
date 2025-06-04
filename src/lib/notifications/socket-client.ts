import { io, Socket } from 'socket.io-client'

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  userId: string
  data?: any
}

class SocketClient {
  private socket: Socket | null = null
  private listeners: Map<string, Function[]> = new Map()

  connect(userId: string) {
    if (this.socket?.connected) {
      return
    }

    this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: {
        userId
      },
      transports: ['websocket', 'polling']
    })

    this.socket.on('connect', () => {
      console.log('Connected to notification server')
    })

    this.socket.on('disconnect', () => {
      console.log('Disconnected from notification server')
    })

    this.socket.on('notification', (notification: Notification) => {
      this.emit('notification', notification)
    })

    this.socket.on('bulk_action_progress', (data: any) => {
      this.emit('bulk_action_progress', data)
    })

    this.socket.on('chat_message', (message: any) => {
      this.emit('chat_message', message)
    })

    this.socket.on('user_status_change', (data: any) => {
      this.emit('user_status_change', data)
    })
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  off(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      const index = eventListeners.indexOf(callback)
      if (index > -1) {
        eventListeners.splice(index, 1)
      }
    }
  }

  private emit(event: string, data: any) {
    const eventListeners = this.listeners.get(event)
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data))
    }
  }

  // Send events to server
  sendChatMessage(message: any) {
    this.socket?.emit('send_chat_message', message)
  }

  joinChatRoom(roomId: string) {
    this.socket?.emit('join_chat_room', roomId)
  }

  leaveChatRoom(roomId: string) {
    this.socket?.emit('leave_chat_room', roomId)
  }

  updateUserStatus(status: 'online' | 'away' | 'busy' | 'offline') {
    this.socket?.emit('update_status', status)
  }

  markNotificationAsRead(notificationId: string) {
    this.socket?.emit('mark_notification_read', notificationId)
  }
}

export const socketClient = new SocketClient()
