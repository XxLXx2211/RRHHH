import { DefaultSession } from 'next-auth'

export type UserRole = 'super_admin' | 'admin' | 'hr_manager' | 'recruiter' | 'interviewer'

export type UserDepartment = 'hr' | 'it' | 'finance' | 'operations' | 'management'

export interface UserProfile {
  id: string
  user_id: string
  full_name: string
  email: string
  role: UserRole
  department: UserDepartment
  avatar_url?: string
  phone?: string
  is_active: boolean
  permissions: string[]
  created_at: string
  updated_at: string
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: UserRole
      department: UserDepartment
      avatar?: string
    } & DefaultSession['user']
  }

  interface User {
    role: UserRole
    department: UserDepartment
    avatar?: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    department: UserDepartment
    avatar?: string
  }
}

export interface Permission {
  id: string
  name: string
  description: string
  resource: string
  action: string
}

export interface RolePermission {
  role: UserRole
  permissions: string[]
}

// Definición de permisos por rol
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  super_admin: [
    'users.create',
    'users.read',
    'users.update',
    'users.delete',
    'candidates.create',
    'candidates.read',
    'candidates.update',
    'candidates.delete',
    'reports.create',
    'reports.read',
    'settings.update',
    'bulk_actions.execute',
    'notifications.send',
    'chat.access_all'
  ],
  admin: [
    'users.read',
    'users.update',
    'candidates.create',
    'candidates.read',
    'candidates.update',
    'candidates.delete',
    'reports.create',
    'reports.read',
    'bulk_actions.execute',
    'notifications.send',
    'chat.access_department'
  ],
  hr_manager: [
    'candidates.create',
    'candidates.read',
    'candidates.update',
    'reports.read',
    'bulk_actions.execute',
    'notifications.send',
    'chat.access_department'
  ],
  recruiter: [
    'candidates.create',
    'candidates.read',
    'candidates.update',
    'reports.read',
    'chat.access_department'
  ],
  interviewer: [
    'candidates.read',
    'candidates.update',
    'reports.read',
    'chat.access_department'
  ]
}
