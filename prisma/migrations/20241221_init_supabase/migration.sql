-- CreateEnum
CREATE TYPE "Sexo" AS ENUM ('Masculino', 'Femenino');

-- CreateEnum
CREATE TYPE "CanalRecepcion" AS ENUM ('Telefono', 'WhatsApp', 'Email', 'Presencial', 'RedesSociales', 'Referido', 'PaginaWeb', 'Otro');

-- CreateEnum
CREATE TYPE "TipoContacto" AS ENUM ('Llamada', 'WhatsApp', 'Email', 'Presencial', 'Mensaje', 'Otro');

-- CreateEnum
CREATE TYPE "EstatusCandidato" AS ENUM ('NoInteresado', 'NoContesta', 'Rechazado', 'Nuevo', 'EnProceso', 'Entrevistado', 'Contratado', 'Descartado', 'EnEspera');

-- CreateEnum
CREATE TYPE "AreaInteres" AS ENUM ('OperarioMantenimiento', 'ServiciosGenerales', 'EncargadaDePDS', 'OperarioMantenimientoServiciosGenerales', 'Ventas', 'Administracion', 'Marketing', 'TecnologiaInformacion', 'RecursosHumanos', 'Finanzas', 'Operaciones', 'AtencionCliente', 'Logistica', 'Produccion', 'Otro');

-- CreateTable
CREATE TABLE "candidates" (
    "id" TEXT NOT NULL,
    "nombres_apellidos" TEXT NOT NULL,
    "cedula" TEXT NOT NULL,
    "sexo" "Sexo" NOT NULL,
    "edad" INTEGER,
    "num_hijos" INTEGER,
    "canal_recepcion" "CanalRecepcion" NOT NULL,
    "fuente" TEXT,
    "referido" TEXT,
    "tipo_contacto" "TipoContacto" NOT NULL,
    "fecha_contacto" TIMESTAMP(3) NOT NULL,
    "telefonos" TEXT NOT NULL,
    "citado_entrevista" BOOLEAN NOT NULL,
    "fecha_entrevista" TIMESTAMP(3),
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
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zones" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "location_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "zones_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidates_cedula_key" ON "candidates"("cedula");

-- CreateIndex
CREATE UNIQUE INDEX "locations_name_key" ON "locations"("name");

-- CreateIndex
CREATE UNIQUE INDEX "zones_name_location_id_key" ON "zones"("name", "location_id");

-- AddForeignKey
ALTER TABLE "zones" ADD CONSTRAINT "zones_location_id_fkey" FOREIGN KEY ("location_id") REFERENCES "locations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
