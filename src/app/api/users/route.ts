import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// In-memory storage for demo (in production, use a real database)
let users = [
  {
    id: '1',
    email: 'admin@candidatoscope.com',
    name: 'Administrador',
    role: 'admin',
    department: 'hr',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: '2',
    email: 'recruiter@candidatoscope.com',
    name: 'Reclutador',
    role: 'recruiter',
    department: 'hr',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: '3',
    email: 'manager@candidatoscope.com',
    name: 'María García',
    role: 'manager',
    department: 'hr',
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  }
]

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin can view all users
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin can create users
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { email, name, role, department, password } = body

    // Validate required fields
    if (!email || !name || !role || !department || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 })
    }

    // Create new user
    const newUser = {
      id: (users.length + 1).toString(),
      email,
      name,
      role,
      department,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    }

    users.push(newUser)

    // Also add to auth system (in production, this would be handled differently)
    const { addUserToAuth } = await import('@/lib/auth')
    addUserToAuth({
      id: newUser.id,
      email,
      password, // In production, this should be hashed
      name,
      role,
      department
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin can update users
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { id, email, name, role, department, isActive } = body

    const userIndex = users.findIndex(u => u.id === id)
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user
    users[userIndex] = {
      ...users[userIndex],
      email: email || users[userIndex].email,
      name: name || users[userIndex].name,
      role: role || users[userIndex].role,
      department: department || users[userIndex].department,
      isActive: isActive !== undefined ? isActive : users[userIndex].isActive
    }

    return NextResponse.json(users[userIndex])
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only admin can delete users
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('id')

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 })
    }

    // Don't allow admin to delete themselves
    if (userId === session.user.id) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 })
    }

    const userIndex = users.findIndex(u => u.id === userId)
    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Remove user
    users.splice(userIndex, 1)

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
