import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const type = searchParams.get('type') || 'monthly'

    // Obtener todos los candidatos para el período
    let query = supabase
      .from('candidates')
      .select('*')

    if (startDate) {
      query = query.gte('created_at', startDate)
    }
    if (endDate) {
      query = query.lte('created_at', endDate)
    }

    const { data: candidates, error } = await query

    if (error) {
      console.error('Error fetching candidates for report:', error)
      return NextResponse.json({ error: 'Error fetching data' }, { status: 500 })
    }

    // Calcular métricas
    const totalCandidates = candidates?.length || 0
    const hired = candidates?.filter(c => c.estatus === 'Contratado').length || 0
    const avgProcessTime = calculateAvgProcessTime(candidates || [])
    const satisfactionRate = 85 // Placeholder - esto vendría de encuestas

    // Candidatos por fuente
    const candidatesBySource = calculateCandidatesBySource(candidates || [])
    
    // Candidatos por posición
    const candidatesByPosition = calculateCandidatesByPosition(candidates || [])
    
    // Performance de reclutadores (simulado)
    const recruiterPerformance = [
      {
        recruiter: 'Ana García',
        candidates: Math.floor(totalCandidates * 0.4),
        hired: Math.floor(hired * 0.5),
        avgResponseTime: 24,
        satisfaction: 92
      },
      {
        recruiter: 'Carlos López',
        candidates: Math.floor(totalCandidates * 0.35),
        hired: Math.floor(hired * 0.3),
        avgResponseTime: 18,
        satisfaction: 88
      },
      {
        recruiter: 'María Rodríguez',
        candidates: Math.floor(totalCandidates * 0.25),
        hired: Math.floor(hired * 0.2),
        avgResponseTime: 32,
        satisfaction: 85
      }
    ]

    const reportData = {
      summary: {
        totalCandidates,
        hired,
        avgProcessTime,
        satisfactionRate,
        period: formatPeriod(startDate, endDate, type)
      },
      candidatesBySource,
      candidatesByPosition,
      recruiterPerformance,
      rawData: candidates || []
    }

    return NextResponse.json(reportData)

  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function calculateAvgProcessTime(candidates: any[]): number {
  if (candidates.length === 0) return 0
  
  const processedCandidates = candidates.filter(c => 
    c.estatus === 'Contratado' || c.estatus === 'Rechazado'
  )
  
  if (processedCandidates.length === 0) return 0
  
  const totalDays = processedCandidates.reduce((sum, candidate) => {
    const createdAt = new Date(candidate.created_at)
    const now = new Date()
    const daysDiff = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
    return sum + daysDiff
  }, 0)
  
  return Math.round(totalDays / processedCandidates.length)
}

function calculateCandidatesBySource(candidates: any[]) {
  const sources = candidates.reduce((acc, candidate) => {
    const source = candidate.fuente_reclutamiento || 'No especificado'
    acc[source] = (acc[source] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const total = candidates.length
  
  return Object.entries(sources).map(([source, count]) => ({
    source,
    count: count as number,
    percentage: total > 0 ? Math.round(((count as number) / total) * 100) : 0
  }))
}

function calculateCandidatesByPosition(candidates: any[]) {
  const positions = candidates.reduce((acc, candidate) => {
    const position = candidate.area_interes || 'No especificado'
    if (!acc[position]) {
      acc[position] = { candidates: 0, hired: 0 }
    }
    acc[position].candidates += 1
    if (candidate.estatus === 'Contratado') {
      acc[position].hired += 1
    }
    return acc
  }, {} as Record<string, { candidates: number; hired: number }>)

  return Object.entries(positions).map(([position, data]) => {
    const positionData = data as { candidates: number; hired: number }
    return {
      position,
      candidates: positionData.candidates,
      hired: positionData.hired,
      avgTime: Math.floor(Math.random() * 30) + 10 // Placeholder
    }
  })
}

function formatPeriod(startDate: string | null, endDate: string | null, type: string): string {
  if (startDate && endDate) {
    return `${new Date(startDate).toLocaleDateString('es-ES')} - ${new Date(endDate).toLocaleDateString('es-ES')}`
  }
  
  const now = new Date()
  switch (type) {
    case 'weekly':
      return `Semana del ${now.toLocaleDateString('es-ES')}`
    case 'quarterly':
      const quarter = Math.floor(now.getMonth() / 3) + 1
      return `Q${quarter} ${now.getFullYear()}`
    default:
      return `${now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`
  }
}
