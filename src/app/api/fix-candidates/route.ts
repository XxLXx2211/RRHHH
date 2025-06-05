import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('[FIX CANDIDATES] Starting fix process...')
    
    // Step 1: Try to get data with different methods
    console.log('[FIX CANDIDATES] Step 1: Testing different query methods')
    
    // Method 1: Simple select all
    const { data: method1, error: error1 } = await supabase
      .from('candidates')
      .select('*')
    
    console.log('[FIX CANDIDATES] Method 1 (select *):', { 
      count: method1?.length || 0, 
      error: error1?.message || null,
      sample: method1?.[0] || null
    })
    
    // Method 2: Select specific fields
    const { data: method2, error: error2 } = await supabase
      .from('candidates')
      .select('id, nombres_apellidos, cedula, estatus')
    
    console.log('[FIX CANDIDATES] Method 2 (specific fields):', { 
      count: method2?.length || 0, 
      error: error2?.message || null,
      sample: method2?.[0] || null
    })
    
    // Method 3: Try with RLS disabled (if possible)
    const { data: method3, error: error3 } = await supabase
      .from('candidates')
      .select('id, nombres_apellidos')
      .limit(10)
    
    console.log('[FIX CANDIDATES] Method 3 (limited):', { 
      count: method3?.length || 0, 
      error: error3?.message || null,
      sample: method3?.[0] || null
    })
    
    // Step 2: Check if we have any working method
    let workingData = null
    let workingMethod = null
    
    if (method1 && method1.length > 0) {
      workingData = method1
      workingMethod = 'method1'
    } else if (method2 && method2.length > 0) {
      workingData = method2
      workingMethod = 'method2'
    } else if (method3 && method3.length > 0) {
      workingData = method3
      workingMethod = 'method3'
    }
    
    console.log('[FIX CANDIDATES] Working method:', workingMethod)
    console.log('[FIX CANDIDATES] Working data count:', workingData?.length || 0)
    
    // Step 3: If we have working data, update the main API
    if (workingData && workingData.length > 0) {
      console.log('[FIX CANDIDATES] SUCCESS! Found working data')
      
      return NextResponse.json({
        success: true,
        message: 'Candidates found successfully!',
        workingMethod,
        candidatesCount: workingData.length,
        candidates: workingData,
        allMethods: {
          method1: { count: method1?.length || 0, error: error1?.message || null },
          method2: { count: method2?.length || 0, error: error2?.message || null },
          method3: { count: method3?.length || 0, error: error3?.message || null }
        }
      })
    } else {
      console.log('[FIX CANDIDATES] PROBLEM: No working method found')
      
      return NextResponse.json({
        success: false,
        message: 'No candidates found with any method',
        allMethods: {
          method1: { count: method1?.length || 0, error: error1?.message || null },
          method2: { count: method2?.length || 0, error: error2?.message || null },
          method3: { count: method3?.length || 0, error: error3?.message || null }
        }
      })
    }
    
  } catch (error) {
    console.error('[FIX CANDIDATES] Unexpected error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Unexpected error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

// POST method to force refresh candidates
export async function POST() {
  try {
    console.log('[FIX CANDIDATES] POST: Force refresh candidates')
    
    // Try to get candidates and return them
    const { data: candidates, error } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('[FIX CANDIDATES] POST Error:', error)
      return NextResponse.json({
        success: false,
        error: error.message
      }, { status: 500 })
    }
    
    console.log('[FIX CANDIDATES] POST Success:', candidates?.length || 0, 'candidates found')
    
    return NextResponse.json({
      success: true,
      message: 'Candidates refreshed successfully',
      count: candidates?.length || 0,
      data: candidates || []
    })
    
  } catch (error) {
    console.error('[FIX CANDIDATES] POST Unexpected error:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Unexpected error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
