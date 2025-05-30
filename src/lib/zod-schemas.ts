import { z } from 'zod';
import { Sexo, CanalRecepcion, TipoContacto, EstatusCandidato, AreaInteres } from '@/types';

export const candidateFormSchema = z.object({
  nombres_apellidos: z.string().min(3, { message: "Nombres y apellidos son requeridos." }),
  cedula: z.string().min(6, { message: "Cédula es requerida." }).regex(/^\d+$/, "Cédula debe ser numérica."),
  sexo: z.nativeEnum(Sexo, { errorMap: () => ({ message: "Seleccione un sexo." }) }),
  edad: z.coerce.number().optional().nullable().transform(val => val === null ? undefined : val).refine(val => val === undefined || (val >= 18 && val <= 99), {
    message: "Edad debe estar entre 18 y 99.",
  }),
  num_hijos: z.coerce.number().optional().nullable().transform(val => val === null ? undefined : val).refine(val => val === undefined || (val >= 0 && val <= 20), {
    message: "Número de hijos debe ser entre 0 y 20.",
  }),
  canal_recepcion: z.nativeEnum(CanalRecepcion, { errorMap: () => ({ message: "Seleccione un canal de recepción." }) }),
  fuente: z.string().optional(),
  referido: z.string().optional(),
  tipo_contacto: z.nativeEnum(TipoContacto, { errorMap: () => ({ message: "Seleccione un tipo de contacto." }) }),
  fecha_contacto: z.date({ required_error: "Fecha de contacto es requerida." }),
  telefonos: z.string().min(7, { message: "Teléfono es requerido." }),
  citado_entrevista: z.boolean(),
  fecha_entrevista: z.date().optional().nullable(),
  entrevistador_telefonico: z.string().optional(),
  entrevistador_presencial: z.string().optional(),
  solicitud_empleo: z.boolean(),
  guia_entrevista: z.boolean(),
  ubicacion: z.string().min(1, { message: "Ubicación es requerida." }),
  zona_reside: z.string().min(1, { message: "Zona de residencia es requerida." }),
  direccion: z.string().min(5, { message: "Dirección es requerida." }),
  area_interes: z.nativeEnum(AreaInteres, { errorMap: () => ({ message: "Seleccione un área de interés." }) }),
  expectativa_salarial: z.coerce.number().optional().nullable().transform(val => val === null ? undefined : val).refine(val => val === undefined || val > 0, {
    message: "Expectativa salarial debe ser un número positivo.",
  }),
  experiencia: z.string().min(1, { message: "Experiencia es requerida." }), // Removed 10 char minimum
  cuenta_bancaria: z.string().optional(),
  seguridad_bancaria: z.string().optional(),
  estatus: z.nativeEnum(EstatusCandidato, { errorMap: () => ({ message: "Seleccione un estatus." }) }),
  pds_asignado: z.string().optional(),
  comentarios: z.string().optional(),
}).refine(data => {
  if (data.citado_entrevista && !data.fecha_entrevista) {
    return false;
  }
  return true;
}, {
  message: "Fecha de entrevista es requerida si fue citado.",
  path: ["fecha_entrevista"],
});

export type CandidateFormValues = z.infer<typeof candidateFormSchema>;
