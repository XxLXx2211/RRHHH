#!/usr/bin/env node

// Script para probar la conexión a Supabase
const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('🔍 Probando conexión a Supabase...');
  
  // Verificar variables de entorno
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ ERROR: DATABASE_URL no está configurada');
    console.log('💡 Configura tu DATABASE_URL en .env.local');
    process.exit(1);
  }
  
  if (databaseUrl.includes('[TU-PASSWORD]')) {
    console.error('❌ ERROR: Necesitas reemplazar [TU-PASSWORD] con tu contraseña real de Supabase');
    console.log('💡 Ve a tu proyecto en Supabase → Settings → Database → Connection string');
    console.log('💡 Copia la contraseña y reemplaza [TU-PASSWORD] en .env.local');
    process.exit(1);
  }
  
  console.log('✅ Variables de entorno configuradas');
  console.log(`📊 Base de datos: ${databaseUrl.replace(/:[^:@]*@/, ':***@')}`);
  
  const prisma = new PrismaClient();
  
  try {
    // Probar conexión básica
    console.log('🔌 Probando conexión básica...');
    await prisma.$connect();
    console.log('✅ Conexión establecida');
    
    // Probar consulta simple
    console.log('📋 Probando consulta a la base de datos...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Consulta exitosa:', result);
    
    // Verificar si las tablas existen
    console.log('🔍 Verificando tablas...');
    try {
      const candidatesCount = await prisma.candidate.count();
      console.log(`✅ Tabla 'candidates' encontrada (${candidatesCount} registros)`);
    } catch (error) {
      console.log('⚠️  Tabla "candidates" no encontrada - necesitas ejecutar migraciones');
      console.log('💡 Ejecuta: npm run db:setup');
    }
    
    console.log('🎉 ¡Conexión a Supabase exitosa!');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    
    if (error.message.includes('authentication failed')) {
      console.log('💡 Error de autenticación - verifica tu contraseña');
    } else if (error.message.includes('timeout')) {
      console.log('💡 Timeout - verifica tu conexión a internet');
    } else if (error.message.includes('ENOTFOUND')) {
      console.log('💡 No se puede resolver el host - verifica la URL');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar test
testConnection().catch(console.error);
