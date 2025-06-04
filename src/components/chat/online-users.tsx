'use client'

import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useChat } from '@/context/chat-context'

export function OnlineUsers() {
  const { onlineUsers } = useChat()

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500'
      case 'busy':
        return 'bg-red-500'
      case 'away':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible'
      case 'busy':
        return 'Ocupado'
      case 'away':
        return 'Ausente'
      default:
        return 'Desconectado'
    }
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

  return (
    <div className="h-48 flex flex-col">
      <div className="p-2 border-b">
        <h4 className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
          Usuarios ({onlineUsers.length})
        </h4>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {onlineUsers.map((user) => (
            <Button
              key={user.id}
              variant="ghost"
              className="w-full justify-start h-auto p-2 text-left"
            >
              <div className="flex items-center gap-2 w-full">
                <div className="relative">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xs">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div 
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(user.status)}`}
                    title={getStatusLabel(user.status)}
                  />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-medium truncate">{user.name}</span>
                    <Badge variant={getRoleColor(user.role)} className="h-3 text-xs px-1">
                      {user.role}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {getStatusLabel(user.status)}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
