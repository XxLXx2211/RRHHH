'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Download, FileText, Table } from 'lucide-react'
import { format as formatDate } from 'date-fns'
import { es } from 'date-fns/locale'
import { generatePDFReport } from '@/lib/reports/pdf-generator'
import { generateExcelReport } from '@/lib/reports/excel-generator'
import { useToast } from '@/hooks/use-toast'

type ReportType = 'monthly' | 'weekly' | 'quarterly' | 'custom'
type ReportFormat = 'pdf' | 'excel' | 'both'

export function ReportGenerator() {
  const [reportType, setReportType] = useState<ReportType>('monthly')
  const [format, setFormat] = useState<ReportFormat>('pdf')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [isGenerating, setIsGenerating] = useState(false)
  const { toast } = useToast()

  const handleGenerateReport = async () => {
    setIsGenerating(true)

    try {
      // Obtener datos reales de la API
      const params = new URLSearchParams({
        type: reportType,
        ...(startDate && { startDate: startDate.toISOString() }),
        ...(endDate && { endDate: endDate.toISOString() })
      })

      const response = await fetch(`/api/reports?${params}`)
      if (!response.ok) {
        throw new Error('Error al obtener datos del reporte')
      }

      const apiData = await response.json()

      // Formatear datos para el generador de PDF
      const reportData = {
        title: `Reporte ${reportType === 'weekly' ? 'Semanal' : reportType === 'monthly' ? 'Mensual' : reportType === 'quarterly' ? 'Trimestral' : 'Personalizado'} de Reclutamiento`,
        period: apiData.summary.period,
        metrics: apiData.summary,
        chartData: [],
        detailedData: apiData.candidatesByPosition
      }

      const excelData = {
        summary: {
          ...reportData.metrics,
          period: reportData.period
        },
        candidatesBySource: apiData.candidatesBySource,
        candidatesByPosition: apiData.candidatesByPosition,
        recruiterPerformance: apiData.recruiterPerformance,
        rawData: apiData.rawData
      }

      if (format === 'pdf' || format === 'both') {
        const pdfBlob = await generatePDFReport(reportData)
        downloadFile(pdfBlob, `reporte-${reportType}-${Date.now()}.pdf`)
      }

      if (format === 'excel' || format === 'both') {
        const excelBlob = generateExcelReport(excelData)
        downloadFile(excelBlob, `reporte-${reportType}-${Date.now()}.xlsx`)
      }

      toast({
        title: 'Reporte generado exitosamente',
        description: 'El reporte se ha descargado automáticamente.',
      })

    } catch (error) {
      toast({
        title: 'Error al generar reporte',
        description: 'Hubo un problema al generar el reporte. Intenta de nuevo.',
        variant: 'destructive',
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Generador de Reportes
        </CardTitle>
        <CardDescription>
          Genera reportes automáticos en PDF y Excel con métricas de reclutamiento
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tipo de Reporte</Label>
            <Select value={reportType} onValueChange={(value: ReportType) => setReportType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Semanal</SelectItem>
                <SelectItem value="monthly">Mensual</SelectItem>
                <SelectItem value="quarterly">Trimestral</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Formato</Label>
            <Select value={format} onValueChange={(value: ReportFormat) => setFormat(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="both">Ambos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {reportType === 'custom' && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fecha Inicio</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? formatDate(startDate, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Fecha Fin</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? formatDate(endDate, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        <Button 
          onClick={handleGenerateReport} 
          disabled={isGenerating}
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          {isGenerating ? 'Generando...' : 'Generar Reporte'}
        </Button>
      </CardContent>
    </Card>
  )
}
