#!/bin/bash

# Script para deploy automático en Vercel
set -e

echo "🚀 Iniciando deploy en Vercel..."

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}"
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}"
    exit 1
}

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    error "No se encontró package.json. Ejecuta este script desde la raíz del proyecto."
fi

# Verificar si Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    warning "Vercel CLI no está instalado. Instalando..."
    npm install -g vercel
fi

# Verificar login en Vercel
log "Verificando autenticación en Vercel..."
if ! vercel whoami &> /dev/null; then
    log "Necesitas hacer login en Vercel..."
    vercel login
fi

# Verificar build local
log "Verificando build local..."
npm run typecheck || error "Errores de TypeScript encontrados"
npm run lint || warning "Advertencias de linting encontradas"

# Generar cliente de Prisma
log "Generando cliente de Prisma..."
npx prisma generate

# Build local para verificar
log "Construyendo aplicación localmente..."
npm run build || error "Error en la construcción local"

# Configurar variables de entorno si no existen
log "Verificando variables de entorno en Vercel..."

# Función para configurar variable de entorno
setup_env_var() {
    local var_name=$1
    local var_value=$2
    local description=$3
    
    echo "Configurando $var_name..."
    echo "Descripción: $description"
    echo "Valor sugerido: $var_value"
    echo ""
    echo "¿Quieres usar este valor? (y/n/s para saltar)"
    read -r response
    
    case $response in
        [yY]|[yY][eE][sS])
            echo "$var_value" | vercel env add "$var_name" production
            echo "$var_value" | vercel env add "$var_name" preview
            echo "$var_value" | vercel env add "$var_name" development
            ;;
        [sS]|[sS][kK][iI][pP])
            log "Saltando configuración de $var_name"
            ;;
        *)
            echo "Ingresa el valor para $var_name:"
            read -r custom_value
            echo "$custom_value" | vercel env add "$var_name" production
            echo "$custom_value" | vercel env add "$var_name" preview
            echo "$custom_value" | vercel env add "$var_name" development
            ;;
    esac
}

# Configurar variables de entorno
echo ""
echo "🔧 Configuración de Variables de Entorno"
echo "========================================"

setup_env_var "DATABASE_URL" "file:./prisma/dev.db" "URL de la base de datos (SQLite para demo)"
setup_env_var "GEMINI_API_KEY" "AIzaSyA4j95pTsy_ghqLOIPrsbK5DLCGOsG6RGU" "API Key de Google Gemini"

# Deploy inicial o actualización
log "Iniciando deploy en Vercel..."

if [ "$1" = "--prod" ]; then
    log "Deployando a PRODUCCIÓN..."
    vercel --prod
else
    log "Deployando a PREVIEW..."
    vercel
    echo ""
    echo "Para deploy a producción, ejecuta:"
    echo "  $0 --prod"
fi

log "✅ Deploy completado!"

# Mostrar información útil
echo ""
echo "🔗 Enlaces útiles:"
echo "  Dashboard: https://vercel.com/dashboard"
echo "  Logs: vercel logs"
echo "  Dominios: vercel domains ls"
echo ""
echo "🧪 Para verificar el deploy:"
echo "  Health check: curl https://tu-app.vercel.app/api/health"
echo "  Aplicación: https://tu-app.vercel.app"
