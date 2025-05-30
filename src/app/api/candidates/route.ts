import { NextRequest, NextResponse } from 'next/server'
import { CandidateService } from '@/lib/services/candidate-service'
import { candidateFormSchema } from '@/lib/zod-schemas'
import { z } from 'zod'

// GET /api/candidates - Obtener todos los candidatos con filtros opcionales
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const filters = {
      search: searchParams.get('search') || undefined,
      sexo: searchParams.get('sexo') || undefined,
      estatus: searchParams.get('estatus') || undefined,
      ubicacion: searchParams.get('ubicacion') || undefined,
      zona: searchParams.get('zona') || undefined,
      area_interes: searchParams.get('area_interes') || undefined,
      edad_min: searchParams.get('edad_min') ? parseInt(searchParams.get('edad_min')!) : undefined,
      edad_max: searchParams.get('edad_max') ? parseInt(searchParams.get('edad_max')!) : undefined,
    }

    // Debug logging para entender qué filtros llegan
    console.log('[API] Received filters:', filters);

    const candidates = await CandidateService.getAll(filters)

    return NextResponse.json({
      success: true,
      data: candidates,
      count: candidates.length
    })
  } catch (error) {
    console.error('Error fetching candidates:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener candidatos',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// POST /api/candidates - Crear nuevo candidato
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Convertir fechas de string a Date antes de validar
    const processedBody = {
      ...body,
      fecha_contacto: body.fecha_contacto ? new Date(body.fecha_contacto) : new Date(),
      fecha_entrevista: body.fecha_entrevista ? new Date(body.fecha_entrevista) : null,
    }

    // Validar datos con Zod
    const validatedData = candidateFormSchema.parse(processedBody)

    // Verificar si la cédula ya existe
    const existingCandidate = await CandidateService.existsByCedula(validatedData.cedula)
    if (existingCandidate) {
      return NextResponse.json(
        {
          success: false,
          error: 'Ya existe un candidato con esta cédula'
        },
        { status: 400 }
      )
    }

    const candidate = await CandidateService.create(validatedData)

    return NextResponse.json({
      success: true,
      data: candidate,
      message: 'Candidato creado exitosamente'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating candidate:', error)

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
        error: 'Error al crear candidato',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
