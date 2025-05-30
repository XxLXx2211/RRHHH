import type { Candidate, CandidateFormData } from '@/types';
import { getDisplayValueFromEnumKey } from '@/lib/enum-utils';
import { Sexo, CanalRecepcion, TipoContacto, EstatusCandidato, AreaInteres } from '@/types';

// Mapeo específico entre claves de Prisma y valores de TypeScript
const PRISMA_TO_TYPESCRIPT_MAPPING = {
  // Sexo mappings (incluidos por completitud)
  'Masculino': 'Masculino',
  'Femenino': 'Femenino',

  // CanalRecepcion mappings - TODOS los valores
  'Web': 'Web',
  'Referido': 'Referido',
  'Oficina': 'Oficina',
  'RedesSociales': 'Redes Sociales',
  'BolsaEmpleo': 'Bolsa de Empleo',
  'EntregaCVPresencial': 'Entrega CV Presencial',
  'WhatsApp': 'WhatsApp',
  'PortalWeb': 'Portal Web',
  'LlamadaDirecta': 'Llamada Directa',
  'Facebook': 'Facebook',

  // TipoContacto mappings - TODOS los valores
  'Llamada': 'Llamada',
  'Correo': 'Email',
  'Presencial': 'Presencial',
  'Mensaje': 'Mensaje',
  'Entrevista': 'Entrevista',
  'EntrevistaTelefonica': 'Entrevista Telefónica',
  'WhatsApp': 'WhatsApp',

  // EstatusCandidato mappings - TODOS los valores
  'Asignado': 'Asignado',
  'NoElegible': 'No Elegible',
  'Elegible': 'Elegible',
  'Renuncia': 'Renuncia',
  'NoAsistio': 'No Asistió',
  'AConsiderar': 'A Considerar',
  'NoInteresado': 'No Interesado',
  'NoContesta': 'No Contesta',
  'Rechazado': 'Rechazado',
  'Nuevo': 'Nuevo',
  'EnProceso': 'En Proceso',
  'Entrevistado': 'Entrevistado',
  'Contratado': 'Contratado',
  'Descartado': 'Descartado',
  'EnEspera': 'En Espera',

  // AreaInteres mappings - TODOS los valores
  'OperarioMantenimiento': 'Operario de Mantenimiento',
  'ServiciosGenerales': 'Servicios Generales',
  'EncargadaDePDS': 'Encargada de PDS',
  'OperarioMantenimientoServiciosGenerales': 'Operario de Mantenimiento / Servicios Generales',
  'Ventas': 'Ventas',
  'Administracion': 'Administración',
  'Marketing': 'Marketing',
  'TecnologiaInformacion': 'Tecnología e Información',
  'RecursosHumanos': 'Recursos Humanos',
  'Finanzas': 'Finanzas',
  'Operaciones': 'Operaciones',
  'AtencionCliente': 'Atención al Cliente',
  'Logistica': 'Logística',
  'Produccion': 'Producción',
  'Otro': 'Otro',
};

// Función para convertir valor de Prisma a valor de TypeScript
const mapPrismaValueToTypeScript = (value: string): string => {
  return PRISMA_TO_TYPESCRIPT_MAPPING[value as keyof typeof PRISMA_TO_TYPESCRIPT_MAPPING] || value;
};

// Mapeo inverso: de valores de TypeScript a claves de Prisma
const TYPESCRIPT_TO_PRISMA_MAPPING = Object.fromEntries(
  Object.entries(PRISMA_TO_TYPESCRIPT_MAPPING).map(([key, value]) => [value, key])
);

// Función para convertir valor de TypeScript a valor de Prisma
const mapTypeScriptValueToPrisma = (value: string): string => {
  return TYPESCRIPT_TO_PRISMA_MAPPING[value] || value;
};



/**
 * Convierte los datos de un candidato de la base de datos al formato esperado por el formulario
 */
export function mapCandidateToFormData(candidate: Candidate): CandidateFormData {
  const { id, created_at, updated_at, ...baseData } = candidate;

  // Convertir enum keys a display values y manejar valores null/undefined
  const formData: CandidateFormData = {
    ...baseData,
    // Mapear campos enum de Prisma a TypeScript
    sexo: mapPrismaValueToTypeScript(baseData.sexo || ''),
    canal_recepcion: mapPrismaValueToTypeScript(baseData.canal_recepcion || ''),
    tipo_contacto: mapPrismaValueToTypeScript(baseData.tipo_contacto || ''),
    area_interes: mapPrismaValueToTypeScript(baseData.area_interes || ''),
    estatus: mapPrismaValueToTypeScript(baseData.estatus || ''),
    // Asegurar que los campos opcionales tengan valores por defecto apropiados
    fuente: baseData.fuente || '',
    referido: baseData.referido || '',
    entrevistador_telefonico: baseData.entrevistador_telefonico || '',
    entrevistador_presencial: baseData.entrevistador_presencial || '',
    cuenta_bancaria: baseData.cuenta_bancaria || '',
    seguridad_bancaria: baseData.seguridad_bancaria || '',
    pds_asignado: baseData.pds_asignado || '',
    comentarios: baseData.comentarios || '',
    ubicacion: baseData.ubicacion || '',
    zona_reside: baseData.zona_reside || '',
    direccion: baseData.direccion || '',
    experiencia: baseData.experiencia || '',
    // Manejar campos numéricos opcionales
    edad: baseData.edad ?? undefined,
    num_hijos: baseData.num_hijos ?? undefined,
    expectativa_salarial: baseData.expectativa_salarial ?? undefined,
    // Manejar fechas
    fecha_contacto: baseData.fecha_contacto,
    fecha_entrevista: baseData.fecha_entrevista ?? undefined,
  };

  return formData;
}

/**
 * Valida que todos los campos enum tengan valores válidos
 */
export function validateEnumFields(data: CandidateFormData): string[] {
  const errors: string[] = [];

  // Validar Sexo
  if (!Object.values(Sexo).includes(data.sexo)) {
    errors.push(`Sexo inválido: ${data.sexo}`);
  }

  // Validar Canal de Recepción
  if (!Object.values(CanalRecepcion).includes(data.canal_recepcion)) {
    errors.push(`Canal de recepción inválido: ${data.canal_recepcion}`);
  }

  // Validar Tipo de Contacto
  if (!Object.values(TipoContacto).includes(data.tipo_contacto)) {
    errors.push(`Tipo de contacto inválido: ${data.tipo_contacto}`);
  }

  // Validar Área de Interés
  if (!Object.values(AreaInteres).includes(data.area_interes)) {
    errors.push(`Área de interés inválida: ${data.area_interes}`);
  }

  // Validar Estatus
  if (!Object.values(EstatusCandidato).includes(data.estatus)) {
    errors.push(`Estatus inválido: ${data.estatus}`);
  }

  return errors;
}

/**
 * Prepara los datos del formulario para envío, manejando campos opcionales y convirtiendo a formato Prisma
 */
export function prepareFormDataForSubmission(formData: CandidateFormData): CandidateFormData {
  return {
    ...formData,
    // Convertir valores de TypeScript a claves de Prisma para campos enum
    sexo: mapTypeScriptValueToPrisma(formData.sexo),
    canal_recepcion: mapTypeScriptValueToPrisma(formData.canal_recepcion),
    tipo_contacto: mapTypeScriptValueToPrisma(formData.tipo_contacto),
    area_interes: mapTypeScriptValueToPrisma(formData.area_interes),
    estatus: mapTypeScriptValueToPrisma(formData.estatus),
    // Convertir strings vacíos a null para campos opcionales
    fuente: formData.fuente?.trim() || null,
    referido: formData.referido?.trim() || null,
    entrevistador_telefonico: formData.entrevistador_telefonico?.trim() || null,
    entrevistador_presencial: formData.entrevistador_presencial?.trim() || null,
    cuenta_bancaria: formData.cuenta_bancaria?.trim() || null,
    seguridad_bancaria: formData.seguridad_bancaria?.trim() || null,
    pds_asignado: formData.pds_asignado?.trim() || null,
    comentarios: formData.comentarios?.trim() || null,
    // Manejar fecha de entrevista
    fecha_entrevista: formData.fecha_entrevista || null,
  };
}
