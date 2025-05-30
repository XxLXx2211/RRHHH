#!/bin/bash

echo "🚀 DEPLOY EN VERCEL (Sin sudo)"
echo "=============================="
echo ""

# Login en Vercel usando npx
echo "🔐 Haciendo login en Vercel..."
npx vercel login

# Configurar variables de entorno
echo ""
echo "🔧 Configurando variables de entorno..."
echo ""

echo "Configurando DATABASE_URL..."
echo "file:./prisma/dev.db" | npx vercel env add DATABASE_URL production
echo "file:./prisma/dev.db" | npx vercel env add DATABASE_URL preview  
echo "file:./prisma/dev.db" | npx vercel env add DATABASE_URL development

echo ""
echo "Configurando GEMINI_API_KEY..."
echo "AIzaSyA4j95pTsy_ghqLOIPrsbK5DLCGOsG6RGU" | npx vercel env add GEMINI_API_KEY production
echo "AIzaSyA4j95pTsy_ghqLOIPrsbK5DLCGOsG6RGU" | npx vercel env add GEMINI_API_KEY preview
echo "AIzaSyA4j95pTsy_ghqLOIPrsbK5DLCGOsG6RGU" | npx vercel env add GEMINI_API_KEY development

# Deploy inicial
echo ""
echo "🚀 Iniciando deploy preview..."
npx vercel

echo ""
echo "🎯 Deploy a producción..."
npx vercel --prod

echo ""
echo "✅ Deploy completado!"
echo ""
echo "🔗 Tu aplicación está disponible en las URLs mostradas arriba"
echo "🧪 Health check: https://tu-app.vercel.app/api/health"
