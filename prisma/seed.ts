import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Limpiar datos existentes
  await prisma.candidate.deleteMany()
  await prisma.zone.deleteMany()
  await prisma.location.deleteMany()

  // Crear ubicaciones y zonas
  const caracas = await prisma.location.create({
    data: {
      name: 'Caracas',
      zones: {
        create: [
          { name: 'Petare' },
          { name: 'El Paraíso' },
          { name: 'Propatria' },
          { name: 'Junquito' },
          { name: 'El Hatillo' },
          { name: 'Caricuao' },
          { name: 'Altagracia' },
          { name: 'Libertador' },
          { name: 'Santa Rosalía' },
          { name: 'Catia' },
          { name: 'Otro' }
        ]
      }
    }
  })

  const losTeques = await prisma.location.create({
    data: {
      name: 'Los Teques (Altos Mirandinos)',
      zones: {
        create: [
          { name: 'Los Teques Centro' },
          { name: 'Carrizal' },
          { name: 'San Antonio de los Altos' },
          { name: 'El Jarillo' },
          { name: 'Otro' }
        ]
      }
    }
  })

  // Crear candidatos de ejemplo
  const candidatos = [
    {
      nombres_apellidos: 'Ana Sofia Gómez',
      cedula: '12345678',
      sexo: 'Femenino' as const,
      edad: 28,
      num_hijos: 1,
      canal_recepcion: 'PortalWeb' as const,
      fuente: 'Computrabajo',
      referido: '',
      tipo_contacto: 'Correo' as const,
      fecha_contacto: new Date('2023-10-15'),
      telefonos: '0412-3456789',
      citado_entrevista: true,
      fecha_entrevista: new Date('2023-10-20'),
      entrevistador_telefonico: 'Laura Paez',
      entrevistador_presencial: 'Carlos Ruiz',
      solicitud_empleo: true,
      guia_entrevista: true,
      ubicacion: 'Caracas',
      zona_reside: 'Libertador',
      direccion: 'Av. Principal, Edif. Sol, Apto 5, Caracas',
      area_interes: 'Administracion' as const,
      expectativa_salarial: 600,
      experiencia: 'Experiencia de 5 años en administración de empresas, manejo de personal y procesos administrativos.',
      cuenta_bancaria: '01020123456789012345',
      seguridad_bancaria: '1234',
      estatus: 'Entrevistado' as const,
      pds_asignado: 'María González',
      comentarios: 'Candidata muy prometedora con excelente actitud.'
    },
    {
      nombres_apellidos: 'Carlos Eduardo Martínez',
      cedula: '87654321',
      sexo: 'Masculino' as const,
      edad: 32,
      num_hijos: 2,
      canal_recepcion: 'BolsaEmpleo' as const,
      fuente: 'LinkedIn',
      referido: 'Juan Pérez',
      tipo_contacto: 'EntrevistaTelefonica' as const,
      fecha_contacto: new Date('2023-10-18'),
      telefonos: '0424-9876543',
      citado_entrevista: false,
      fecha_entrevista: null,
      entrevistador_telefonico: '',
      entrevistador_presencial: '',
      solicitud_empleo: true,
      guia_entrevista: false,
      ubicacion: 'Los Teques (Altos Mirandinos)',
      zona_reside: 'Carrizal',
      direccion: 'Calle 5, Casa 123, Carrizal',
      area_interes: 'OperarioMantenimiento' as const,
      expectativa_salarial: 800,
      experiencia: 'Operario de mantenimiento con 7 años de experiencia en equipos industriales y sistemas eléctricos.',
      cuenta_bancaria: '',
      seguridad_bancaria: '',
      estatus: 'AConsiderar' as const,
      pds_asignado: '',
      comentarios: 'Perfil técnico muy sólido, pendiente por contactar.'
    },
    {
      nombres_apellidos: 'María Fernanda López',
      cedula: '11223344',
      sexo: 'Femenino' as const,
      edad: 25,
      num_hijos: 0,
      canal_recepcion: 'EntregaCVPresencial' as const,
      fuente: '',
      referido: 'Ana Gómez',
      tipo_contacto: 'Llamada' as const,
      fecha_contacto: new Date('2023-10-20'),
      telefonos: '0416-5555555',
      citado_entrevista: true,
      fecha_entrevista: new Date('2023-10-25'),
      entrevistador_telefonico: 'Pedro Ramírez',
      entrevistador_presencial: 'Laura Paez',
      solicitud_empleo: true,
      guia_entrevista: true,
      ubicacion: 'Caracas',
      zona_reside: 'El Hatillo',
      direccion: 'Urb. Los Naranjos, Casa 45, El Hatillo',
      area_interes: 'ServiciosGenerales' as const,
      expectativa_salarial: 550,
      experiencia: 'Especialista en servicios generales con 3 años de experiencia en limpieza y mantenimiento de oficinas.',
      cuenta_bancaria: '01050987654321098765',
      seguridad_bancaria: '5678',
      estatus: 'Elegible' as const,
      pds_asignado: 'Carlos Ruiz',
      comentarios: 'Excelente candidata para el área de servicios generales, muy responsable.'
    },
    {
      nombres_apellidos: 'José Antonio Rodríguez',
      cedula: '55667788',
      sexo: 'Masculino' as const,
      edad: 35,
      num_hijos: 3,
      canal_recepcion: 'Facebook' as const,
      fuente: 'Facebook Jobs',
      referido: '',
      tipo_contacto: 'Mensaje' as const,
      fecha_contacto: new Date('2023-10-22'),
      telefonos: '0426-7777777',
      citado_entrevista: false,
      fecha_entrevista: null,
      entrevistador_telefonico: '',
      entrevistador_presencial: '',
      solicitud_empleo: false,
      guia_entrevista: false,
      ubicacion: 'Caracas',
      zona_reside: 'Catia',
      direccion: 'Sector 5, Manzana 12, Casa 8, Catia',
      area_interes: 'EncargadaDePDS' as const,
      expectativa_salarial: 700,
      experiencia: 'Encargado de PDS con 8 años de experiencia en gestión de personal y supervisión de equipos.',
      cuenta_bancaria: '',
      seguridad_bancaria: '',
      estatus: 'NoContesta' as const,
      pds_asignado: '',
      comentarios: 'Candidato no ha respondido a las llamadas.'
    },
    {
      nombres_apellidos: 'Carmen Elena Vásquez',
      cedula: '99887766',
      sexo: 'Femenino' as const,
      edad: 29,
      num_hijos: 1,
      canal_recepcion: 'WhatsApp' as const,
      fuente: 'Referido interno',
      referido: 'María López',
      tipo_contacto: 'Entrevista' as const,
      fecha_contacto: new Date('2023-10-25'),
      telefonos: '0414-8888888',
      citado_entrevista: true,
      fecha_entrevista: new Date('2023-10-30'),
      entrevistador_telefonico: 'Ana García',
      entrevistador_presencial: 'Pedro Martínez',
      solicitud_empleo: true,
      guia_entrevista: true,
      ubicacion: 'Los Teques (Altos Mirandinos)',
      zona_reside: 'San Antonio de los Altos',
      direccion: 'Calle Los Pinos, Casa 25, San Antonio',
      area_interes: 'OperarioMantenimientoServiciosGenerales' as const,
      expectativa_salarial: 650,
      experiencia: 'Experiencia mixta en mantenimiento y servicios generales, 4 años en empresas de manufactura.',
      cuenta_bancaria: '01340555666777888999',
      seguridad_bancaria: '9876',
      estatus: 'Contratado' as const,
      pds_asignado: 'Luis Hernández',
      comentarios: 'Candidata contratada exitosamente, excelente desempeño en entrevista.'
    }
  ]

  for (const candidato of candidatos) {
    await prisma.candidate.create({
      data: candidato
    })
  }

  console.log('✅ Seed completado exitosamente!')
  console.log(`📊 Creados ${candidatos.length} candidatos de ejemplo con todas las opciones`)
  console.log('🏢 Creadas ubicaciones: Caracas, Los Teques')
  console.log('🎯 Incluye ejemplos de todas las opciones de enums')
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
