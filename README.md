# CandidatoScope - Sistema de Gestión de RRHH

Sistema completo de gestión de recursos humanos desarrollado con Next.js 15, React 18, TypeScript y Supabase.

## Características

- Gestión de empleados
- Control de asistencia
- Gestión de nóminas
- Dashboard administrativo
- Autenticación segura
- Base de datos SQLite

## Desarrollo Local

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Copia el archivo de variables de entorno:
   ```bash
   cp .env.example .env.local
   ```
4. Configura las variables de entorno en `.env.local`
5. Ejecuta el servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Deployment en Netlify

### Paso 1: Configurar Variables de Entorno

En el Dashboard de Netlify, ve a **Site Settings** → **Environment Variables** y agrega:

```
NEXT_PUBLIC_SUPABASE_URL=https://rwcbpuekhaujyzgaodro.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3Y2JwdWVraGF1anl6Z2FvZHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MTgwNzUsImV4cCI6MjA2NDQ5NDA3NX0.uJ5H0RyZ2NUDziv-9DLWgL0PRzu6tN8tsU0kwpY_mM0
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXTAUTH_SECRET=candidatoscope-super-secreto-netlify-2024
NEXTAUTH_URL=https://tu-dominio.netlify.app
```

### Paso 2: Deploy

1. Conecta tu repositorio de GitHub con Netlify
2. Netlify detectará automáticamente que es un proyecto Next.js
3. Las variables de entorno se aplicarán automáticamente

## Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
├── components/          # Componentes reutilizables
├── lib/                # Utilidades y configuración
└── types/              # Definiciones de TypeScript
```
