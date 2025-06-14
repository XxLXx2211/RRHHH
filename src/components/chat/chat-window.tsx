'use client'

import React, { useState, useRef, useEffect } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Send, Paperclip, Smile, MoreVertical } from 'lucide-react'
import { useChat } from '@/context/chat-context'
import { useSession } from 'next-auth/react'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export function ChatWindow() {
  const { activeRoom, messages, sendMessage, usePolling, forceUpdate } = useChat()
  const { data: session } = useSession()
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<string[]>([])
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
      console.log(`[CHAT WINDOW] Scrolled to bottom`)
    }
  }

  // Filter messages for the active room - moved to useMemo to avoid re-declaration
  const roomMessages = React.useMemo(() => {
    return messages.filter(m => m.chatRoomId === activeRoom?.id)
  }, [messages, activeRoom?.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Force re-render when messages change for active room
  useEffect(() => {
    if (activeRoom) {
      console.log(`[CHAT WINDOW] Messages updated for room ${activeRoom.id}:`, roomMessages.length)
    }
  }, [roomMessages, activeRoom, forceUpdate])

  // Auto-scroll and force update when new messages arrive
  useEffect(() => {
    if (roomMessages.length > 0) {
      console.log(`[CHAT WINDOW] New messages detected, scrolling to bottom`)
      setTimeout(() => {
        scrollToBottom()
      }, 100) // Small delay to ensure DOM is updated
    }
  }, [roomMessages.length, forceUpdate])

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !activeRoom) return

    await sendMessage(newMessage, activeRoom.id)
    setNewMessage('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value)

    // Handle typing indicator
    if (!isTyping && activeRoom) {
      setIsTyping(true)
      // In a real implementation, you would send typing status to server
    }

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout)
    }

    // Set new timeout to stop typing indicator
    const timeout = setTimeout(() => {
      setIsTyping(false)
      // In a real implementation, you would send stop typing to server
    }, 1000)

    setTypingTimeout(timeout)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'destructive'
      case 'manager':
        return 'default'
      case 'hr_director':
        return 'secondary'
      default:
        return 'outline'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin'
      case 'manager':
        return 'Manager'
      case 'hr_director':
        return 'Director'
      case 'recruiter':
        return 'Recruiter'
      default:
        return role
    }
  }

  if (!activeRoom) return null

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-3 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">{activeRoom.name}</h3>
              <Badge variant={usePolling ? "secondary" : "default"} className="h-4 text-xs">
                {usePolling ? "Polling" : "Real-time"}
              </Badge>
            </div>
            {activeRoom.description && (
              <p className="text-xs text-muted-foreground">{activeRoom.description}</p>
            )}
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-4" key={`messages-${activeRoom.id}-${forceUpdate}`}>
          {roomMessages.map((message) => (
            <div key={message.id} className="flex gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={message.senderAvatar} />
                <AvatarFallback className="text-xs">
                  {message.senderName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{message.senderName}</span>
                  <Badge variant={getRoleColor(message.senderRole)} className="h-4 text-xs">
                    {getRoleLabel(message.senderRole)}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(message.timestamp, { addSuffix: true, locale: es })}
                  </span>
                </div>
                <p className="text-sm break-words">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Typing Indicator */}
      {typingUsers.length > 0 && (
        <div className="px-3 py-1 text-xs text-muted-foreground">
          {typingUsers.length === 1
            ? `${typingUsers[0]} está escribiendo...`
            : `${typingUsers.length} personas están escribiendo...`
          }
        </div>
      )}

      {/* Message Input */}
      <div className="p-3 border-t">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Paperclip className="h-4 w-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              value={newMessage}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={`Mensaje en ${activeRoom.name}...`}
              className="pr-10"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            >
              <Smile className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            size="sm"
            className="h-8 w-8 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
