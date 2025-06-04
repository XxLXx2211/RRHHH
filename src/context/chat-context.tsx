'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ChatRoom, ChatMessage, ChatUser, ChatNotification } from '@/types/chat'
import { socketClient } from '@/lib/notifications/socket-client'

interface ChatContextType {
  // Rooms
  chatRooms: ChatRoom[]
  activeRoom: ChatRoom | null
  setActiveRoom: (room: ChatRoom | null) => void
  
  // Messages
  messages: ChatMessage[]
  sendMessage: (content: string, roomId: string) => Promise<void>
  editMessage: (messageId: string, newContent: string) => Promise<void>
  deleteMessage: (messageId: string) => Promise<void>
  
  // Users
  onlineUsers: ChatUser[]
  
  // Notifications
  chatNotifications: ChatNotification[]
  markNotificationAsRead: (notificationId: string) => void
  
  // UI State
  isChatOpen: boolean
  setIsChatOpen: (open: boolean) => void
  isLoading: boolean
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [onlineUsers, setOnlineUsers] = useState<ChatUser[]>([])
  const [chatNotifications, setChatNotifications] = useState<ChatNotification[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Initialize chat data
  useEffect(() => {
    if (session?.user) {
      loadChatRooms()
      loadOnlineUsers()
      setupSocketListeners()
    }
  }, [session])

  // Load messages when active room changes
  useEffect(() => {
    if (activeRoom && session?.user) {
      loadMessages(activeRoom.id)
    }
  }, [activeRoom, session])

  const loadMessages = async (roomId: string) => {
    try {
      const response = await fetch(`/api/chat/messages?roomId=${roomId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })))
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const loadChatRooms = async () => {
    setIsLoading(true)
    try {
      // Load users from API to populate chat rooms
      const usersResponse = await fetch('/api/users')
      const users = usersResponse.ok ? await usersResponse.json() : []

      // Create chat rooms with real users
      const mockRooms: ChatRoom[] = [
        {
          id: '1',
          name: 'General',
          description: 'Canal general para toda la empresa',
          type: 'general',
          participants: users.map((user: any) => ({
            userId: user.id,
            userName: user.name,
            userRole: user.role,
            joinedAt: new Date(user.createdAt),
            isOnline: user.isActive,
            lastSeen: new Date(user.lastLogin || user.createdAt),
            permissions: {
              canSendMessages: true,
              canDeleteMessages: user.role === 'admin',
              canEditMessages: true,
              canManageParticipants: user.role === 'admin',
              canArchiveRoom: user.role === 'admin'
            }
          })),
          createdBy: '1',
          createdAt: new Date(),
          isArchived: false,
          settings: {
            allowFileSharing: true,
            allowReactions: true,
            requireApproval: false,
            maxParticipants: 100,
            retentionDays: 365
          }
        },
        {
          id: '2',
          name: 'Reclutamiento',
          description: 'Canal para el equipo de reclutamiento',
          type: 'department',
          participants: users.filter((user: any) => user.role === 'recruiter' || user.role === 'manager').map((user: any) => ({
            userId: user.id,
            userName: user.name,
            userRole: user.role,
            joinedAt: new Date(user.createdAt),
            isOnline: user.isActive,
            lastSeen: new Date(user.lastLogin || user.createdAt),
            permissions: {
              canSendMessages: true,
              canDeleteMessages: false,
              canEditMessages: true,
              canManageParticipants: false,
              canArchiveRoom: false
            }
          })),
          createdBy: '1',
          createdAt: new Date(),
          isArchived: false,
          settings: {
            allowFileSharing: true,
            allowReactions: true,
            requireApproval: false,
            maxParticipants: 50,
            retentionDays: 180
          }
        },
        {
          id: '3',
          name: 'Directivos',
          description: 'Canal exclusivo para directivos',
          type: 'private',
          participants: users.filter((user: any) => user.role === 'admin' || user.role === 'hr_director').map((user: any) => ({
            userId: user.id,
            userName: user.name,
            userRole: user.role,
            joinedAt: new Date(user.createdAt),
            isOnline: user.isActive,
            lastSeen: new Date(user.lastLogin || user.createdAt),
            permissions: {
              canSendMessages: true,
              canDeleteMessages: true,
              canEditMessages: true,
              canManageParticipants: true,
              canArchiveRoom: true
            }
          })),
          createdBy: '1',
          createdAt: new Date(),
          isArchived: false,
          settings: {
            allowFileSharing: true,
            allowReactions: true,
            requireApproval: true,
            maxParticipants: 10,
            retentionDays: 730
          }
        }
      ]
      setChatRooms(mockRooms)
    } catch (error) {
      console.error('Error loading chat rooms:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadOnlineUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const users = await response.json()
        const chatUsers: ChatUser[] = users.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          isOnline: user.isActive,
          lastSeen: new Date(user.lastLogin || user.createdAt),
          status: user.isActive ? 'available' : 'offline'
        }))
        setOnlineUsers(chatUsers)
      }
    } catch (error) {
      console.error('Error loading online users:', error)
    }
  }

  const setupSocketListeners = () => {
    socketClient.on('new_chat_message', (message: ChatMessage) => {
      setMessages(prev => [...prev, message])
    })

    socketClient.on('user_online', (user: ChatUser) => {
      setOnlineUsers(prev => 
        prev.map(u => u.id === user.id ? { ...u, isOnline: true, status: user.status } : u)
      )
    })

    socketClient.on('user_offline', (userId: string) => {
      setOnlineUsers(prev => 
        prev.map(u => u.id === userId ? { ...u, isOnline: false, status: 'offline' } : u)
      )
    })
  }

  const sendMessage = async (content: string, roomId: string) => {
    if (!session?.user) return

    try {
      const response = await fetch('/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          chatRoomId: roomId,
          messageType: 'text'
        })
      })

      if (response.ok) {
        const newMessage = await response.json()
        setMessages(prev => [...prev, {
          ...newMessage,
          timestamp: new Date(newMessage.timestamp)
        }])

        // Emit to socket for real-time updates
        socketClient.sendChatMessage(newMessage)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const editMessage = async (messageId: string, newContent: string) => {
    try {
      const response = await fetch('/api/chat/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messageId,
          content: newContent
        })
      })

      if (response.ok) {
        const updatedMessage = await response.json()
        setMessages(prev =>
          prev.map(msg =>
            msg.id === messageId
              ? { ...updatedMessage, timestamp: new Date(updatedMessage.timestamp) }
              : msg
          )
        )
      }
    } catch (error) {
      console.error('Error editing message:', error)
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      const response = await fetch(`/api/chat/messages?messageId=${messageId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setMessages(prev => prev.filter(msg => msg.id !== messageId))
      }
    } catch (error) {
      console.error('Error deleting message:', error)
    }
  }

  const markNotificationAsRead = (notificationId: string) => {
    setChatNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId ? { ...notif, isRead: true } : notif
      )
    )
  }

  const value: ChatContextType = {
    chatRooms,
    activeRoom,
    setActiveRoom,
    messages,
    sendMessage,
    editMessage,
    deleteMessage,
    onlineUsers,
    chatNotifications,
    markNotificationAsRead,
    isChatOpen,
    setIsChatOpen,
    isLoading
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
