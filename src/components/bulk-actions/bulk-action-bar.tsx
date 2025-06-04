'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  CheckSquare, 
  Square, 
  UserCheck, 
  Mail, 
  Tag, 
  Trash2, 
  Archive,
  MoreHorizontal,
  X
} from 'lucide-react'
import { BulkActionDialog } from './bulk-action-dialog'

export interface BulkAction {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  variant?: 'default' | 'destructive'
  requiresConfirmation?: boolean
}

interface BulkActionBarProps {
  selectedItems: string[]
  totalItems: number
  onSelectAll: () => void
  onClearSelection: () => void
  onBulkAction: (actionId: string, data?: any) => Promise<void>
  isLoading?: boolean
}

const BULK_ACTIONS: BulkAction[] = [
  {
    id: 'change-status',
    label: 'Cambiar Estado',
    icon: UserCheck,
  },
  {
    id: 'assign-recruiter',
    label: 'Asignar Reclutador',
    icon: UserCheck,
  },
  {
    id: 'add-tags',
    label: 'Agregar Etiquetas',
    icon: Tag,
  },
  {
    id: 'send-email',
    label: 'Enviar Email',
    icon: Mail,
  },
  {
    id: 'archive',
    label: 'Archivar',
    icon: Archive,
    requiresConfirmation: true,
  },
  {
    id: 'delete',
    label: 'Eliminar',
    icon: Trash2,
    variant: 'destructive',
    requiresConfirmation: true,
  },
]

export function BulkActionBar({
  selectedItems,
  totalItems,
  onSelectAll,
  onClearSelection,
  onBulkAction,
  isLoading = false
}: BulkActionBarProps) {
  const [selectedAction, setSelectedAction] = useState<string>('')
  const [showActionDialog, setShowActionDialog] = useState(false)

  const isAllSelected = selectedItems.length === totalItems && totalItems > 0
  const isPartiallySelected = selectedItems.length > 0 && selectedItems.length < totalItems

  const handleActionSelect = (actionId: string) => {
    setSelectedAction(actionId)
    setShowActionDialog(true)
  }

  const handleActionConfirm = async (data?: any) => {
    if (selectedAction) {
      await onBulkAction(selectedAction, data)
      setShowActionDialog(false)
      setSelectedAction('')
    }
  }

  if (selectedItems.length === 0) {
    return null
  }

  return (
    <>
      <div className="sticky top-14 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Selection Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={isAllSelected ? onClearSelection : onSelectAll}
                className="h-8 w-8 p-0"
              >
                {isAllSelected ? (
                  <CheckSquare className="h-4 w-4" />
                ) : isPartiallySelected ? (
                  <Square className="h-4 w-4 fill-current" />
                ) : (
                  <Square className="h-4 w-4" />
                )}
              </Button>
              <Badge variant="secondary" className="font-mono">
                {selectedItems.length} seleccionados
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearSelection}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {BULK_ACTIONS.slice(0, 4).map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.id}
                    variant="outline"
                    size="sm"
                    onClick={() => handleActionSelect(action.id)}
                    disabled={isLoading}
                    className="h-8"
                  >
                    <Icon className="mr-2 h-3 w-3" />
                    {action.label}
                  </Button>
                )
              })}

              {/* More Actions Dropdown */}
              <Select onValueChange={handleActionSelect}>
                <SelectTrigger className="h-8 w-auto">
                  <MoreHorizontal className="h-3 w-3" />
                </SelectTrigger>
                <SelectContent>
                  {BULK_ACTIONS.slice(4).map((action) => {
                    const Icon = action.icon
                    return (
                      <SelectItem key={action.id} value={action.id}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-3 w-3" />
                          {action.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selection Info */}
          <div className="text-sm text-muted-foreground">
            {selectedItems.length} de {totalItems} elementos
          </div>
        </div>
      </div>

      {/* Action Dialog */}
      <BulkActionDialog
        open={showActionDialog}
        onOpenChange={setShowActionDialog}
        action={BULK_ACTIONS.find(a => a.id === selectedAction)}
        selectedCount={selectedItems.length}
        onConfirm={handleActionConfirm}
        isLoading={isLoading}
      />
    </>
  )
}
