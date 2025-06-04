// Real-time event system for chat synchronization
// This simulates WebSocket functionality for demo purposes

type EventCallback = (data: any) => void

class RealTimeChatEvents {
  private listeners: Map<string, EventCallback[]> = new Map()
  private static instance: RealTimeChatEvents

  static getInstance(): RealTimeChatEvents {
    if (!RealTimeChatEvents.instance) {
      RealTimeChatEvents.instance = new RealTimeChatEvents()
    }
    return RealTimeChatEvents.instance
  }

  // Subscribe to events
  on(event: string, callback: EventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  // Unsubscribe from events
  off(event: string, callback: EventCallback) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  // Emit events to all listeners
  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event)
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('Error in event callback:', error)
        }
      })
    }
  }

  // Broadcast message to all connected clients
  broadcastMessage(message: any) {
    console.log(`[REAL-TIME] Broadcasting new message:`, message.id)
    this.emit('new_message', message)
  }

  // Broadcast message update
  broadcastMessageUpdate(message: any) {
    this.emit('message_updated', message)
  }

  // Broadcast message deletion
  broadcastMessageDeletion(messageId: string) {
    this.emit('message_deleted', messageId)
  }

  // Broadcast user status change
  broadcastUserStatus(userId: string, status: 'online' | 'offline') {
    this.emit('user_status_changed', { userId, status })
  }

  // Broadcast typing indicator
  broadcastTyping(roomId: string, userId: string, userName: string, isTyping: boolean) {
    this.emit('user_typing', { roomId, userId, userName, isTyping })
  }
}

export const realTimeChatEvents = RealTimeChatEvents.getInstance()

// Global message storage with real-time sync
class ChatMessageStore {
  private static instance: ChatMessageStore
  private messages: Map<string, any[]> = new Map() // roomId -> messages[]

  static getInstance(): ChatMessageStore {
    if (!ChatMessageStore.instance) {
      ChatMessageStore.instance = new ChatMessageStore()
    }
    return ChatMessageStore.instance
  }

  // Get messages for a room
  getMessages(roomId: string): any[] {
    return this.messages.get(roomId) || []
  }

  // Add message to room
  addMessage(message: any): any {
    const roomId = message.chatRoomId
    if (!this.messages.has(roomId)) {
      this.messages.set(roomId, [])
    }

    const roomMessages = this.messages.get(roomId)!
    roomMessages.push(message)

    console.log(`[MESSAGE STORE] Added message ${message.id} to room ${roomId}. Total messages in room: ${roomMessages.length}`)

    // Sort by timestamp
    roomMessages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    // Broadcast to all connected clients
    realTimeChatEvents.broadcastMessage(message)

    return message
  }

  // Update message
  updateMessage(messageId: string, updates: any): any | null {
    for (const [roomId, messages] of this.messages.entries()) {
      const messageIndex = messages.findIndex(m => m.id === messageId)
      if (messageIndex !== -1) {
        messages[messageIndex] = { ...messages[messageIndex], ...updates }
        realTimeChatEvents.broadcastMessageUpdate(messages[messageIndex])
        return messages[messageIndex]
      }
    }
    return null
  }

  // Delete message
  deleteMessage(messageId: string): boolean {
    for (const [roomId, messages] of this.messages.entries()) {
      const messageIndex = messages.findIndex(m => m.id === messageId)
      if (messageIndex !== -1) {
        messages.splice(messageIndex, 1)
        realTimeChatEvents.broadcastMessageDeletion(messageId)
        return true
      }
    }
    return false
  }

  // Get all messages (for debugging)
  getAllMessages(): Map<string, any[]> {
    return this.messages
  }

  // Clear all messages (for testing)
  clearAllMessages(): void {
    this.messages.clear()
  }
}

export const chatMessageStore = ChatMessageStore.getInstance()

// User status tracking
class UserStatusTracker {
  private static instance: UserStatusTracker
  private userStatus: Map<string, { status: 'online' | 'offline', lastSeen: Date }> = new Map()

  static getInstance(): UserStatusTracker {
    if (!UserStatusTracker.instance) {
      UserStatusTracker.instance = new UserStatusTracker()
    }
    return UserStatusTracker.instance
  }

  // Set user online
  setUserOnline(userId: string) {
    this.userStatus.set(userId, { status: 'online', lastSeen: new Date() })
    realTimeChatEvents.broadcastUserStatus(userId, 'online')
  }

  // Set user offline
  setUserOffline(userId: string) {
    this.userStatus.set(userId, { status: 'offline', lastSeen: new Date() })
    realTimeChatEvents.broadcastUserStatus(userId, 'offline')
  }

  // Get user status
  getUserStatus(userId: string): { status: 'online' | 'offline', lastSeen: Date } {
    return this.userStatus.get(userId) || { status: 'offline', lastSeen: new Date() }
  }

  // Get all online users
  getOnlineUsers(): string[] {
    const onlineUsers: string[] = []
    for (const [userId, status] of this.userStatus.entries()) {
      if (status.status === 'online') {
        onlineUsers.push(userId)
      }
    }
    return onlineUsers
  }

  // Update last seen
  updateLastSeen(userId: string) {
    const current = this.userStatus.get(userId)
    if (current) {
      this.userStatus.set(userId, { ...current, lastSeen: new Date() })
    }
  }
}

export const userStatusTracker = UserStatusTracker.getInstance()

// Typing indicator tracker
class TypingTracker {
  private static instance: TypingTracker
  private typingUsers: Map<string, Set<string>> = new Map() // roomId -> Set of userIds

  static getInstance(): TypingTracker {
    if (!TypingTracker.instance) {
      TypingTracker.instance = new TypingTracker()
    }
    return TypingTracker.instance
  }

  // Set user typing
  setUserTyping(roomId: string, userId: string, userName: string) {
    if (!this.typingUsers.has(roomId)) {
      this.typingUsers.set(roomId, new Set())
    }
    this.typingUsers.get(roomId)!.add(userId)
    realTimeChatEvents.broadcastTyping(roomId, userId, userName, true)

    // Auto-remove after 3 seconds
    setTimeout(() => {
      this.setUserNotTyping(roomId, userId, userName)
    }, 3000)
  }

  // Set user not typing
  setUserNotTyping(roomId: string, userId: string, userName: string) {
    const roomTyping = this.typingUsers.get(roomId)
    if (roomTyping) {
      roomTyping.delete(userId)
      realTimeChatEvents.broadcastTyping(roomId, userId, userName, false)
    }
  }

  // Get typing users for room
  getTypingUsers(roomId: string): string[] {
    const roomTyping = this.typingUsers.get(roomId)
    return roomTyping ? Array.from(roomTyping) : []
  }
}

export const typingTracker = TypingTracker.getInstance()
