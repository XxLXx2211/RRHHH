import { NextRequest, NextResponse } from 'next/server'
import { CandidateService } from '@/lib/services/candidate-service'

// GET /api/candidates/stats - Obtener estadísticas de candidatos
export async function GET(request: NextRequest) {
  try {
    const stats = await CandidateService.getStats()
    
    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Error fetching candidate stats:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener estadísticas',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
