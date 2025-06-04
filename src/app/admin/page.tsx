'use client'

import { useSession } from 'next-auth/react'
import { AppHeader } from '@/components/layout/header'
import { UserManagement } from '@/components/admin/user-management'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Shield, Settings, Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    if (session.user?.role !== 'admin') {
      router.push('/')
      return
    }
  }, [session, status, router])

  if (status === 'loading') {
    return <div>Cargando...</div>
  }

  if (!session || session.user?.role !== 'admin') {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold text-primary">Panel de Administración</h1>
              <Badge variant="destructive">Admin</Badge>
            </div>
            <p className="text-muted-foreground">
              Gestiona usuarios, permisos y configuraciones del sistema
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Usuarios Totales
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +2 desde el mes pasado
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Usuarios Activos
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  Conectados hoy
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Roles Configurados
                </CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">
                  Admin, Manager, Director, Recruiter
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Configuraciones
                </CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <p className="text-xs text-muted-foreground">
                  Parámetros del sistema
                </p>
              </CardContent>
            </Card>
          </div>

          {/* User Management Section */}
          <div className="space-y-6">
            <UserManagement />
            
            {/* Additional Admin Features */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Configuración del Sistema
                  </CardTitle>
                  <CardDescription>
                    Ajustes generales y parámetros del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Notificaciones en tiempo real</span>
                      <Badge variant="default">Activo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Chat interno</span>
                      <Badge variant="default">Activo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Evaluación IA</span>
                      <Badge variant="default">Activo</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Reportes automáticos</span>
                      <Badge variant="default">Activo</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Actividad Reciente
                  </CardTitle>
                  <CardDescription>
                    Últimas acciones en el sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">Usuario creado: María López</span>
                      <span className="text-xs text-muted-foreground ml-auto">Hace 2h</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <span className="text-sm">Reporte generado: Mensual</span>
                      <span className="text-xs text-muted-foreground ml-auto">Hace 4h</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-sm">Configuración actualizada</span>
                      <span className="text-xs text-muted-foreground ml-auto">Hace 1d</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <span className="text-sm">Backup completado</span>
                      <span className="text-xs text-muted-foreground ml-auto">Hace 2d</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
