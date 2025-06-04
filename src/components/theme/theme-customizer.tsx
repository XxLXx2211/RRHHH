'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAdvancedTheme } from '@/context/advanced-theme-context'
import { Palette, Monitor, Sun, Moon, Droplets, Leaf, Zap } from 'lucide-react'

export function ThemeCustomizer() {
  const { theme, colorScheme, setTheme, setColorScheme, isDark, isLight } = useAdvancedTheme()

  const themes = [
    { value: 'light', label: 'Claro', icon: Sun },
    { value: 'dark', label: 'Oscuro', icon: Moon },
    { value: 'system', label: 'Sistema', icon: Monitor },
    { value: 'blue', label: 'Azul', icon: Droplets },
    { value: 'green', label: 'Verde', icon: Leaf },
    { value: 'purple', label: 'Púrpura', icon: Zap },
  ]

  const colorSchemes = [
    { value: 'default', label: 'Por Defecto', description: 'Colores estándar del sistema' },
    { value: 'warm', label: 'Cálido', description: 'Tonos naranjas y rojos' },
    { value: 'cool', label: 'Frío', description: 'Tonos azules y verdes' },
    { value: 'monochrome', label: 'Monocromático', description: 'Escala de grises' },
  ]

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Personalización de Tema
        </CardTitle>
        <CardDescription>
          Personaliza la apariencia de CandidatoScope según tus preferencias
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Theme Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Tema Principal</Label>
          <RadioGroup
            value={theme}
            onValueChange={(value) => setTheme(value as any)}
            className="grid grid-cols-3 gap-4"
          >
            {themes.map((themeOption) => {
              const Icon = themeOption.icon
              return (
                <div key={themeOption.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={themeOption.value} id={themeOption.value} />
                  <Label
                    htmlFor={themeOption.value}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Icon className="h-4 w-4" />
                    {themeOption.label}
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        </div>

        {/* Color Scheme Selection */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Esquema de Colores</Label>
          <Select value={colorScheme} onValueChange={(value) => setColorScheme(value as any)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {colorSchemes.map((scheme) => (
                <SelectItem key={scheme.value} value={scheme.value}>
                  <div className="flex flex-col">
                    <span>{scheme.label}</span>
                    <span className="text-xs text-muted-foreground">{scheme.description}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Theme Preview */}
        <div className="space-y-3">
          <Label className="text-base font-medium">Vista Previa</Label>
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="space-y-2">
                <div className="h-4 bg-primary rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </div>
            </Card>
            <Card className="p-4 bg-muted">
              <div className="space-y-2">
                <div className="h-4 bg-primary/80 rounded w-3/4"></div>
                <div className="h-3 bg-background rounded w-1/2"></div>
                <div className="h-3 bg-background rounded w-2/3"></div>
              </div>
            </Card>
          </div>
        </div>

        {/* Current Theme Info */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm space-y-1">
            <p><strong>Tema Actual:</strong> {themes.find(t => t.value === theme)?.label}</p>
            <p><strong>Esquema:</strong> {colorSchemes.find(s => s.value === colorScheme)?.label}</p>
            <p><strong>Modo:</strong> {isDark ? 'Oscuro' : 'Claro'}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setTheme('system')
              setColorScheme('default')
            }}
          >
            Restablecer
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
          >
            Alternar Modo
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
