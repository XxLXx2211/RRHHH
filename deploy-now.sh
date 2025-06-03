#!/bin/bash

echo "🚀 DEPLOY RÁPIDO EN VERCEL"
echo "=========================="
echo ""

# Verificar si Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📦 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Login en Vercel
echo "🔐 Haciendo login en Vercel..."
vercel login

# Configurar variables de entorno
echo ""
echo "🔧 Configurando variables de entorno..."
echo ""

echo "Configurando DATABASE_URL..."
echo "file:./prisma/dev.db" | vercel env add DATABASE_URL production
echo "file:./prisma/dev.db" | vercel env add DATABASE_URL preview  
echo "file:./prisma/dev.db" | vercel env add DATABASE_URL development

echo ""
echo "Configurando GEMINI_API_KEY..."
echo "AIzaSyA4j95pTsy_ghqLOIPrsbK5DLCGOsG6RGU" | vercel env add GEMINI_API_KEY production
echo "AIzaSyA4j95pTsy_ghqLOIPrsbK5DLCGOsG6RGU" | vercel env add GEMINI_API_KEY preview
echo "AIzaSyA4j95pTsy_ghqLOIPrsbK5DLCGOsG6RGU" | vercel env add GEMINI_API_KEY development

# Deploy inicial
echo ""
echo "🚀 Iniciando deploy..."
vercel

echo ""
echo "✅ Deploy completado!"
echo ""
echo "Para deploy a producción, ejecuta:"
echo "vercel --prod"
echo ""
echo "🔗 Tu aplicación estará disponible en la URL que aparece arriba"
