

export enum Sexo {
  Masculino = "Masculino",
  Femenino = "Femenino",
}

export enum CanalRecepcion {
  Web = "Web",
  Referido = "Referido",
  Oficina = "Oficina",
  RedesSociales = "Redes Sociales",
  BolsaEmpleo = "Bolsa de Empleo",
  EntregaCVPresencial = "Entrega CV Presencial",
  WhatsApp = "WhatsApp",
  PortalWeb = "Portal Web",
  LlamadaDirecta = "Llamada Directa",
  Facebook = "Facebook",
}

export enum TipoContacto {
  Llamada = "Llamada",
  Correo = "Email",
  Presencial = "Presencial",
  Mensaje = "Mensaje",
  Entrevista = "Entrevista",
  EntrevistaTelefonica = "Entrevista Telefónica",
  WhatsApp = "WhatsApp",
}

export enum EstatusCandidato {
  Asignado = "Asignado",
  NoElegible = "No Elegible",
  Elegible = "Elegible",
  Renuncia = "Renuncia",
  NoAsistio = "No Asistió",
  AConsiderar = "A Considerar",
  NoInteresado = "No Interesado",
  NoContesta = "No Contesta",
  Rechazado = "Rechazado",
  Nuevo = "Nuevo",
  EnProceso = "En Proceso",
  Entrevistado = "Entrevistado",
  Contratado = "Contratado",
  Descartado = "Descartado",
  EnEspera = "En Espera",
}

export enum AreaInteres {
  OperarioMantenimiento = "Operario de Mantenimiento",
  ServiciosGenerales = "Servicios Generales",
  EncargadaDePDS = "Encargada de PDS",
  OperarioMantenimientoServiciosGenerales = "Operario de Mantenimiento / Servicios Generales",
  Ventas = "Ventas",
  Administracion = "Administración",
  Marketing = "Marketing",
  TecnologiaInformacion = "Tecnología e Información",
  RecursosHumanos = "Recursos Humanos",
  Finanzas = "Finanzas",
  Operaciones = "Operaciones",
  AtencionCliente = "Atención al Cliente",
  Logistica = "Logística",
  Produccion = "Producción",
  Otro = "Otro",
}

export interface Candidate {
  id: string;
  // Información Personal
  nombres_apellidos: string;
  cedula: string;
  sexo: Sexo;
  edad?: number | null;
  num_hijos?: number | null;
  // Información de Contacto
  canal_recepcion: CanalRecepcion;
  fuente?: string | null;
  referido?: string | null;
  tipo_contacto: TipoContacto;
  fecha_contacto: Date;
  telefonos: string;
  // Proceso de Entrevista
  citado_entrevista: boolean;
  fecha_entrevista?: Date | null;
  entrevistador_telefonico?: string | null;
  entrevistador_presencial?: string | null;
  solicitud_empleo: boolean;
  guia_entrevista: boolean;
  // Información de Ubicación
  ubicacion: string;
  zona_reside: string;
  direccion: string;
  // Información Profesional
  area_interes: AreaInteres;
  expectativa_salarial?: number | null;
  experiencia: string;
  // Información Bancaria
  cuenta_bancaria?: string | null;
  seguridad_bancaria?: string | null;
  // Seguimiento y Estatus
  estatus: EstatusCandidato;
  pds_asignado?: string | null;
  comentarios?: string | null;
  // Timestamps (agregados para compatibilidad con Prisma)
  created_at: Date;
  updated_at: Date;
}

export interface LocationData {
  [key: string]: string[];
}

// CandidateFormData excluye id y timestamps
export type CandidateFormData = Omit<Candidate, "id" | "created_at" | "updated_at">;

// Re-export Prisma types for convenience
export type { Candidate as PrismaCandidate } from '@prisma/client';
