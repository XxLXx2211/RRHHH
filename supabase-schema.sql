-- =====================================================
-- ESQUEMA ULTRA-BÁSICO PARA SUPABASE - CandidatoScope RRHH
-- =====================================================
-- Versión mínima compatible con CUALQUIER cuenta de Supabase
-- URL: https://rwcbpuekhaujyzgaodro.supabase.co

-- Crear tabla principal de candidatos (versión ultra-básica)
CREATE TABLE candidates (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,

  -- Información Personal
  nombres_apellidos TEXT NOT NULL,
  cedula TEXT UNIQUE NOT NULL,
  sexo TEXT NOT NULL,
  edad INTEGER,
  num_hijos INTEGER,

  -- Información de Contacto
  canal_recepcion TEXT NOT NULL,
  fuente TEXT,
  referido TEXT,
  tipo_contacto TEXT NOT NULL,
  fecha_contacto TEXT NOT NULL,
  telefonos TEXT NOT NULL,

  -- Proceso de Entrevista
  citado_entrevista BOOLEAN NOT NULL DEFAULT false,
  fecha_entrevista TEXT,
  entrevistador_telefonico TEXT,
  entrevistador_presencial TEXT,
  solicitud_empleo BOOLEAN NOT NULL DEFAULT false,
  guia_entrevista BOOLEAN NOT NULL DEFAULT false,

  -- Información de Ubicación
  ubicacion TEXT NOT NULL,
  zona_reside TEXT NOT NULL,
  direccion TEXT NOT NULL,

  -- Información Profesional
  area_interes TEXT NOT NULL,
  expectativa_salarial INTEGER,
  experiencia TEXT NOT NULL,

  -- Información Bancaria
  cuenta_bancaria TEXT,
  seguridad_bancaria TEXT,

  -- Seguimiento y Estatus
  estatus TEXT NOT NULL DEFAULT 'Nuevo',
  pds_asignado TEXT,
  comentarios TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertar datos de ejemplo (opcional)
INSERT INTO candidates (
  nombres_apellidos,
  cedula,
  sexo,
  edad,
  canal_recepcion,
  tipo_contacto,
  fecha_contacto,
  telefonos,
  citado_entrevista,
  ubicacion,
  zona_reside,
  direccion,
  area_interes,
  expectativa_salarial,
  experiencia,
  estatus
) VALUES 
(
  'Juan Pérez García',
  '001-1234567-8',
  'Masculino',
  28,
  'Web',
  'Llamada',
  '2024-01-15T10:30:00.000Z',
  '809-555-1234',
  true,
  'Santo Domingo',
  'Zona Norte',
  'Calle Principal #123, Sector Los Jardines',
  'TecnologiaInformacion',
  45000,
  'Desarrollador Full Stack con 3 años de experiencia en React, Node.js y PostgreSQL. Experiencia en metodologías ágiles y trabajo en equipo.',
  'EnProceso'
),
(
  'María González López',
  '001-9876543-2',
  'Femenino',
  32,
  'Referido',
  'Entrevista',
  '2024-01-20T14:00:00.000Z',
  '829-555-5678',
  true,
  'Santiago',
  'Centro',
  'Av. 27 de Febrero #456, Ensanche Bella Vista',
  'RecursosHumanos',
  38000,
  'Licenciada en Psicología con especialización en RRHH. 5 años de experiencia en reclutamiento, selección y desarrollo organizacional.',
  'Entrevistado'
);

-- =====================================================
-- ESQUEMA CREADO EXITOSAMENTE
-- =====================================================
-- La tabla 'candidates' está lista para usar con la aplicación CandidatoScope
-- Incluye 2 registros de ejemplo para probar la funcionalidad
-- Versión simplificada compatible con permisos básicos de Supabase

-- NOTA: Si necesitas Row Level Security (RLS), puedes habilitarlo desde el dashboard:
-- 1. Ve a Authentication > Policies
-- 2. Habilita RLS para la tabla candidates
-- 3. Crea políticas según tus necesidades de seguridad
