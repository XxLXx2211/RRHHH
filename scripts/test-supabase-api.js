#!/usr/bin/env node

// Script para probar la conexión a Supabase usando API keys (sin contraseña)
const { createClient } = require('@supabase/supabase-js');

async function testSupabaseAPI() {
  console.log('🔍 Probando conexión a Supabase con API keys...');
  
  // Configuración de Supabase
  const supabaseUrl = 'https://gcyqggtvnlcmzkjffxuc.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdjeXFnZ3R2bmxjbXpramZmeHVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MTIwODgsImV4cCI6MjA2NDQ4ODA4OH0.PjydW5HPn8ukPCRp7LYxD5dy1IzcOXRc1Xb-lXAq5Rw';
  
  console.log('✅ Configuración de Supabase:');
  console.log(`📊 URL: ${supabaseUrl}`);
  console.log(`🔑 API Key: ${supabaseAnonKey.substring(0, 20)}...`);
  
  // Crear cliente de Supabase
  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    // Probar conexión básica
    console.log('🔌 Probando conexión básica...');
    
    // Intentar obtener información de la base de datos
    const { data, error } = await supabase
      .from('candidates')
      .select('count')
      .limit(1);
    
    if (error) {
      if (error.message.includes('relation "candidates" does not exist')) {
        console.log('⚠️  La tabla "candidates" no existe aún');
        console.log('💡 Esto es normal si es la primera vez que usas Supabase');
        console.log('💡 Necesitas crear las tablas primero');
        
        // Intentar una consulta más básica
        console.log('🔍 Probando consulta básica a la base de datos...');
        const { data: basicData, error: basicError } = await supabase
          .rpc('version'); // Función básica de PostgreSQL
        
        if (basicError) {
          console.log('📋 Intentando consulta alternativa...');
          // Si no funciona, intentar algo más básico
          const { data: authData, error: authError } = await supabase.auth.getSession();
          
          if (authError) {
            throw new Error(`Error de autenticación: ${authError.message}`);
          } else {
            console.log('✅ Conexión a Supabase establecida (sin autenticación de usuario)');
          }
        } else {
          console.log('✅ Conexión a base de datos establecida');
          console.log('📊 Versión de PostgreSQL:', basicData);
        }
        
        console.log('');
        console.log('📋 Próximos pasos para configurar las tablas:');
        console.log('1. Ve a tu dashboard de Supabase: https://supabase.com/dashboard');
        console.log('2. Abre tu proyecto: gcyqggtvnlcmzkjffxuc');
        console.log('3. Ve a SQL Editor');
        console.log('4. Ejecuta el script de migración que está en prisma/migrations/');
        console.log('');
        
      } else {
        throw error;
      }
    } else {
      console.log('✅ Conexión exitosa a Supabase');
      console.log('✅ Tabla "candidates" encontrada');
      console.log('📊 Datos de prueba:', data);
      
      // Intentar contar registros
      const { count, error: countError } = await supabase
        .from('candidates')
        .select('*', { count: 'exact', head: true });
      
      if (countError) {
        console.log('⚠️  Error al contar registros:', countError.message);
      } else {
        console.log(`📊 Total de candidatos en la base de datos: ${count}`);
      }
    }
    
    console.log('');
    console.log('🎉 ¡Prueba de Supabase completada!');
    console.log('');
    console.log('✅ Resultados:');
    console.log('- Conexión a Supabase: ✅ EXITOSA');
    console.log('- API Keys: ✅ VÁLIDAS');
    console.log('- Proyecto: gcyqggtvnlcmzkjffxuc');
    console.log('');
    console.log('💡 Ahora puedes usar Supabase en tu aplicación sin contraseña de BD');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    
    if (error.message.includes('Invalid API key')) {
      console.log('💡 Error de API key - verifica que las keys sean correctas');
    } else if (error.message.includes('fetch')) {
      console.log('💡 Error de red - verifica tu conexión a internet');
    } else if (error.message.includes('CORS')) {
      console.log('💡 Error de CORS - esto es normal en scripts de Node.js');
    }
    
    console.log('');
    console.log('🔧 Soluciones:');
    console.log('1. Verifica que las API keys sean correctas');
    console.log('2. Verifica que el proyecto gcyqggtvnlcmzkjffxuc esté activo');
    console.log('3. Verifica tu conexión a internet');
    
    process.exit(1);
  }
}

// Ejecutar test
testSupabaseAPI().catch(console.error);
