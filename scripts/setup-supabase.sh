#!/bin/bash

# Script para configurar Supabase con el proyecto CandidatoScope

echo "🚀 Configurando Supabase para CandidatoScope..."

# Verificar que las variables de entorno estén configuradas
if [ -z "$DATABASE_URL" ]; then
    echo "❌ Error: DATABASE_URL no está configurada"
    echo "📝 Por favor configura tu DATABASE_URL de Supabase en .env.local"
    echo "   Formato: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
    exit 1
fi

echo "✅ Variables de entorno configuradas"

# Generar cliente de Prisma
echo "📦 Generando cliente de Prisma..."
npx prisma generate

if [ $? -ne 0 ]; then
    echo "❌ Error al generar cliente de Prisma"
    exit 1
fi

echo "✅ Cliente de Prisma generado"

# Aplicar migraciones
echo "🔄 Aplicando migraciones a Supabase..."
npx prisma db push

if [ $? -ne 0 ]; then
    echo "❌ Error al aplicar migraciones"
    echo "💡 Verifica que tu DATABASE_URL sea correcta y que tengas acceso a la base de datos"
    exit 1
fi

echo "✅ Migraciones aplicadas exitosamente"

# Verificar conexión
echo "🔍 Verificando conexión a la base de datos..."
npx prisma db seed 2>/dev/null || echo "ℹ️  No hay archivo de seed configurado (esto es normal)"

echo "🎉 ¡Supabase configurado exitosamente!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Verifica que tu aplicación se conecte correctamente"
echo "   2. Configura las mismas variables en Vercel para producción"
echo "   3. Ejecuta 'npm run dev' para probar localmente"
echo ""
echo "🔗 Variables para Vercel:"
echo "   DATABASE_URL=$DATABASE_URL"
echo "   DIRECT_URL=$DIRECT_URL"
