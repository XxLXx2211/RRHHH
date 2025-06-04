'use client'

import { ReportGenerator } from '@/components/reports/report-generator'
import { AppHeader } from '@/components/layout/header'

export default function ReportsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-primary mb-2">Reportes Automáticos</h1>
            <p className="text-muted-foreground">
              Genera reportes detallados en PDF y Excel con métricas de reclutamiento en tiempo real
            </p>
          </div>
          
          <div className="flex justify-center">
            <ReportGenerator />
          </div>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">📊 Métricas Incluidas</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Total de candidatos</li>
                <li>• Contrataciones exitosas</li>
                <li>• Tiempo promedio de proceso</li>
                <li>• Tasa de satisfacción</li>
                <li>• Análisis por fuente</li>
              </ul>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">📈 Formatos Disponibles</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• PDF con gráficos</li>
                <li>• Excel con múltiples hojas</li>
                <li>• Datos exportables</li>
                <li>• Resumen ejecutivo</li>
                <li>• Performance por reclutador</li>
              </ul>
            </div>
            
            <div className="bg-card p-6 rounded-lg border">
              <h3 className="font-semibold mb-2">⏰ Períodos</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Reportes semanales</li>
                <li>• Reportes mensuales</li>
                <li>• Reportes trimestrales</li>
                <li>• Períodos personalizados</li>
                <li>• Datos en tiempo real</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
