import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Verificar conexión a la base de datos
    await prisma.$queryRaw`SELECT 1`;

    // Intentar contar candidatos
    let candidateCount = 0;
    let tablesExist = false;
    let tableError = null;

    try {
      candidateCount = await prisma.candidate.count();
      tablesExist = true;
    } catch (err) {
      tableError = err instanceof Error ? err.message : 'Unknown table error';
      console.log('Tables may not exist yet:', err);
    }

    // Verificar variables de entorno
    const dbUrl = process.env.DATABASE_URL;
    const dbConfigured = !!dbUrl;

    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        configured: dbConfigured,
        tablesExist,
        candidateCount,
        tableError
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        DATABASE_URL_CONFIGURED: dbConfigured,
        DATABASE_URL_PREFIX: dbUrl?.substring(0, 30) + '...'
      }
    });
  } catch (error) {
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        database: {
          connected: false,
          configured: !!process.env.DATABASE_URL
        },
        environment: {
          NODE_ENV: process.env.NODE_ENV,
          DATABASE_URL_CONFIGURED: !!process.env.DATABASE_URL,
          DATABASE_URL_PREFIX: process.env.DATABASE_URL?.substring(0, 30) + '...'
        },
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 503 }
    );
  }
}
