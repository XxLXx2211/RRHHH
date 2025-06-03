#!/bin/bash

# Script de deploy para aplicación Next.js
set -e

echo "🚀 Iniciando proceso de deploy..."

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    error "No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
fi

# Verificar variables de entorno
if [ ! -f ".env" ]; then
    warning "No se encontró archivo .env. Asegúrate de configurar las variables de entorno."
fi

# 1. Verificar dependencias
log "Verificando dependencias..."
if ! command -v node &> /dev/null; then
    error "Node.js no está instalado"
fi

if ! command -v npm &> /dev/null; then
    error "npm no está instalado"
fi

# 2. Instalar dependencias
log "Instalando dependencias..."
npm ci --production=false

# 3. Verificar tipos de TypeScript
log "Verificando tipos de TypeScript..."
npm run typecheck || error "Errores de TypeScript encontrados"

# 4. Ejecutar linting
log "Ejecutando linting..."
npm run lint || error "Errores de linting encontrados"

# 5. Generar cliente de Prisma
log "Generando cliente de Prisma..."
npm run db:generate

# 6. Ejecutar migraciones de base de datos (solo en producción)
if [ "$NODE_ENV" = "production" ]; then
    log "Ejecutando migraciones de base de datos..."
    npm run db:migrate:prod
fi

# 7. Construir aplicación
log "Construyendo aplicación..."
npm run build || error "Error en la construcción"

# 8. Verificar que la construcción fue exitosa
if [ ! -d ".next" ]; then
    error "La construcción no generó el directorio .next"
fi

log "✅ Build completado exitosamente"

# 9. Opciones de deploy
echo ""
echo "Opciones de deploy disponibles:"
echo "1. Docker: npm run docker:build && npm run docker:run"
echo "2. PM2: pm2 start ecosystem.config.js --env production"
echo "3. Standalone: npm run start:prod"
echo "4. Vercel: vercel --prod"
echo "5. Manual: Copiar archivos a servidor"

echo ""
log "🎉 Deploy preparado exitosamente!"
echo "Archivos listos para deploy en:"
echo "  - .next/ (aplicación construida)"
echo "  - public/ (archivos estáticos)"
echo "  - prisma/ (esquema de base de datos)"
echo "  - package.json (dependencias)"
