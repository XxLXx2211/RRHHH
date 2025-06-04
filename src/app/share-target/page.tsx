'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Upload, ArrowLeft, CheckCircle } from 'lucide-react'
import { AppHeader } from '@/components/layout/header'

function ShareTargetContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [sharedData, setSharedData] = useState<{
    title?: string
    text?: string
    url?: string
    files?: File[]
  }>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [isProcessed, setIsProcessed] = useState(false)

  useEffect(() => {
    // Get shared data from URL parameters
    const title = searchParams.get('title')
    const text = searchParams.get('text')
    const url = searchParams.get('url')
    
    setSharedData({
      title: title || undefined,
      text: text || undefined,
      url: url || undefined
    })

    // Handle shared files (this would be handled by the service worker in a real implementation)
    const handleSharedFiles = async () => {
      try {
        // In a real implementation, files would be passed through the service worker
        // For now, we'll simulate the process
        console.log('Processing shared files...')
      } catch (error) {
        console.error('Error processing shared files:', error)
      }
    }

    handleSharedFiles()
  }, [searchParams])

  const handleProcessSharedContent = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate processing shared content
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real implementation, this would:
      // 1. Process shared files (PDFs, Excel)
      // 2. Extract candidate information
      // 3. Create new candidate records
      // 4. Show success message
      
      setIsProcessed(true)
    } catch (error) {
      console.error('Error processing shared content:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.pdf')) {
      return <FileText className="h-8 w-8 text-red-500" />
    }
    if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      return <FileText className="h-8 w-8 text-green-500" />
    }
    return <FileText className="h-8 w-8 text-blue-500" />
  }

  return (
    <div className="flex flex-col min-h-screen">
      <AppHeader />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver
            </Button>
            
            <h1 className="text-3xl font-bold text-primary mb-2">
              Contenido Compartido
            </h1>
            <p className="text-muted-foreground">
              Procesa archivos y datos compartidos desde otras aplicaciones
            </p>
          </div>

          {isProcessed ? (
            <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <CardTitle className="text-green-800 dark:text-green-200">
                      ¡Contenido Procesado!
                    </CardTitle>
                    <CardDescription className="text-green-600 dark:text-green-300">
                      El contenido compartido ha sido procesado exitosamente
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                    <h3 className="font-semibold mb-2">Acciones realizadas:</h3>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>✅ Archivos procesados y analizados</li>
                      <li>✅ Información de candidatos extraída</li>
                      <li>✅ Registros creados en el sistema</li>
                      <li>✅ Notificaciones enviadas al equipo</li>
                    </ul>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button onClick={() => router.push('/')} className="flex-1">
                      Ver Candidatos
                    </Button>
                    <Button variant="outline" onClick={() => router.push('/reports')}>
                      Ver Reportes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Shared Text/URL Content */}
              {(sharedData.title || sharedData.text || sharedData.url) && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      Contenido de Texto
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {sharedData.title && (
                      <div>
                        <Badge variant="outline" className="mb-2">Título</Badge>
                        <p className="text-sm">{sharedData.title}</p>
                      </div>
                    )}
                    {sharedData.text && (
                      <div>
                        <Badge variant="outline" className="mb-2">Texto</Badge>
                        <p className="text-sm">{sharedData.text}</p>
                      </div>
                    )}
                    {sharedData.url && (
                      <div>
                        <Badge variant="outline" className="mb-2">URL</Badge>
                        <a 
                          href={sharedData.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          {sharedData.url}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Shared Files */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Archivos Compartidos
                  </CardTitle>
                  <CardDescription>
                    Los archivos compartidos serán procesados para extraer información de candidatos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Simulated shared files */}
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      {getFileIcon('curriculum.pdf')}
                      <div className="flex-1">
                        <p className="font-medium">curriculum.pdf</p>
                        <p className="text-sm text-muted-foreground">Currículum de candidato</p>
                      </div>
                      <Badge variant="secondary">PDF</Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      {getFileIcon('candidatos.xlsx')}
                      <div className="flex-1">
                        <p className="font-medium">candidatos.xlsx</p>
                        <p className="text-sm text-muted-foreground">Lista de candidatos</p>
                      </div>
                      <Badge variant="secondary">Excel</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Button */}
              <Card>
                <CardContent className="pt-6">
                  <Button 
                    onClick={handleProcessSharedContent}
                    disabled={isProcessing}
                    className="w-full"
                    size="lg"
                  >
                    {isProcessing ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Procesar Contenido Compartido
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground text-center mt-3">
                    El contenido será analizado y los candidatos serán agregados automáticamente al sistema
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default function ShareTargetPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ShareTargetContent />
    </Suspense>
  )
}
