# 🔧 Troubleshooting Vercel Deploy

## 📋 Checklist de Configuración

### 1. Variables de Entorno en Vercel Dashboard

Ve a tu proyecto en Vercel → Settings → Environment Variables y agrega:

| Variable | Valor | Entornos |
|----------|-------|----------|
| `DATABASE_URL` | `file:./prisma/dev.db` | Production, Preview, Development |
| `GEMINI_API_KEY` | `AIzaSyA4j95pTsy_ghqLOIPrsbK5DLCGOsG6RGU` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

### 2. Build Settings en Vercel

En tu proyecto → Settings → General:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next` (dejar vacío para auto-detect)
- **Install Command**: `npm ci`
- **Development Command**: `npm run dev`

## 🚨 Problemas Comunes y Soluciones

### Error: "Module not found: Can't resolve '@prisma/client'"

**Causa**: Cliente de Prisma no generado durante el build.

**Solución**:
1. Verificar que `prisma generate` esté en el build command
2. En Vercel dashboard → Settings → General → Build Command:
   ```
   npm run build
   ```

### Error: "Database connection failed"

**Causa**: Variable `DATABASE_URL` no configurada o incorrecta.

**Solución**:
1. Verificar variable en Vercel dashboard
2. Para SQLite usar: `file:./prisma/dev.db`
3. Para PostgreSQL usar URL completa: `postgresql://user:pass@host:port/db`

### Error: "Build failed" o "Command failed with exit code 1"

**Solución**:
1. Ver logs detallados en Vercel dashboard → Deployments → [tu deployment] → View Function Logs
2. Verificar que el build funcione localmente:
   ```bash
   npm run build
   ```

### Error: "API routes not working"

**Causa**: Configuración de rutas incorrecta.

**Solución**: Verificar que `vercel.json` tenga:
```json
{
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### Error: "Environment variables not available"

**Solución**:
1. Verificar que las variables estén configuradas para todos los entornos
2. Hacer redeploy después de agregar variables
3. Verificar nombres exactos (case-sensitive)

## 🔍 Debugging Steps

### 1. Verificar Build Local
```bash
# Limpiar y rebuildar
rm -rf .next node_modules
npm install
npm run build
```

### 2. Verificar Variables de Entorno
En tu código, agrega temporalmente:
```typescript
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY);
```

### 3. Verificar Health Check
Después del deploy, visita:
```
https://tu-app.vercel.app/api/health
```

### 4. Ver Logs en Tiempo Real
```bash
npx vercel logs --follow
```

## 🔄 Redeploy Steps

Si algo no funciona:

1. **Hacer cambios necesarios**
2. **Commit y push a GitHub**
3. **Vercel redeploy automáticamente**

O manualmente:
```bash
npx vercel --prod
```

## 📊 Verificar Deploy Exitoso

### URLs a Verificar:
- **App principal**: `https://tu-app.vercel.app`
- **Health check**: `https://tu-app.vercel.app/api/health`
- **API test**: `https://tu-app.vercel.app/api/candidates`

### Respuesta Esperada del Health Check:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "environment": "production"
}
```

## 🆘 Si Nada Funciona

### Opción 1: Deploy Limpio
1. Eliminar proyecto en Vercel
2. Crear nuevo proyecto
3. Configurar variables desde cero

### Opción 2: Usar Template
1. Fork este repositorio
2. Conectar el fork a Vercel
3. Configurar variables

### Opción 3: Contactar Soporte
- Vercel Discord: https://vercel.com/discord
- Documentación: https://vercel.com/docs

## 📝 Información para Soporte

Si necesitas ayuda, proporciona:
- URL del proyecto en Vercel
- Logs de error completos
- Variables de entorno configuradas (sin valores sensibles)
- Último commit que funcionó (si aplica)
