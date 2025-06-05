import { supabase, SupabaseCandidate } from './supabase'
import { CandidateFormData } from '@/types'

export class CandidateService {
  // Obtener todos los candidatos con filtros
  static async getAll(filters: {
    search?: string
    estatus?: string
    area_interes?: string
    ubicacion?: string
    page?: number
    limit?: number
  } = {}) {
    console.log('[CANDIDATE SERVICE] Getting candidates with filters:', filters)

    try {
      // Start with simple query
      let query = supabase.from('candidates').select('*')

      // Apply filters only if they exist and are not empty
      if (filters.search && filters.search.trim()) {
        // Simplified search - just search in main fields
        query = query.or(`nombres_apellidos.ilike.%${filters.search}%,cedula.ilike.%${filters.search}%`)
      }

      if (filters.estatus && filters.estatus !== 'Todos') {
        query = query.eq('estatus', filters.estatus)
      }

      if (filters.area_interes && filters.area_interes !== 'Todos') {
        query = query.eq('area_interes', filters.area_interes)
      }

      if (filters.ubicacion && filters.ubicacion !== 'Todas') {
        query = query.eq('ubicacion', filters.ubicacion)
      }

      // Simple pagination
      const limit = filters.limit || 50
      if (limit > 0) {
        query = query.limit(limit)
      }

      if (filters.page && filters.page > 1) {
        const offset = (filters.page - 1) * limit
        query = query.range(offset, offset + limit - 1)
      }

      // Order by creation date
      query = query.order('created_at', { ascending: false })

      console.log('[CANDIDATE SERVICE] Executing query...')
      const { data, error } = await query

      if (error) {
        console.error('[CANDIDATE SERVICE] Query error:', error)
        throw new Error(`Error al obtener candidatos: ${error.message}`)
      }

      console.log('[CANDIDATE SERVICE] Query successful, found:', data?.length || 0, 'candidates')
      return data as SupabaseCandidate[]

    } catch (error) {
      console.error('[CANDIDATE SERVICE] Unexpected error:', error)
      throw error
    }
  }

  // Obtener candidato por ID
  static async getById(id: string) {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Error al obtener candidato: ${error.message}`)
    }

    return data as SupabaseCandidate
  }

  // Crear candidato
  static async create(data: CandidateFormData) {
    const candidateData: Omit<SupabaseCandidate, 'id' | 'created_at' | 'updated_at'> = {
      nombres_apellidos: data.nombres_apellidos,
      cedula: data.cedula,
      sexo: data.sexo as 'Masculino' | 'Femenino',
      edad: data.edad || undefined,
      num_hijos: data.num_hijos || undefined,
      canal_recepcion: data.canal_recepcion as any,
      fuente: data.fuente || undefined,
      referido: data.referido || undefined,
      tipo_contacto: data.tipo_contacto as any,
      fecha_contacto: data.fecha_contacto ? (data.fecha_contacto instanceof Date ? data.fecha_contacto.toISOString() : data.fecha_contacto) : '',
      telefonos: data.telefonos,
      citado_entrevista: data.citado_entrevista,
      fecha_entrevista: data.fecha_entrevista ? (data.fecha_entrevista instanceof Date ? data.fecha_entrevista.toISOString() : data.fecha_entrevista) : undefined,
      entrevistador_telefonico: data.entrevistador_telefonico || undefined,
      entrevistador_presencial: data.entrevistador_presencial || undefined,
      solicitud_empleo: data.solicitud_empleo,
      guia_entrevista: data.guia_entrevista,
      ubicacion: data.ubicacion,
      zona_reside: data.zona_reside,
      direccion: data.direccion,
      area_interes: data.area_interes as any,
      expectativa_salarial: data.expectativa_salarial || undefined,
      experiencia: data.experiencia,
      cuenta_bancaria: data.cuenta_bancaria || undefined,
      seguridad_bancaria: data.seguridad_bancaria || undefined,
      estatus: data.estatus as any,
      pds_asignado: data.pds_asignado || undefined,
      comentarios: data.comentarios || undefined
    }

    const { data: candidate, error } = await supabase
      .from('candidates')
      .insert([candidateData])
      .select()
      .single()

    if (error) {
      throw new Error(`Error al crear candidato: ${error.message}`)
    }

    return candidate as SupabaseCandidate
  }

  // Actualizar candidato
  static async update(id: string, data: Partial<CandidateFormData>) {
    const updateData: Partial<Omit<SupabaseCandidate, 'id' | 'created_at' | 'updated_at'>> = {}
    
    // Solo incluir campos que han cambiado
    Object.keys(data).forEach(key => {
      if (data[key as keyof CandidateFormData] !== undefined) {
        updateData[key as keyof typeof updateData] = data[key as keyof CandidateFormData] as any
      }
    })

    const { data: candidate, error } = await supabase
      .from('candidates')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Error al actualizar candidato: ${error.message}`)
    }

    return candidate as SupabaseCandidate
  }

  // Eliminar candidato
  static async delete(id: string) {
    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Error al eliminar candidato: ${error.message}`)
    }
  }
}
