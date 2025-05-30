#!/bin/bash

# Script de build personalizado para Vercel
echo "🔧 Iniciando build personalizado para Vercel..."

# Generar cliente de Prisma
echo "📦 Generando cliente de Prisma..."
npx prisma generate

# Verificar que el cliente se generó correctamente
if [ ! -d "node_modules/.prisma" ]; then
    echo "❌ Error: Cliente de Prisma no se generó correctamente"
    exit 1
fi

echo "✅ Cliente de Prisma generado exitosamente"

# Ejecutar build de Next.js
echo "🏗️ Construyendo aplicación Next.js..."
npm run build

echo "✅ Build completado exitosamente"
