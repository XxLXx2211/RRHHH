'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { ChatRoom, ChatMessage, ChatUser, ChatNotification } from '@/types/chat'
import { socketClient } from '@/lib/notifications/socket-client'
import { realTimeChatEvents } from '@/lib/chat/real-time-events'

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
  usePolling: boolean
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
  const [eventSource, setEventSource] = useState<EventSource | null>(null)
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null)
  const [lastPollTime, setLastPollTime] = useState<string>(new Date().toISOString())
  const [usePolling, setUsePolling] = useState(false)

  // Initialize chat data and real-time connection
  useEffect(() => {
    if (session?.user) {
      loadChatRooms()
      loadOnlineUsers()

      // Try SSE first, fallback to polling
      setupRealTimeConnection()

      // Set user online
      fetch('/api/chat/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'online' })
      })
    }

    return () => {
      // Cleanup on unmount
      if (eventSource) {
        eventSource.close()
      }
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
      if (session?.user) {
        fetch('/api/chat/status', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'offline' })
        })
      }
    }
  }, [session])

  // Load messages when active room changes
  useEffect(() => {
    if (activeRoom && session?.user) {
      loadMessages(activeRoom.id)
      setLastPollTime(new Date().toISOString())
    }
  }, [activeRoom, session])

  // Setup polling for active room when using polling mode
  useEffect(() => {
    if (usePolling && activeRoom && session?.user) {
      setupPolling()
    }
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [usePolling, activeRoom, session])

  const loadMessages = async (roomId: string) => {
    try {
      console.log(`[CHAT CONTEXT] Loading messages for room: ${roomId}`)
      const response = await fetch(`/api/chat/messages?roomId=${roomId}`)
      if (response.ok) {
        const data = await response.json()
        console.log(`[CHAT CONTEXT] Loaded ${data.length} messages for room ${roomId}`)
        setMessages(data.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })))
      } else {
        console.error(`[CHAT CONTEXT] Failed to load messages: ${response.status}`)
      }
    } catch (error) {
      console.error('[CHAT CONTEXT] Error loading messages:', error)
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

  const setupPolling = () => {
    console.log('[CHAT CONTEXT] Setting up polling fallback')
    setUsePolling(true)

    if (pollingInterval) {
      clearInterval(pollingInterval)
    }

    const interval = setInterval(async () => {
      if (activeRoom && session?.user) {
        try {
          const response = await fetch(`/api/chat/poll?roomId=${activeRoom.id}&since=${lastPollTime}`)
          if (response.ok) {
            const data = await response.json()
            if (data.messages && data.messages.length > 0) {
              console.log(`[CHAT CONTEXT] Polling found ${data.messages.length} new messages`)
              setMessages(prev => {
                const newMessages = data.messages.filter((newMsg: any) =>
                  !prev.some(existingMsg => existingMsg.id === newMsg.id)
                )
                return [...prev, ...newMessages.map((msg: any) => ({
                  ...msg,
                  timestamp: new Date(msg.timestamp)
                }))]
              })
            }
            setLastPollTime(data.timestamp)
          }
        } catch (error) {
          console.error('[CHAT CONTEXT] Polling error:', error)
        }
      }
    }, 2000) // Poll every 2 seconds

    setPollingInterval(interval)
  }

  const setupRealTimeConnection = () => {
    // Try SSE first
    if (eventSource) {
      eventSource.close()
    }

    console.log('[CHAT CONTEXT] Attempting SSE connection')
    const newEventSource = new EventSource('/api/chat/events')
    setEventSource(newEventSource)

    let sseConnected = false

    newEventSource.onopen = () => {
      console.log('[CHAT CONTEXT] SSE connection opened')
      sseConnected = true
      setUsePolling(false)
    }

    newEventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        switch (data.type) {
          case 'new_message':
            console.log(`[CHAT CONTEXT] Received new message via SSE:`, data.data.id)
            setMessages(prev => {
              // Avoid duplicates
              const exists = prev.some(msg => msg.id === data.data.id)
              if (exists) {
                console.log(`[CHAT CONTEXT] Message ${data.data.id} already exists, skipping`)
                return prev
              }

              console.log(`[CHAT CONTEXT] Adding new message ${data.data.id} to state`)
              return [...prev, {
                ...data.data,
                timestamp: new Date(data.data.timestamp)
              }]
            })
            break

          case 'message_updated':
            setMessages(prev =>
              prev.map(msg =>
                msg.id === data.data.id
                  ? { ...data.data, timestamp: new Date(data.data.timestamp) }
                  : msg
              )
            )
            break

          case 'message_deleted':
            setMessages(prev => prev.filter(msg => msg.id !== data.data.messageId))
            break

          case 'user_status_changed':
            setOnlineUsers(prev =>
              prev.map(user =>
                user.id === data.data.userId
                  ? { ...user, isOnline: data.data.status === 'online', status: data.data.status }
                  : user
              )
            )
            break

          case 'connected':
            console.log('[CHAT CONTEXT] Connected to real-time chat events via SSE')
            break

          case 'heartbeat':
            // Keep connection alive
            break

          default:
            console.log('[CHAT CONTEXT] Unknown event type:', data.type)
        }
      } catch (error) {
        console.error('[CHAT CONTEXT] Error parsing SSE data:', error)
      }
    }

    newEventSource.onerror = (error) => {
      console.error('[CHAT CONTEXT] SSE connection error:', error)

      if (!sseConnected) {
        console.log('[CHAT CONTEXT] SSE failed to connect, falling back to polling')
        newEventSource.close()
        setupPolling()
      } else {
        // Attempt to reconnect SSE after 5 seconds
        setTimeout(() => {
          if (session?.user && !usePolling) {
            setupRealTimeConnection()
          }
        }, 5000)
      }
    }

    // Fallback to polling after 10 seconds if SSE doesn't connect
    setTimeout(() => {
      if (!sseConnected && !usePolling) {
        console.log('[CHAT CONTEXT] SSE timeout, falling back to polling')
        newEventSource.close()
        setupPolling()
      }
    }, 10000)
  }

  const sendMessage = async (content: string, roomId: string) => {
    if (!session?.user) return

    try {
      console.log(`[CHAT CONTEXT] Sending message to room ${roomId}:`, content)
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
        console.log(`[CHAT CONTEXT] Message sent successfully:`, newMessage.id)

        // If using polling, add message immediately for better UX
        if (usePolling) {
          setMessages(prev => {
            const exists = prev.some(msg => msg.id === newMessage.id)
            if (!exists) {
              return [...prev, {
                ...newMessage,
                timestamp: new Date(newMessage.timestamp)
              }]
            }
            return prev
          })
        }
        // If using SSE, message will be added via real-time events
      } else {
        console.error(`[CHAT CONTEXT] Failed to send message: ${response.status}`)
      }
    } catch (error) {
      console.error('[CHAT CONTEXT] Error sending message:', error)
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
        // Message will be updated via real-time events, no need to update here
        console.log('Message updated successfully:', updatedMessage.id)
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
        // Message will be deleted via real-time events, no need to delete here
        console.log('Message deleted successfully:', messageId)
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
    isLoading,
    usePolling
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
