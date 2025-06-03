import { NextRequest, NextResponse } from 'next/server'
import { SupabaseCandidateService } from '@/lib/services/supabase-candidate-service'

// GET - Obtener candidatos con filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const filters = {
      search: searchParams.get('search') || undefined,
      estatus: searchParams.get('estatus') || undefined,
      area_interes: searchParams.get('area_interes') || undefined,
      ubicacion: searchParams.get('ubicacion') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    }

    console.log('📋 [API] Obteniendo candidatos con filtros:', filters)

    const candidates = await SupabaseCandidateService.getAll(filters)

    return NextResponse.json({
      success: true,
      data: candidates,
      count: candidates.length,
      message: 'Candidatos obtenidos exitosamente'
    })

  } catch (error) {
    console.error('❌ [API] Error al obtener candidatos:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      data: null
    }, { status: 500 })
  }
}

// POST - Crear nuevo candidato
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    
    console.log('📋 [API] Creando candidato:', data.nombres_apellidos)

    const candidate = await SupabaseCandidateService.create(data)

    return NextResponse.json({
      success: true,
      data: candidate,
      message: 'Candidato creado exitosamente'
    }, { status: 201 })

  } catch (error) {
    console.error('❌ [API] Error al crear candidato:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      data: null
    }, { status: 500 })
  }
}
