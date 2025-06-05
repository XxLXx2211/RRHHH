import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('[TEST DB] Testing Supabase connection...')
    
    // Test 1: Check connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('candidates')
      .select('count')
      .limit(1)
    
    if (connectionError) {
      console.error('[TEST DB] Connection error:', connectionError)
      return NextResponse.json({ 
        error: 'Connection failed', 
        details: connectionError.message 
      }, { status: 500 })
    }
    
    // Test 2: Get candidates count
    const { count: candidatesCount, error: countError } = await supabase
      .from('candidates')
      .select('*', { count: 'exact', head: true })
    
    if (countError) {
      console.error('[TEST DB] Count error:', countError)
    }
    
    // Test 3: Get first few candidates with specific fields
    const { data: candidates, error: candidatesError } = await supabase
      .from('candidates')
      .select('id, nombres_apellidos, cedula, estatus, created_at')
      .limit(5)

    // Test 3b: Try with all fields
    const { data: allFields, error: allFieldsError } = await supabase
      .from('candidates')
      .select('*')
      .limit(2)
    
    if (candidatesError) {
      console.error('[TEST DB] Candidates error:', candidatesError)
    }

    // Test 4: Get table schema info
    const { data: tableInfo, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(10)
    
    console.log('[TEST DB] Connection successful!')
    console.log('[TEST DB] Candidates count:', candidatesCount)
    console.log('[TEST DB] Sample candidates:', candidates?.length || 0)
    
    return NextResponse.json({
      success: true,
      connection: 'OK',
      candidatesCount: candidatesCount || 0,
      sampleCandidates: candidates || [],
      candidatesError: candidatesError?.message || null,
      allFieldsData: allFields || [],
      allFieldsError: allFieldsError?.message || null,
      tableInfo: tableInfo || [],
      tableError: tableError?.message || null,
      debug: {
        candidatesLength: candidates?.length || 0,
        allFieldsLength: allFields?.length || 0,
        hasData: (candidates?.length || 0) > 0 || (allFields?.length || 0) > 0
      }
    })
    
  } catch (error) {
    console.error('[TEST DB] Unexpected error:', error)
    return NextResponse.json({ 
      error: 'Unexpected error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
