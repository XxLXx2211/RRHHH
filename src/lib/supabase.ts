import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase usando las API keys
const supabaseUrl = 'https://gcyqggtvnlcmzkjffxuc.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjeXFnZ3R2bmxjbXpramZmeHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MTIwODgsImV4cCI6MjA2NDQ4ODA4OH0.PjydW5HPn8ukPCRp7LYxD5dy1IzcOXRc1Xb-lXAq5Rw'

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para la tabla candidates
export interface SupabaseCandidate {
  id: string
  nombres_apellidos: string
  cedula: string
  sexo: 'Masculino' | 'Femenino'
  edad?: number
  num_hijos?: number
  canal_recepcion: 'Telefono' | 'WhatsApp' | 'Email' | 'Presencial' | 'RedesSociales' | 'Referido' | 'PaginaWeb' | 'Otro'
  fuente?: string
  referido?: string
  tipo_contacto: 'Llamada' | 'WhatsApp' | 'Email' | 'Presencial' | 'Mensaje' | 'Otro'
  fecha_contacto: string
  telefonos: string
  citado_entrevista: boolean
  fecha_entrevista?: string
  entrevistador_telefonico?: string
  entrevistador_presencial?: string
  solicitud_empleo: boolean
  guia_entrevista: boolean
  ubicacion: string
  zona_reside: string
  direccion: string
  area_interes: 'OperarioMantenimiento' | 'ServiciosGenerales' | 'EncargadaDePDS' | 'OperarioMantenimientoServiciosGenerales' | 'Ventas' | 'Administracion' | 'Marketing' | 'TecnologiaInformacion' | 'RecursosHumanos' | 'Finanzas' | 'Operaciones' | 'AtencionCliente' | 'Logistica' | 'Produccion' | 'Otro'
  expectativa_salarial?: number
  experiencia: string
  cuenta_bancaria?: string
  seguridad_bancaria?: string
  estatus: 'NoInteresado' | 'NoContesta' | 'Rechazado' | 'Nuevo' | 'EnProceso' | 'Entrevistado' | 'Contratado' | 'Descartado' | 'EnEspera'
  pds_asignado?: string
  comentarios?: string
  created_at: string
  updated_at: string
}

// Funciones helper para trabajar con Supabase
export const supabaseHelpers = {
  // Verificar conexión
  async testConnection() {
    try {
      const { data, error } = await supabase.from('candidates').select('count').limit(1)
      if (error) throw error
      return { success: true, message: 'Conexión exitosa a Supabase' }
    } catch (error) {
      return { success: false, message: `Error de conexión: ${error}` }
    }
  },

  // Obtener todos los candidatos con filtros
  async getCandidates(filters?: {
    search?: string
    estatus?: string
    area_interes?: string
    ubicacion?: string
    limit?: number
    offset?: number
  }) {
    let query = supabase.from('candidates').select('*')

    // Aplicar filtros
    if (filters?.search) {
      query = query.or(`nombres_apellidos.ilike.%${filters.search}%,cedula.ilike.%${filters.search}%,experiencia.ilike.%${filters.search}%,comentarios.ilike.%${filters.search}%,telefonos.ilike.%${filters.search}%,direccion.ilike.%${filters.search}%,pds_asignado.ilike.%${filters.search}%`)
    }

    if (filters?.estatus) {
      query = query.eq('estatus', filters.estatus)
    }

    if (filters?.area_interes) {
      query = query.eq('area_interes', filters.area_interes)
    }

    if (filters?.ubicacion) {
      query = query.eq('ubicacion', filters.ubicacion)
    }

    // Paginación
    if (filters?.limit) {
      query = query.limit(filters.limit)
    }

    if (filters?.offset) {
      query = query.range(filters.offset, (filters.offset + (filters.limit || 50)) - 1)
    }

    // Ordenar por fecha de creación (más recientes primero)
    query = query.order('created_at', { ascending: false })

    const { data, error } = await query

    if (error) {
      throw new Error(`Error al obtener candidatos: ${error.message}`)
    }

    return data as SupabaseCandidate[]
  },

  // Obtener candidato por ID
  async getCandidateById(id: string) {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throw new Error(`Error al obtener candidato: ${error.message}`)
    }

    return data as SupabaseCandidate
  },

  // Crear candidato
  async createCandidate(candidate: Omit<SupabaseCandidate, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('candidates')
      .insert([candidate])
      .select()
      .single()

    if (error) {
      throw new Error(`Error al crear candidato: ${error.message}`)
    }

    return data as SupabaseCandidate
  },

  // Actualizar candidato
  async updateCandidate(id: string, updates: Partial<Omit<SupabaseCandidate, 'id' | 'created_at' | 'updated_at'>>) {
    const { data, error } = await supabase
      .from('candidates')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Error al actualizar candidato: ${error.message}`)
    }

    return data as SupabaseCandidate
  },

  // Eliminar candidato
  async deleteCandidate(id: string) {
    const { error } = await supabase
      .from('candidates')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Error al eliminar candidato: ${error.message}`)
    }

    return { success: true }
  }
}
