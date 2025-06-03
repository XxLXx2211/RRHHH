import { NextResponse } from 'next/server'
import { SupabaseCandidateService } from '@/lib/services/supabase-candidate-service'
import { supabaseHelpers } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('🔍 [Health] Verificando estado de Supabase...')

    // Probar conexión básica
    const connectionTest = await SupabaseCandidateService.testConnection()
    
    let candidateCount = 0
    let tablesExist = false
    let tableError = null

    try {
      // Intentar contar candidatos
      const candidates = await SupabaseCandidateService.getAll({ limit: 1 })
      candidateCount = candidates.length
      tablesExist = true
    } catch (err) {
      tableError = err instanceof Error ? err.message : 'Unknown table error'
      console.log('📋 [Health] Las tablas pueden no existir aún:', err)
    }

    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        provider: 'supabase',
        connection: connectionTest.success ? 'connected' : 'disconnected',
        tablesExist,
        candidateCount,
        tableError
      },
      api: {
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      }
    }

    console.log('✅ [Health] Estado de Supabase verificado')

    return NextResponse.json({
      success: true,
      data: healthData,
      message: 'Sistema funcionando correctamente'
    })

  } catch (error) {
    console.error('❌ [Health] Error al verificar estado:', error)

    const errorData = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: {
        provider: 'supabase',
        connection: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      api: {
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      }
    }

    return NextResponse.json({
      success: false,
      data: errorData,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
