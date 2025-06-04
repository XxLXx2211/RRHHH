'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Hash, Lock, Users, Plus } from 'lucide-react'
import { useChat } from '@/context/chat-context'
import { ChatRoom } from '@/types/chat'

export function ChatRoomList() {
  const { chatRooms, activeRoom, setActiveRoom } = useChat()

  const getRoomIcon = (room: ChatRoom) => {
    switch (room.type) {
      case 'private':
        return <Lock className="h-4 w-4" />
      case 'department':
        return <Users className="h-4 w-4" />
      default:
        return <Hash className="h-4 w-4" />
    }
  }

  const getRoomBadgeColor = (room: ChatRoom) => {
    switch (room.type) {
      case 'private':
        return 'destructive'
      case 'department':
        return 'secondary'
      default:
        return 'default'
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Canales</h3>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {chatRooms.map((room) => (
            <Button
              key={room.id}
              variant={activeRoom?.id === room.id ? 'secondary' : 'ghost'}
              className="w-full justify-start h-auto p-2 text-left"
              onClick={() => setActiveRoom(room)}
            >
              <div className="flex items-center gap-2 w-full">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {getRoomIcon(room)}
                  <span className="truncate text-sm">{room.name}</span>
                </div>
                
                <div className="flex items-center gap-1">
                  <Badge 
                    variant={getRoomBadgeColor(room)}
                    className="h-4 text-xs px-1"
                  >
                    {room.participants.length}
                  </Badge>
                  
                  {room.lastMessage && (
                    <div className="w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Room Types Legend */}
      <div className="p-2 border-t bg-muted/30">
        <div className="space-y-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Hash className="h-3 w-3" />
            <span>General</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-3 w-3" />
            <span>Departamento</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-3 w-3" />
            <span>Privado</span>
          </div>
        </div>
      </div>
    </div>
  )
}
