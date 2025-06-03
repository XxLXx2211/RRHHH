import { supabaseHelpers, SupabaseCandidate } from '@/lib/supabase'
import { CandidateFormData } from '@/types'

// Servicio de candidatos usando Supabase directamente
export class SupabaseCandidateService {
  // Obtener todos los candidatos con filtros opcionales
  static async getAll(filters: {
    search?: string
    estatus?: string
    area_interes?: string
    ubicacion?: string
    page?: number
    limit?: number
  } = {}) {
    try {
      console.log('🔍 [Supabase] Obteniendo candidatos con filtros:', filters)
      
      const limit = filters.limit || 50
      const offset = filters.page ? (filters.page - 1) * limit : 0

      const candidates = await supabaseHelpers.getCandidates({
        ...filters,
        limit,
        offset
      })

      console.log(`✅ [Supabase] ${candidates.length} candidatos obtenidos`)
      return candidates
    } catch (error) {
      console.error('❌ [Supabase] Error al obtener candidatos:', error)
      throw error
    }
  }

  // Obtener candidato por ID
  static async getById(id: string) {
    try {
      console.log(`🔍 [Supabase] Obteniendo candidato ID: ${id}`)
      const candidate = await supabaseHelpers.getCandidateById(id)
      console.log('✅ [Supabase] Candidato obtenido')
      return candidate
    } catch (error) {
      console.error('❌ [Supabase] Error al obtener candidato:', error)
      throw error
    }
  }

  // Crear nuevo candidato
  static async create(data: CandidateFormData) {
    try {
      console.log('🔍 [Supabase] Creando candidato:', data.nombres_apellidos)
      
      // Convertir datos del formulario al formato de Supabase
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
        fecha_contacto: data.fecha_contacto,
        telefonos: data.telefonos,
        citado_entrevista: data.citado_entrevista,
        fecha_entrevista: data.fecha_entrevista || undefined,
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

      const candidate = await supabaseHelpers.createCandidate(candidateData)
      console.log('✅ [Supabase] Candidato creado con ID:', candidate.id)
      return candidate
    } catch (error) {
      console.error('❌ [Supabase] Error al crear candidato:', error)
      throw error
    }
  }

  // Actualizar candidato existente
  static async update(id: string, data: Partial<CandidateFormData>) {
    try {
      console.log(`🔍 [Supabase] Actualizando candidato ID: ${id}`)
      
      // Convertir datos del formulario al formato de Supabase
      const updateData: Partial<Omit<SupabaseCandidate, 'id' | 'created_at' | 'updated_at'>> = {}
      
      if (data.nombres_apellidos !== undefined) updateData.nombres_apellidos = data.nombres_apellidos
      if (data.cedula !== undefined) updateData.cedula = data.cedula
      if (data.sexo !== undefined) updateData.sexo = data.sexo as 'Masculino' | 'Femenino'
      if (data.edad !== undefined) updateData.edad = data.edad
      if (data.num_hijos !== undefined) updateData.num_hijos = data.num_hijos
      if (data.canal_recepcion !== undefined) updateData.canal_recepcion = data.canal_recepcion as any
      if (data.fuente !== undefined) updateData.fuente = data.fuente
      if (data.referido !== undefined) updateData.referido = data.referido
      if (data.tipo_contacto !== undefined) updateData.tipo_contacto = data.tipo_contacto as any
      if (data.fecha_contacto !== undefined) updateData.fecha_contacto = data.fecha_contacto
      if (data.telefonos !== undefined) updateData.telefonos = data.telefonos
      if (data.citado_entrevista !== undefined) updateData.citado_entrevista = data.citado_entrevista
      if (data.fecha_entrevista !== undefined) updateData.fecha_entrevista = data.fecha_entrevista
      if (data.entrevistador_telefonico !== undefined) updateData.entrevistador_telefonico = data.entrevistador_telefonico
      if (data.entrevistador_presencial !== undefined) updateData.entrevistador_presencial = data.entrevistador_presencial
      if (data.solicitud_empleo !== undefined) updateData.solicitud_empleo = data.solicitud_empleo
      if (data.guia_entrevista !== undefined) updateData.guia_entrevista = data.guia_entrevista
      if (data.ubicacion !== undefined) updateData.ubicacion = data.ubicacion
      if (data.zona_reside !== undefined) updateData.zona_reside = data.zona_reside
      if (data.direccion !== undefined) updateData.direccion = data.direccion
      if (data.area_interes !== undefined) updateData.area_interes = data.area_interes as any
      if (data.expectativa_salarial !== undefined) updateData.expectativa_salarial = data.expectativa_salarial
      if (data.experiencia !== undefined) updateData.experiencia = data.experiencia
      if (data.cuenta_bancaria !== undefined) updateData.cuenta_bancaria = data.cuenta_bancaria
      if (data.seguridad_bancaria !== undefined) updateData.seguridad_bancaria = data.seguridad_bancaria
      if (data.estatus !== undefined) updateData.estatus = data.estatus as any
      if (data.pds_asignado !== undefined) updateData.pds_asignado = data.pds_asignado
      if (data.comentarios !== undefined) updateData.comentarios = data.comentarios

      const candidate = await supabaseHelpers.updateCandidate(id, updateData)
      console.log('✅ [Supabase] Candidato actualizado')
      return candidate
    } catch (error) {
      console.error('❌ [Supabase] Error al actualizar candidato:', error)
      throw error
    }
  }

  // Eliminar candidato
  static async delete(id: string) {
    try {
      console.log(`🔍 [Supabase] Eliminando candidato ID: ${id}`)
      await supabaseHelpers.deleteCandidate(id)
      console.log('✅ [Supabase] Candidato eliminado')
    } catch (error) {
      console.error('❌ [Supabase] Error al eliminar candidato:', error)
      throw error
    }
  }

  // Probar conexión
  static async testConnection() {
    try {
      console.log('🔍 [Supabase] Probando conexión...')
      const result = await supabaseHelpers.testConnection()
      console.log('✅ [Supabase] Conexión probada:', result.message)
      return result
    } catch (error) {
      console.error('❌ [Supabase] Error al probar conexión:', error)
      throw error
    }
  }
}
