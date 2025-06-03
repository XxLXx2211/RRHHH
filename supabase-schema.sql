-- Script SQL para crear las tablas en Supabase
-- Ejecuta este script en el SQL Editor de tu dashboard de Supabase

-- Crear tipos enum
CREATE TYPE "Sexo" AS ENUM ('Masculino', 'Femenino');
CREATE TYPE "CanalRecepcion" AS ENUM ('Telefono', 'WhatsApp', 'Email', 'Presencial', 'RedesSociales', 'Referido', 'PaginaWeb', 'Otro');
CREATE TYPE "TipoContacto" AS ENUM ('Llamada', 'WhatsApp', 'Email', 'Presencial', 'Mensaje', 'Otro');
CREATE TYPE "EstatusCandidato" AS ENUM ('NoInteresado', 'NoContesta', 'Rechazado', 'Nuevo', 'EnProceso', 'Entrevistado', 'Contratado', 'Descartado', 'EnEspera');
CREATE TYPE "AreaInteres" AS ENUM ('OperarioMantenimiento', 'ServiciosGenerales', 'EncargadaDePDS', 'OperarioMantenimientoServiciosGenerales', 'Ventas', 'Administracion', 'Marketing', 'TecnologiaInformacion', 'RecursosHumanos', 'Finanzas', 'Operaciones', 'AtencionCliente', 'Logistica', 'Produccion', 'Otro');

-- Crear tabla candidates
CREATE TABLE "candidates" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "nombres_apellidos" TEXT NOT NULL,
    "cedula" TEXT NOT NULL UNIQUE,
    "sexo" "Sexo" NOT NULL,
    "edad" INTEGER,
    "num_hijos" INTEGER,
    "canal_recepcion" "CanalRecepcion" NOT NULL,
    "fuente" TEXT,
    "referido" TEXT,
    "tipo_contacto" "TipoContacto" NOT NULL,
    "fecha_contacto" TIMESTAMP WITH TIME ZONE NOT NULL,
    "telefonos" TEXT NOT NULL,
    "citado_entrevista" BOOLEAN NOT NULL,
    "fecha_entrevista" TIMESTAMP WITH TIME ZONE,
    "entrevistador_telefonico" TEXT,
    "entrevistador_presencial" TEXT,
    "solicitud_empleo" BOOLEAN NOT NULL,
    "guia_entrevista" BOOLEAN NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "zona_reside" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "area_interes" "AreaInteres" NOT NULL,
    "expectativa_salarial" INTEGER,
    "experiencia" TEXT NOT NULL,
    "cuenta_bancaria" TEXT,
    "seguridad_bancaria" TEXT,
    "estatus" "EstatusCandidato" NOT NULL,
    "pds_asignado" TEXT,
    "comentarios" TEXT,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla locations
CREATE TABLE "locations" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla zones
CREATE TABLE "zones" (
    "id" UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    "name" TEXT NOT NULL,
    "location_id" UUID NOT NULL REFERENCES "locations"("id") ON DELETE CASCADE,
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE("name", "location_id")
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX "idx_candidates_cedula" ON "candidates"("cedula");
CREATE INDEX "idx_candidates_estatus" ON "candidates"("estatus");
CREATE INDEX "idx_candidates_area_interes" ON "candidates"("area_interes");
CREATE INDEX "idx_candidates_ubicacion" ON "candidates"("ubicacion");
CREATE INDEX "idx_candidates_created_at" ON "candidates"("created_at");
CREATE INDEX "idx_candidates_nombres_apellidos" ON "candidates"("nombres_apellidos");

-- Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear triggers para actualizar updated_at
CREATE TRIGGER update_candidates_updated_at BEFORE UPDATE ON "candidates"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON "locations"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_zones_updated_at BEFORE UPDATE ON "zones"
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insertar datos de ejemplo para locations
INSERT INTO "locations" ("name") VALUES 
    ('Santo Domingo'),
    ('Santiago'),
    ('La Romana'),
    ('San Pedro de Macorís'),
    ('Puerto Plata')
ON CONFLICT ("name") DO NOTHING;

-- Insertar datos de ejemplo para zones
INSERT INTO "zones" ("name", "location_id") 
SELECT 'Zona Norte', l.id FROM "locations" l WHERE l.name = 'Santo Domingo'
UNION ALL
SELECT 'Zona Sur', l.id FROM "locations" l WHERE l.name = 'Santo Domingo'
UNION ALL
SELECT 'Zona Este', l.id FROM "locations" l WHERE l.name = 'Santo Domingo'
UNION ALL
SELECT 'Zona Oeste', l.id FROM "locations" l WHERE l.name = 'Santo Domingo'
UNION ALL
SELECT 'Centro', l.id FROM "locations" l WHERE l.name = 'Santiago'
UNION ALL
SELECT 'Periferia', l.id FROM "locations" l WHERE l.name = 'Santiago'
ON CONFLICT ("name", "location_id") DO NOTHING;

-- Habilitar Row Level Security (RLS) - opcional pero recomendado
ALTER TABLE "candidates" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "locations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "zones" ENABLE ROW LEVEL SECURITY;

-- Crear políticas básicas (permitir todo por ahora - puedes restringir después)
CREATE POLICY "Allow all operations on candidates" ON "candidates" FOR ALL USING (true);
CREATE POLICY "Allow all operations on locations" ON "locations" FOR ALL USING (true);
CREATE POLICY "Allow all operations on zones" ON "zones" FOR ALL USING (true);

-- Mensaje de confirmación
SELECT 'Tablas creadas exitosamente en Supabase!' as message;
