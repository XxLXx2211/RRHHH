import { NextRequest, NextResponse } from 'next/server'
import { CandidateService } from '@/lib/services/candidate-service'
import { candidateFormSchema } from '@/lib/zod-schemas'
import { CandidateFormData } from '@/types'
import { z } from 'zod'

// GET /api/candidates/[id] - Obtener candidato por ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const candidate = await CandidateService.getById(id)

    if (!candidate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Candidato no encontrado'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: candidate
    })
  } catch (error) {
    console.error('Error fetching candidate:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener candidato',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// PUT /api/candidates/[id] - Actualizar candidato
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Verificar si el candidato existe
    const existingCandidate = await CandidateService.getById(id)
    if (!existingCandidate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Candidato no encontrado'
        },
        { status: 404 }
      )
    }

    // Convertir fechas de string a Date si están presentes
    const processedBody = {
      ...body,
      ...(body.fecha_contacto && { fecha_contacto: new Date(body.fecha_contacto) }),
      ...(body.fecha_entrevista && { fecha_entrevista: new Date(body.fecha_entrevista) }),
    }

    // Para actualizaciones, validamos solo los campos presentes
    const validatedData = processedBody as Partial<CandidateFormData>

    // Verificar si la cédula ya existe (excluyendo el candidato actual)
    if (validatedData.cedula) {
      const existingByCedula = await CandidateService.existsByCedula(
        validatedData.cedula,
        id
      )
      if (existingByCedula) {
        return NextResponse.json(
          {
            success: false,
            error: 'Ya existe otro candidato con esta cédula'
          },
          { status: 400 }
        )
      }
    }

    const updatedCandidate = await CandidateService.update(id, validatedData)

    return NextResponse.json({
      success: true,
      data: updatedCandidate,
      message: 'Candidato actualizado exitosamente'
    })

  } catch (error) {
    console.error('Error updating candidate:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos de entrada inválidos',
          details: error.errors
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar candidato',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// DELETE /api/candidates/[id] - Eliminar candidato
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existingCandidate = await CandidateService.getById(id)
    if (!existingCandidate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Candidato no encontrado'
        },
        { status: 404 }
      )
    }

    await CandidateService.delete(id)

    return NextResponse.json({
      success: true,
      message: 'Candidato eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error deleting candidate:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar candidato',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
