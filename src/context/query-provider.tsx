'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

// Componente placeholder para devtools en producción
const DevtoolsPlaceholder = (props: any) => null

// Solo cargar ReactQueryDevtools en desarrollo
let ReactQueryDevtools = DevtoolsPlaceholder

if (process.env.NODE_ENV === 'development') {
  try {
    const { ReactQueryDevtools: DevtoolsComponent } = require('@tanstack/react-query-devtools')
    ReactQueryDevtools = DevtoolsComponent
  } catch (error) {
    console.warn('React Query Devtools not available in development')
    ReactQueryDevtools = DevtoolsPlaceholder
  }
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minuto
            retry: 1,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
