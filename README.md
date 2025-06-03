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

## Deployment en Vercel

### Paso 1: Configurar Variables de Entorno

En el Dashboard de Vercel, ve a **Settings** → **Environment Variables** y agrega:

```
DATABASE_URL = file:./dev.db
GEMINI_API_KEY = tu_clave_de_gemini_aqui
NEXTAUTH_SECRET = tu_secreto_nextauth_aqui
NEXTAUTH_URL = https://tu-dominio.vercel.app
NODE_ENV = production
```

### Paso 2: Deploy

1. Conecta tu repositorio de GitHub con Vercel
2. Vercel detectará automáticamente que es un proyecto Next.js
3. Las variables de entorno se aplicarán automáticamente

## Estructura del Proyecto

```
src/
├── app/                 # App Router de Next.js
├── components/          # Componentes reutilizables
├── lib/                # Utilidades y configuración
└── types/              # Definiciones de TypeScript
```
