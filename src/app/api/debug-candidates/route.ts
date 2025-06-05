import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { CandidateService } from '@/lib/candidate-service'

export async function GET() {
  try {
    console.log('[DEBUG] Starting candidate debugging...')
    
    // Test 1: Direct Supabase query
    console.log('[DEBUG] Test 1: Direct Supabase query')
    const { data: directData, error: directError } = await supabase
      .from('candidates')
      .select('*')
      .limit(5)
    
    console.log('[DEBUG] Direct query result:', { 
      data: directData, 
      error: directError,
      count: directData?.length || 0 
    })
    
    // Test 2: Using CandidateService
    console.log('[DEBUG] Test 2: Using CandidateService')
    let serviceData = null
    let serviceError = null
    
    try {
      serviceData = await CandidateService.getAll({ limit: 5 })
      console.log('[DEBUG] Service query result:', { 
        data: serviceData, 
        count: serviceData?.length || 0 
      })
    } catch (error) {
      serviceError = error
      console.error('[DEBUG] Service query error:', error)
    }
    
    // Test 3: Check table structure
    console.log('[DEBUG] Test 3: Check table structure')
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type')
      .eq('table_name', 'candidates')
      .eq('table_schema', 'public')
    
    console.log('[DEBUG] Table columns:', columns)
    
    // Test 4: Simple count
    console.log('[DEBUG] Test 4: Simple count')
    const { count, error: countError } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
    
    console.log('[DEBUG] Count result:', { count, error: countError })
    
    // Test 5: Try different field names
    console.log('[DEBUG] Test 5: Try different field names')
    const { data: fieldsTest, error: fieldsError } = await supabase
      .from('candidates')
      .select('id, nombres_apellidos, cedula, estatus, created_at')
      .limit(3)
    
    console.log('[DEBUG] Fields test result:', { 
      data: fieldsTest, 
      error: fieldsError 
    })
    
    return NextResponse.json({
      success: true,
      tests: {
        directQuery: {
          data: directData,
          error: directError?.message || null,
          count: directData?.length || 0
        },
        serviceQuery: {
          data: serviceData,
          error: serviceError?.message || null,
          count: serviceData?.length || 0
        },
        tableColumns: {
          data: columns,
          error: columnsError?.message || null
        },
        countQuery: {
          count: count,
          error: countError?.message || null
        },
        fieldsTest: {
          data: fieldsTest,
          error: fieldsError?.message || null
        }
      }
    })
    
  } catch (error) {
    console.error('[DEBUG] Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
