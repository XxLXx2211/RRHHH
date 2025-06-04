import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export interface ReportData {
  title: string
  period: string
  metrics: {
    totalCandidates: number
    hired: number
    avgProcessTime: number
    satisfactionRate: number
  }
  chartData: any[]
  detailedData: any[]
}

export class PDFReportGenerator {
  private doc: jsPDF

  constructor() {
    this.doc = new jsPDF()
  }

  async generateReport(data: ReportData): Promise<Blob> {
    // Header
    this.addHeader(data.title, data.period)
    
    // Executive Summary
    this.addExecutiveSummary(data.metrics)
    
    // Charts section (would need chart rendering)
    this.addChartsSection()
    
    // Detailed data
    this.addDetailedData(data.detailedData)
    
    // Footer
    this.addFooter()

    return new Blob([this.doc.output('blob')], { type: 'application/pdf' })
  }

  private addHeader(title: string, period: string) {
    this.doc.setFontSize(20)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('CandidatoScope', 20, 30)
    
    this.doc.setFontSize(16)
    this.doc.text(title, 20, 45)
    
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(period, 20, 55)
    
    // Line separator
    this.doc.line(20, 65, 190, 65)
  }

  private addExecutiveSummary(metrics: ReportData['metrics']) {
    let yPos = 80

    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('📊 Resumen Ejecutivo', 20, yPos)
    
    yPos += 15
    this.doc.setFontSize(11)
    this.doc.setFont('helvetica', 'normal')
    
    const summaryItems = [
      `• ${metrics.totalCandidates} candidatos recibidos`,
      `• ${metrics.hired} contrataciones exitosas`,
      `• ${metrics.avgProcessTime} días promedio de proceso`,
      `• ${metrics.satisfactionRate}% satisfacción de candidatos`
    ]

    summaryItems.forEach(item => {
      this.doc.text(item, 25, yPos)
      yPos += 8
    })
  }

  private addChartsSection() {
    let yPos = 140
    
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('📈 Gráficos y Métricas', 20, yPos)
    
    // Placeholder for charts
    yPos += 20
    this.doc.rect(20, yPos, 170, 60)
    this.doc.setFontSize(10)
    this.doc.text('[Gráfico de candidatos por fuente]', 25, yPos + 30)
  }

  private addDetailedData(data: any[]) {
    // Add new page for detailed data
    this.doc.addPage()
    
    let yPos = 30
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('📋 Datos Detallados', 20, yPos)
    
    yPos += 20
    
    // Table headers
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text('Posición', 20, yPos)
    this.doc.text('Candidatos', 70, yPos)
    this.doc.text('Contratados', 120, yPos)
    this.doc.text('Tiempo Prom.', 160, yPos)
    
    yPos += 10
    this.doc.line(20, yPos, 190, yPos)
    
    // Table data
    this.doc.setFont('helvetica', 'normal')
    data.slice(0, 20).forEach(item => { // Limit to 20 items
      yPos += 8
      this.doc.text(item.position || 'N/A', 20, yPos)
      this.doc.text(item.candidates?.toString() || '0', 70, yPos)
      this.doc.text(item.hired?.toString() || '0', 120, yPos)
      this.doc.text(`${item.avgTime || 0} días`, 160, yPos)
    })
  }

  private addFooter() {
    const pageCount = this.doc.getNumberOfPages()
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i)
      this.doc.setFontSize(8)
      this.doc.setFont('helvetica', 'normal')
      this.doc.text(
        `Generado el ${new Date().toLocaleDateString('es-ES')} - Página ${i} de ${pageCount}`,
        20,
        285
      )
      this.doc.text('CandidatoScope - Sistema de Gestión de RRHH', 120, 285)
    }
  }
}

export async function generatePDFReport(data: ReportData): Promise<Blob> {
  const generator = new PDFReportGenerator()
  return await generator.generateReport(data)
}
