'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertTriangle } from 'lucide-react'
import { BulkAction } from './bulk-action-bar'

interface BulkActionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  action?: BulkAction
  selectedCount: number
  onConfirm: (data?: any) => Promise<void>
  isLoading?: boolean
}

export function BulkActionDialog({
  open,
  onOpenChange,
  action,
  selectedCount,
  onConfirm,
  isLoading = false
}: BulkActionDialogProps) {
  const [formData, setFormData] = useState<Record<string, any>>({})
  const [sendNotification, setSendNotification] = useState(true)

  const handleSubmit = async () => {
    await onConfirm(formData)
    setFormData({})
  }

  const renderActionForm = () => {
    if (!action) return null

    switch (action.id) {
      case 'change-status':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nuevo Estado</Label>
              <Select
                value={formData.status || ''}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nuevo">Nuevo</SelectItem>
                  <SelectItem value="en-revision">En Revisión</SelectItem>
                  <SelectItem value="entrevista-programada">Entrevista Programada</SelectItem>
                  <SelectItem value="entrevista-realizada">Entrevista Realizada</SelectItem>
                  <SelectItem value="finalista">Finalista</SelectItem>
                  <SelectItem value="contratado">Contratado</SelectItem>
                  <SelectItem value="rechazado">Rechazado</SelectItem>
                  <SelectItem value="archivado">Archivado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Comentario (opcional)</Label>
              <Textarea
                placeholder="Agregar comentario sobre el cambio de estado..."
                value={formData.comment || ''}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              />
            </div>
          </div>
        )

      case 'assign-recruiter':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Reclutador</Label>
              <Select
                value={formData.recruiter || ''}
                onValueChange={(value) => setFormData({ ...formData, recruiter: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar reclutador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maria-garcia">María García</SelectItem>
                  <SelectItem value="juan-lopez">Juan López</SelectItem>
                  <SelectItem value="ana-martin">Ana Martín</SelectItem>
                  <SelectItem value="carlos-rodriguez">Carlos Rodríguez</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Motivo de asignación (opcional)</Label>
              <Textarea
                placeholder="Especificar motivo de la asignación..."
                value={formData.reason || ''}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>
          </div>
        )

      case 'add-tags':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Etiquetas</Label>
              <Input
                placeholder="Separar etiquetas con comas (ej: urgente, senior, remoto)"
                value={formData.tags || ''}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              />
            </div>
            <div className="text-sm text-muted-foreground">
              Las etiquetas se agregarán a las existentes, no las reemplazarán.
            </div>
          </div>
        )

      case 'send-email':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Plantilla de Email</Label>
              <Select
                value={formData.template || ''}
                onValueChange={(value) => setFormData({ ...formData, template: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar plantilla" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="confirmation">Confirmación de Recepción</SelectItem>
                  <SelectItem value="interview-invitation">Invitación a Entrevista</SelectItem>
                  <SelectItem value="rejection">Notificación de Rechazo</SelectItem>
                  <SelectItem value="follow-up">Seguimiento</SelectItem>
                  <SelectItem value="custom">Personalizado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.template === 'custom' && (
              <div className="space-y-2">
                <Label>Mensaje Personalizado</Label>
                <Textarea
                  placeholder="Escribir mensaje personalizado..."
                  value={formData.customMessage || ''}
                  onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
                  rows={4}
                />
              </div>
            )}
          </div>
        )

      case 'archive':
      case 'delete':
        return (
          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Esta acción {action.id === 'delete' ? 'eliminará permanentemente' : 'archivará'} {selectedCount} candidato{selectedCount > 1 ? 's' : ''}.
                {action.id === 'delete' && ' Esta acción no se puede deshacer.'}
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label>Motivo (opcional)</Label>
              <Textarea
                placeholder={`Especificar motivo para ${action.id === 'delete' ? 'eliminar' : 'archivar'}...`}
                value={formData.reason || ''}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Configuración de acción no disponible</p>
          </div>
        )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {action?.icon && <action.icon className="h-5 w-5" />}
            {action?.label}
          </DialogTitle>
          <DialogDescription>
            Aplicar esta acción a {selectedCount} candidato{selectedCount > 1 ? 's' : ''} seleccionado{selectedCount > 1 ? 's' : ''}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {renderActionForm()}

          {/* Notification Option */}
          {action?.id !== 'delete' && action?.id !== 'archive' && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="notification"
                checked={sendNotification}
                onCheckedChange={setSendNotification}
              />
              <Label htmlFor="notification" className="text-sm">
                Enviar notificación automática
              </Label>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            variant={action?.variant === 'destructive' ? 'destructive' : 'default'}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Aplicar a {selectedCount} candidato{selectedCount > 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
