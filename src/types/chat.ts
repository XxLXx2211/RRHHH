export interface ChatMessage {
  id: string
  content: string
  senderId: string
  senderName: string
  senderRole: 'admin' | 'recruiter' | 'manager' | 'hr_director'
  senderAvatar?: string
  timestamp: Date
  chatRoomId: string
  messageType: 'text' | 'file' | 'system'
  fileUrl?: string
  fileName?: string
  isEdited?: boolean
  editedAt?: Date
  replyTo?: string
  reactions?: ChatReaction[]
}

export interface ChatReaction {
  emoji: string
  userId: string
  userName: string
}

export interface ChatRoom {
  id: string
  name: string
  description?: string
  type: 'general' | 'department' | 'project' | 'private'
  participants: ChatParticipant[]
  createdBy: string
  createdAt: Date
  lastMessage?: ChatMessage
  isArchived: boolean
  settings: ChatRoomSettings
}

export interface ChatParticipant {
  userId: string
  userName: string
  userRole: 'admin' | 'recruiter' | 'manager' | 'hr_director'
  userAvatar?: string
  joinedAt: Date
  isOnline: boolean
  lastSeen: Date
  permissions: ChatPermissions
}

export interface ChatPermissions {
  canSendMessages: boolean
  canDeleteMessages: boolean
  canEditMessages: boolean
  canManageParticipants: boolean
  canArchiveRoom: boolean
}

export interface ChatRoomSettings {
  allowFileSharing: boolean
  allowReactions: boolean
  requireApproval: boolean
  maxParticipants: number
  retentionDays: number
}

export interface ChatNotification {
  id: string
  type: 'new_message' | 'mention' | 'room_invite' | 'room_update'
  chatRoomId: string
  messageId?: string
  userId: string
  isRead: boolean
  createdAt: Date
}

export type ChatUserRole = 'admin' | 'recruiter' | 'manager' | 'hr_director'

export interface ChatUser {
  id: string
  name: string
  email: string
  role: ChatUserRole
  avatar?: string
  isOnline: boolean
  lastSeen: Date
  status: 'available' | 'busy' | 'away' | 'offline'
  statusMessage?: string
}
