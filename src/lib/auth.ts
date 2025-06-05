import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { UserRole, UserDepartment } from '@/types/auth'

// Dynamic users storage (in production, this would be in a database)
let DEMO_USERS = [
  {
    id: '1',
    email: 'admin@candidatoscope.com',
    password: 'admin123',
    name: 'Administrador',
    role: 'admin' as UserRole,
    department: 'hr' as UserDepartment,
    avatar: undefined
  },
  {
    id: '2',
    email: 'recruiter@candidatoscope.com',
    password: 'recruiter123',
    name: 'Reclutador',
    role: 'recruiter' as UserRole,
    department: 'hr' as UserDepartment,
    avatar: undefined
  },
  {
    id: '3',
    email: 'manager@candidatoscope.com',
    password: 'manager123',
    name: 'María García',
    role: 'manager' as UserRole,
    department: 'hr' as UserDepartment,
    avatar: undefined
  }
]

// Function to add new user to auth system
export function addUserToAuth(userData: {
  id: string
  email: string
  password: string
  name: string
  role: UserRole
  department: UserDepartment
}) {
  DEMO_USERS.push({
    ...userData,
    avatar: undefined
  })
}

// Function to get all auth users (for API)
export function getAuthUsers() {
  return DEMO_USERS
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // For demo purposes, use hardcoded users
        const user = DEMO_USERS.find(
          u => u.email === credentials.email && u.password === credentials.password
        )

        if (!user) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          department: user.department,
          avatar: user.avatar,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.department = user.department
        token.avatar = user.avatar
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as UserRole
        session.user.department = token.department as UserDepartment
        session.user.avatar = token.avatar as string
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Permite redirecciones relativas
      if (url.startsWith("/")) return `${baseUrl}${url}`
      // Permite redirecciones al mismo dominio
      else if (new URL(url).origin === baseUrl) return url
      // Redirección por defecto
      return baseUrl
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}
