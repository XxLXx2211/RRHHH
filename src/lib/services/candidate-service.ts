import { prisma } from '@/lib/prisma'
import { Candidate, Prisma } from '@prisma/client'
import { CandidateFormData } from '@/types'
import { AreaInteres, EstatusCandidato, CanalRecepcion, TipoContacto, Sexo } from '@/types'
import { normalizeSexoForFilter, normalizeEstatusForFilter, normalizeAreaInteresForFilter } from '@/lib/enum-utils'
import { prepareFormDataForSubmission } from '@/lib/candidate-form-utils'

// Funciones de mapeo para convertir valores de display a claves de enum (legacy - mantenido para compatibilidad)
const getEnumKeyFromValue = <T extends Record<string, string>>(enumObj: T, value: string): keyof T | string => {
  const entry = Object.entries(enumObj).find(([_, val]) => val === value);
  return entry ? entry[0] : value;
};

export class CandidateService {
  // Obtener todos los candidatos con filtros opcionales
  static async getAll(filters?: {
    search?: string
    sexo?: string
    estatus?: string
    ubicacion?: string
    zona?: string
    area_interes?: string
    edad_min?: number
    edad_max?: number
  }) {
    const where: Prisma.CandidateWhereInput = {}

    if (filters?.search) {
      where.OR = [
        { nombres_apellidos: { contains: filters.search, mode: 'insensitive' } },
        { cedula: { contains: filters.search } },
        { experiencia: { contains: filters.search, mode: 'insensitive' } },
        { comentarios: { contains: filters.search, mode: 'insensitive' } },
        { telefonos: { contains: filters.search } },
        { direccion: { contains: filters.search, mode: 'insensitive' } },
        { pds_asignado: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    if (filters?.sexo && filters.sexo !== 'Todos') {
      const sexoKey = normalizeSexoForFilter(filters.sexo);
      where.sexo = sexoKey as any;
    }

    if (filters?.estatus && filters.estatus !== 'Todos') {
      const estatusKey = normalizeEstatusForFilter(filters.estatus);
      where.estatus = estatusKey as any;
    }

    if (filters?.ubicacion && filters.ubicacion !== 'Todas') {
      where.ubicacion = filters.ubicacion;
    }

    if (filters?.zona && filters.zona !== 'Todas') {
      where.zona_reside = filters.zona;
    }

    if (filters?.area_interes && filters.area_interes !== 'Todos') {
      const areaKey = normalizeAreaInteresForFilter(filters.area_interes);
      where.area_interes = areaKey as any;
    }

    if (filters?.edad_min || filters?.edad_max) {
      where.edad = {}
      if (filters.edad_min) where.edad.gte = filters.edad_min
      if (filters.edad_max) where.edad.lte = filters.edad_max
    }

    // Debug: Log the final where clause
    console.log('[CandidateService] Final Prisma where clause:', JSON.stringify(where, null, 2));

    const candidates = await prisma.candidate.findMany({
      where,
      orderBy: { created_at: 'desc' }
    })

    console.log(`[CandidateService] Found ${candidates.length} candidates matching filters`);

    // Convertir fechas para serialización JSON
    return candidates.map(candidate => ({
      ...candidate,
      fecha_contacto: candidate.fecha_contacto,
      fecha_entrevista: candidate.fecha_entrevista,
      created_at: candidate.created_at,
      updated_at: candidate.updated_at
    }))
  }

  // Obtener candidato por ID
  static async getById(id: string) {
    return await prisma.candidate.findUnique({
      where: { id }
    })
  }

  // Crear nuevo candidato
  static async create(data: CandidateFormData) {
    const preparedData = prepareFormDataForSubmission(data);
    console.log('[CandidateService] Creating candidate with prepared data:', preparedData);
    return await prisma.candidate.create({
      data: {
        ...preparedData,
        // Convertir fechas si es necesario
        fecha_contacto: new Date(preparedData.fecha_contacto),
        fecha_entrevista: preparedData.fecha_entrevista ? new Date(preparedData.fecha_entrevista) : null
      }
    })
  }

  // Actualizar candidato
  static async update(id: string, data: Partial<CandidateFormData>) {
    const preparedData = prepareFormDataForSubmission(data as CandidateFormData);
    return await prisma.candidate.update({
      where: { id },
      data: {
        ...preparedData,
        // Convertir fechas si es necesario
        fecha_contacto: preparedData.fecha_contacto ? new Date(preparedData.fecha_contacto) : undefined,
        fecha_entrevista: preparedData.fecha_entrevista ? new Date(preparedData.fecha_entrevista) : undefined
      }
    })
  }

  // Eliminar candidato
  static async delete(id: string) {
    return await prisma.candidate.delete({
      where: { id }
    })
  }

  // Verificar si cédula ya existe
  static async existsByCedula(cedula: string, excludeId?: string) {
    const where: Prisma.CandidateWhereInput = { cedula }
    if (excludeId) {
      where.id = { not: excludeId }
    }

    const candidate = await prisma.candidate.findFirst({ where })
    return !!candidate
  }

  // Obtener estadísticas
  static async getStats() {
    const [
      total,
      nuevos,
      entrevistados,
      contratados,
      porSexo,
      porEstatus,
      porAreaInteres
    ] = await Promise.all([
      prisma.candidate.count(),
      prisma.candidate.count({ where: { estatus: 'Nuevo' } }),
      prisma.candidate.count({ where: { estatus: 'Entrevistado' } }),
      prisma.candidate.count({ where: { estatus: 'Contratado' } }),
      prisma.candidate.groupBy({
        by: ['sexo'],
        _count: { _all: true }
      }),
      prisma.candidate.groupBy({
        by: ['estatus'],
        _count: { _all: true }
      }),
      prisma.candidate.groupBy({
        by: ['area_interes'],
        _count: { _all: true }
      })
    ])

    return {
      total,
      nuevos,
      entrevistados,
      contratados,
      porSexo,
      porEstatus,
      porAreaInteres
    }
  }
}
