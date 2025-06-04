import * as XLSX from 'xlsx'

export interface ExcelReportData {
  summary: {
    totalCandidates: number
    hired: number
    avgProcessTime: number
    satisfactionRate: number
    period: string
  }
  candidatesBySource: Array<{
    source: string
    count: number
    percentage: number
  }>
  candidatesByPosition: Array<{
    position: string
    candidates: number
    hired: number
    avgTime: number
  }>
  recruiterPerformance: Array<{
    recruiter: string
    candidates: number
    hired: number
    avgResponseTime: number
    satisfaction: number
  }>
  rawData: any[]
}

export class ExcelReportGenerator {
  private workbook: XLSX.WorkBook

  constructor() {
    this.workbook = XLSX.utils.book_new()
  }

  generateReport(data: ExcelReportData): Blob {
    // Hoja 1: Resumen Ejecutivo
    this.addSummarySheet(data.summary)
    
    // Hoja 2: Candidatos por Fuente
    this.addCandidatesBySourceSheet(data.candidatesBySource)
    
    // Hoja 3: Candidatos por Posición
    this.addCandidatesByPositionSheet(data.candidatesByPosition)
    
    // Hoja 4: Performance de Reclutadores
    this.addRecruiterPerformanceSheet(data.recruiterPerformance)
    
    // Hoja 5: Datos Raw
    this.addRawDataSheet(data.rawData)

    // Generar archivo
    const excelBuffer = XLSX.write(this.workbook, { 
      bookType: 'xlsx', 
      type: 'array' 
    })
    
    return new Blob([excelBuffer], { 
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
    })
  }

  private addSummarySheet(summary: ExcelReportData['summary']) {
    const data = [
      ['CandidatoScope - Reporte de Reclutamiento'],
      ['Período:', summary.period],
      [''],
      ['MÉTRICAS PRINCIPALES'],
      ['Total de Candidatos', summary.totalCandidates],
      ['Contrataciones Exitosas', summary.hired],
      ['Tiempo Promedio de Proceso (días)', summary.avgProcessTime],
      ['Tasa de Satisfacción (%)', summary.satisfactionRate],
      [''],
      ['RATIOS CALCULADOS'],
      ['Tasa de Conversión (%)', ((summary.hired / summary.totalCandidates) * 100).toFixed(2)],
      ['Candidatos por Contratación', (summary.totalCandidates / summary.hired).toFixed(2)],
      [''],
      ['Generado el:', new Date().toLocaleDateString('es-ES')]
    ]

    const worksheet = XLSX.utils.aoa_to_sheet(data)
    
    // Styling (basic)
    worksheet['!cols'] = [
      { width: 30 },
      { width: 20 }
    ]

    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Resumen')
  }

  private addCandidatesBySourceSheet(data: ExcelReportData['candidatesBySource']) {
    const headers = ['Fuente', 'Cantidad', 'Porcentaje (%)']
    const rows = data.map(item => [
      item.source,
      item.count,
      item.percentage
    ])

    const worksheetData = [headers, ...rows]
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    
    worksheet['!cols'] = [
      { width: 25 },
      { width: 15 },
      { width: 15 }
    ]

    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Por Fuente')
  }

  private addCandidatesByPositionSheet(data: ExcelReportData['candidatesByPosition']) {
    const headers = ['Posición', 'Candidatos', 'Contratados', 'Tiempo Promedio (días)', 'Tasa Conversión (%)']
    const rows = data.map(item => [
      item.position,
      item.candidates,
      item.hired,
      item.avgTime,
      ((item.hired / item.candidates) * 100).toFixed(2)
    ])

    const worksheetData = [headers, ...rows]
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    
    worksheet['!cols'] = [
      { width: 30 },
      { width: 15 },
      { width: 15 },
      { width: 20 },
      { width: 18 }
    ]

    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Por Posición')
  }

  private addRecruiterPerformanceSheet(data: ExcelReportData['recruiterPerformance']) {
    const headers = ['Reclutador', 'Candidatos', 'Contratados', 'Tiempo Respuesta (hrs)', 'Satisfacción (%)']
    const rows = data.map(item => [
      item.recruiter,
      item.candidates,
      item.hired,
      item.avgResponseTime,
      item.satisfaction
    ])

    const worksheetData = [headers, ...rows]
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    
    worksheet['!cols'] = [
      { width: 25 },
      { width: 15 },
      { width: 15 },
      { width: 20 },
      { width: 18 }
    ]

    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Performance')
  }

  private addRawDataSheet(data: any[]) {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const rows = data.map(item => headers.map(header => item[header]))

    const worksheetData = [headers, ...rows]
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    
    // Auto-width columns
    worksheet['!cols'] = headers.map(() => ({ width: 20 }))

    XLSX.utils.book_append_sheet(this.workbook, worksheet, 'Datos Raw')
  }
}

export function generateExcelReport(data: ExcelReportData): Blob {
  const generator = new ExcelReportGenerator()
  return generator.generateReport(data)
}
