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

  const loadChatRooms = async () => {
    setIsLoading(true)
    try {
      // Mock data - in real app would fetch from API
      const mockRooms: ChatRoom[] = [
        {
          id: '1',
          name: 'General',
          description: 'Canal general para toda la empresa',
          type: 'general',
          participants: [
            {
              userId: '1',
              userName: 'Administrador',
              userRole: 'admin',
              joinedAt: new Date(),
              isOnline: true,
              lastSeen: new Date(),
              permissions: {
                canSendMessages: true,
                canDeleteMessages: true,
                canEditMessages: true,
                canManageParticipants: true,
                canArchiveRoom: true
              }
            }
          ],
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
          participants: [],
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
          participants: [],
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
      // Mock data - in real app would fetch from API
      const mockUsers: ChatUser[] = [
        {
          id: '1',
          name: 'Administrador',
          email: 'admin@candidatoscope.com',
          role: 'admin',
          isOnline: true,
          lastSeen: new Date(),
          status: 'available'
        },
        {
          id: '2',
          name: 'Reclutador',
          email: 'recruiter@candidatoscope.com',
          role: 'recruiter',
          isOnline: true,
          lastSeen: new Date(),
          status: 'busy'
        },
        {
          id: '3',
          name: 'María García',
          email: 'maria@candidatoscope.com',
          role: 'manager',
          isOnline: false,
          lastSeen: new Date(Date.now() - 30 * 60 * 1000),
          status: 'away'
        }
      ]
      setOnlineUsers(mockUsers)
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

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      senderId: session.user.id!,
      senderName: session.user.name!,
      senderRole: session.user.role as any,
      timestamp: new Date(),
      chatRoomId: roomId,
      messageType: 'text'
    }

    setMessages(prev => [...prev, newMessage])
    
    // In real app, would send to server via socket
    socketClient.sendChatMessage(newMessage)
  }

  const editMessage = async (messageId: string, newContent: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: newContent, isEdited: true, editedAt: new Date() }
          : msg
      )
    )
  }

  const deleteMessage = async (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
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
