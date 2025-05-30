# 🚀 Deploy Rápido en Vercel

## ⚡ Método Rápido (5 minutos)

### 1. Instalar Vercel CLI
```bash
npm install -g vercel
```

### 2. Login en Vercel
```bash
vercel login
```

### 3. Deploy Automático
```bash
./scripts/deploy-vercel.sh
```

### 4. Deploy a Producción
```bash
./scripts/deploy-vercel.sh --prod
```

## 🔧 Configuración Manual (Si prefieres control total)

### 1. Variables de Entorno
```bash
# Base de datos (SQLite para demo)
vercel env add DATABASE_URL
# Valor: file:./prisma/dev.db

# API Key de Gemini
vercel env add GEMINI_API_KEY
# Valor: AIzaSyA4j95pTsy_ghqLOIPrsbK5DLCGOsG6RGU
```

### 2. Deploy
```bash
vercel          # Preview
vercel --prod   # Producción
```

## 🌐 Deploy desde GitHub (Recomendado)

### 1. Conectar Repositorio
1. Ve a https://vercel.com/new
2. Conecta tu repositorio de GitHub
3. Configura las variables de entorno:
   - `DATABASE_URL`: `file:./prisma/dev.db`
   - `GEMINI_API_KEY`: `AIzaSyA4j95pTsy_ghqLOIPrsbK5DLCGOsG6RGU`

### 2. Deploy Automático
- Cada push a `main` → Deploy a producción
- Cada pull request → Preview deployment

## 🗄️ Opciones de Base de Datos

### SQLite (Más Simple)
```
DATABASE_URL=file:./prisma/dev.db
```
✅ Perfecto para demos y desarrollo
❌ No persistente entre deployments

### PostgreSQL (Recomendado para Producción)

#### Opción A: Vercel Postgres
1. Dashboard de Vercel → Storage → Create Database
2. Selecciona Postgres
3. Copia la URL de conexión

#### Opción B: Supabase (Gratuito)
1. Crea cuenta en https://supabase.com
2. Crea nuevo proyecto
3. Ve a Settings → Database
4. Copia la connection string

#### Opción C: Neon (Serverless)
1. Crea cuenta en https://neon.tech
2. Crea nueva base de datos
3. Copia la connection string

## ✅ Verificar Deploy

### Health Check
```bash
curl https://tu-app.vercel.app/api/health
```

### Respuesta Esperada
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "environment": "production"
}
```

## 🚨 Troubleshooting

### Error: "Prisma Client not found"
**Solución**: El build personalizado debería resolverlo automáticamente.

### Error: "Database connection failed"
**Solución**: Verificar `DATABASE_URL` en variables de entorno.

### Error: "Build failed"
**Solución**: 
```bash
# Verificar localmente
npm run build
# Si funciona, revisar logs en Vercel dashboard
```

## 📊 Monitoreo

### Logs en Tiempo Real
```bash
vercel logs --follow
```

### Dashboard de Vercel
- Analytics de performance
- Logs de funciones
- Métricas de uso

## 🎯 URLs Importantes

Después del deploy tendrás:
- **Aplicación**: `https://nextn-app.vercel.app`
- **Health Check**: `https://nextn-app.vercel.app/api/health`
- **Dashboard**: `https://vercel.com/dashboard`

## 🔄 Comandos Útiles

```bash
# Ver proyectos
vercel ls

# Ver información del proyecto actual
vercel inspect

# Ver dominios
vercel domains ls

# Eliminar deployment
vercel rm [deployment-url]

# Configurar dominio personalizado
vercel domains add tu-dominio.com
```

## 🎉 ¡Listo!

Tu aplicación estará disponible en una URL como:
`https://nextn-app-[hash].vercel.app`

Para producción:
`https://nextn-app.vercel.app`

¡Disfruta tu aplicación en la nube! 🚀
