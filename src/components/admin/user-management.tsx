'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Plus, Edit, Trash2, UserCheck, UserX } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface User {
  id: string
  email: string
  name: string
  role: string
  department: string
  isActive: boolean
  createdAt: string
  lastLogin: string | null
}

export function UserManagement() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: '',
    department: '',
    password: ''
  })

  // Only show for admin users
  if (session?.user?.role !== 'admin') {
    return null
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error loading users:', error)
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los usuarios',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingUser ? '/api/users' : '/api/users'
      const method = editingUser ? 'PUT' : 'POST'
      const body = editingUser 
        ? { ...formData, id: editingUser.id }
        : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        toast({
          title: 'Éxito',
          description: editingUser ? 'Usuario actualizado' : 'Usuario creado exitosamente'
        })
        setIsDialogOpen(false)
        setEditingUser(null)
        setFormData({ email: '', name: '', role: '', department: '', password: '' })
        loadUsers()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Error al procesar solicitud')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive'
      })
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      name: user.name,
      role: user.role,
      department: user.department,
      password: ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return
    }

    try {
      const response = await fetch(`/api/users?id=${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast({
          title: 'Éxito',
          description: 'Usuario eliminado exitosamente'
        })
        loadUsers()
      } else {
        const error = await response.json()
        throw new Error(error.error || 'Error al eliminar usuario')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive'
      })
    }
  }

  const toggleUserStatus = async (user: User) => {
    try {
      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: user.id,
          isActive: !user.isActive
        })
      })

      if (response.ok) {
        toast({
          title: 'Éxito',
          description: `Usuario ${!user.isActive ? 'activado' : 'desactivado'}`
        })
        loadUsers()
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al cambiar estado del usuario',
        variant: 'destructive'
      })
    }
  }

  const getRoleBadge = (role: string): "default" | "secondary" | "destructive" | "outline" => {
    const colors = {
      admin: 'destructive' as const,
      manager: 'default' as const,
      hr_director: 'secondary' as const,
      recruiter: 'outline' as const
    }
    return colors[role as keyof typeof colors] || 'outline'
  }

  const getRoleLabel = (role: string) => {
    const labels = {
      admin: 'Administrador',
      manager: 'Manager',
      hr_director: 'Director RH',
      recruiter: 'Reclutador'
    }
    return labels[role as keyof typeof labels] || role
  }

  if (isLoading) {
    return <div>Cargando usuarios...</div>
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gestión de Usuarios</CardTitle>
            <CardDescription>
              Administra los usuarios del sistema y sus permisos
            </CardDescription>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingUser(null)
                setFormData({ email: '', name: '', role: '', department: '', password: '' })
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Usuario
              </Button>
            </DialogTrigger>
            
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                </DialogTitle>
                <DialogDescription>
                  {editingUser 
                    ? 'Modifica la información del usuario'
                    : 'Completa los datos para crear un nuevo usuario'
                  }
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Rol</Label>
                  <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="hr_director">Director RH</SelectItem>
                      <SelectItem value="recruiter">Reclutador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="department">Departamento</Label>
                  <Select value={formData.department} onValueChange={(value) => setFormData({ ...formData, department: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hr">Recursos Humanos</SelectItem>
                      <SelectItem value="it">Tecnología</SelectItem>
                      <SelectItem value="sales">Ventas</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="finance">Finanzas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {!editingUser && (
                  <div>
                    <Label htmlFor="password">Contraseña</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required={!editingUser}
                    />
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingUser ? 'Actualizar' : 'Crear'} Usuario
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Último acceso</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" />
                      <AvatarFallback>
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadge(user.role)}>
                    {getRoleLabel(user.role)}
                  </Badge>
                </TableCell>
                <TableCell className="capitalize">{user.department}</TableCell>
                <TableCell>
                  <Badge variant={user.isActive ? 'default' : 'secondary'}>
                    {user.isActive ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell>
                  {user.lastLogin 
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : 'Nunca'
                  }
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleUserStatus(user)}
                    >
                      {user.isActive ? (
                        <UserX className="h-4 w-4" />
                      ) : (
                        <UserCheck className="h-4 w-4" />
                      )}
                    </Button>
                    {user.id !== session?.user?.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(user.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
