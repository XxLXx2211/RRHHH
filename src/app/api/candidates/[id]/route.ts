import { NextRequest, NextResponse } from 'next/server'
import { CandidateService } from '@/lib/candidate-service'

// GET - Obtener candidato por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    console.log(`📋 [API] Obteniendo candidato ID: ${id}`)

    const candidate = await CandidateService.getById(id)

    return NextResponse.json({
      success: true,
      data: candidate,
      message: 'Candidato obtenido exitosamente'
    })

  } catch (error) {
    console.error('❌ [API] Error al obtener candidato:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      data: null
    }, { status: 500 })
  }
}

// PUT - Actualizar candidato
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()

    console.log(`📋 [API] Actualizando candidato ID: ${id}`)

    const candidate = await CandidateService.update(id, data)

    return NextResponse.json({
      success: true,
      data: candidate,
      message: 'Candidato actualizado exitosamente'
    })

  } catch (error) {
    console.error('❌ [API] Error al actualizar candidato:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      data: null
    }, { status: 500 })
  }
}

// DELETE - Eliminar candidato
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    console.log(`📋 [API] Eliminando candidato ID: ${id}`)

    await CandidateService.delete(id)

    return NextResponse.json({
      success: true,
      data: null,
      message: 'Candidato eliminado exitosamente'
    })

  } catch (error) {
    console.error('❌ [API] Error al eliminar candidato:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      data: null
    }, { status: 500 })
  }
}
