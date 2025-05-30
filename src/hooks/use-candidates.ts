import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Candidate, CandidateFormData } from '@/types'
import { useToast } from '@/hooks/use-toast'

// Tipos para las respuestas de la API
interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
  details?: any
}

interface CandidatesResponse {
  success: boolean
  data: Candidate[]
  count: number
}

// Funciones para llamadas a la API
const candidateApi = {
  // Obtener todos los candidatos
  getAll: async (filters?: Record<string, any>): Promise<Candidate[]> => {
    const params = new URLSearchParams()
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString())
        }
      })
    }

    const url = `/api/candidates?${params}`;
    console.log('[Hook] Making API call to:', url);
    console.log('[Hook] Filters being sent:', filters);

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Error al obtener candidatos')
    }

    const result: CandidatesResponse = await response.json()

    // Convertir strings de fecha a objetos Date
    return result.data.map(candidate => ({
      ...candidate,
      fecha_contacto: new Date(candidate.fecha_contacto),
      fecha_entrevista: candidate.fecha_entrevista ? new Date(candidate.fecha_entrevista) : null,
      created_at: new Date(candidate.created_at),
      updated_at: new Date(candidate.updated_at)
    }))
  },

  // Obtener candidato por ID
  getById: async (id: string): Promise<Candidate> => {
    const response = await fetch(`/api/candidates/${id}`)
    if (!response.ok) {
      throw new Error('Error al obtener candidato')
    }

    const result: ApiResponse<Candidate> = await response.json()

    // Convertir strings de fecha a objetos Date
    return {
      ...result.data,
      fecha_contacto: new Date(result.data.fecha_contacto),
      fecha_entrevista: result.data.fecha_entrevista ? new Date(result.data.fecha_entrevista) : null,
      created_at: new Date(result.data.created_at),
      updated_at: new Date(result.data.updated_at)
    }
  },

  // Crear candidato
  create: async (data: CandidateFormData): Promise<Candidate> => {
    const response = await fetch('/api/candidates', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const result: ApiResponse<Candidate> = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Error al crear candidato')
    }

    // Convertir strings de fecha a objetos Date
    return {
      ...result.data,
      fecha_contacto: new Date(result.data.fecha_contacto),
      fecha_entrevista: result.data.fecha_entrevista ? new Date(result.data.fecha_entrevista) : null,
      created_at: new Date(result.data.created_at),
      updated_at: new Date(result.data.updated_at)
    }
  },

  // Actualizar candidato
  update: async (id: string, data: Partial<CandidateFormData>): Promise<Candidate> => {
    const response = await fetch(`/api/candidates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const result: ApiResponse<Candidate> = await response.json()

    if (!response.ok) {
      throw new Error(result.error || 'Error al actualizar candidato')
    }

    // Convertir strings de fecha a objetos Date
    return {
      ...result.data,
      fecha_contacto: new Date(result.data.fecha_contacto),
      fecha_entrevista: result.data.fecha_entrevista ? new Date(result.data.fecha_entrevista) : null,
      created_at: new Date(result.data.created_at),
      updated_at: new Date(result.data.updated_at)
    }
  },

  // Eliminar candidato
  delete: async (id: string): Promise<void> => {
    const response = await fetch(`/api/candidates/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      const result: ApiResponse<any> = await response.json()
      throw new Error(result.error || 'Error al eliminar candidato')
    }
  }
}

// Hook para obtener todos los candidatos
export function useCandidates(filters?: Record<string, any>) {
  return useQuery({
    queryKey: ['candidates', filters],
    queryFn: () => candidateApi.getAll(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  })
}

// Hook para obtener un candidato por ID
export function useCandidate(id: string) {
  return useQuery({
    queryKey: ['candidate', id],
    queryFn: () => candidateApi.getById(id),
    enabled: !!id,
  })
}

// Hook para crear candidato
export function useCreateCandidate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: candidateApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      toast({
        title: "Éxito",
        description: "Candidato creado exitosamente",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

// Hook para actualizar candidato
export function useUpdateCandidate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CandidateFormData> }) =>
      candidateApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      queryClient.invalidateQueries({ queryKey: ['candidate', id] })
      toast({
        title: "Éxito",
        description: "Candidato actualizado exitosamente",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}

// Hook para eliminar candidato
export function useDeleteCandidate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: candidateApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['candidates'] })
      toast({
        title: "Éxito",
        description: "Candidato eliminado exitosamente",
      })
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    },
  })
}
