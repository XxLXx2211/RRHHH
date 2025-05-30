# 🚀 Deploy en Vercel - Instrucciones Paso a Paso

## Paso 1: Instalar Vercel CLI

```bash
npm install -g vercel
```

## Paso 2: Login en Vercel

```bash
vercel login
```

Esto abrirá tu navegador para autenticarte con tu cuenta de Vercel (GitHub, GitLab, o email).

## Paso 3: Configurar Variables de Entorno

### Opción A: Configurar desde la línea de comandos

```bash
# Configurar DATABASE_URL (usando SQLite para simplicidad)
vercel env add DATABASE_URL

# Cuando te pregunte el valor, ingresa:
file:./prisma/dev.db

# Configurar GEMINI_API_KEY
vercel env add GEMINI_API_KEY

# Cuando te pregunte el valor, ingresa tu API key de Gemini:
AIzaSyA4j95pTsy_ghqLOIPrsbK5DLCGOsG6RGU
```

### Opción B: Configurar desde el Dashboard de Vercel

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto (después del primer deploy)
3. Ve a Settings → Environment Variables
4. Agrega las siguientes variables:

| Variable | Valor | Entorno |
|----------|-------|---------|
| `DATABASE_URL` | `file:./prisma/dev.db` | Production, Preview, Development |
| `GEMINI_API_KEY` | `AIzaSyA4j95pTsy_ghqLOIPrsbK5DLCGOsG6RGU` | Production, Preview, Development |
| `NODE_ENV` | `production` | Production |

## Paso 4: Deploy Inicial

En el directorio raíz de tu proyecto, ejecuta:

```bash
vercel
```

Vercel te hará algunas preguntas:

1. **"Set up and deploy?"** → Presiona `Y`
2. **"Which scope?"** → Selecciona tu cuenta personal
3. **"Link to existing project?"** → Presiona `N` (para crear nuevo proyecto)
4. **"What's your project's name?"** → `nextn-app` (o el nombre que prefieras)
5. **"In which directory is your code located?"** → Presiona Enter (directorio actual)

## Paso 5: Deploy a Producción

Una vez que el deploy inicial funcione, para deployar a producción:

```bash
vercel --prod
```

## Paso 6: Configurar Dominio (Opcional)

Si tienes un dominio personalizado:

```bash
vercel domains add tu-dominio.com
```

## 🔧 Configuración Adicional

### Build Settings en Vercel

Si necesitas configurar manualmente en el dashboard:

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm ci`

### Variables de Entorno Adicionales (Opcionales)

```bash
# Para habilitar analytics de Vercel
vercel env add NEXT_PUBLIC_VERCEL_ANALYTICS_ID

# Para configurar región preferida
vercel env add VERCEL_REGION
# Valor: iad1 (para US East)
```

## 🗄️ Configuración de Base de Datos

### Opción 1: SQLite (Más Simple)
- Ya configurado con `DATABASE_URL=file:./prisma/dev.db`
- Perfecto para demos y desarrollo

### Opción 2: PostgreSQL en Vercel (Recomendado para Producción)

1. Ve a tu dashboard de Vercel
2. Selecciona tu proyecto
3. Ve a Storage → Create Database
4. Selecciona Postgres
5. Copia la URL de conexión
6. Actualiza la variable `DATABASE_URL`

### Opción 3: Base de Datos Externa

Puedes usar servicios como:
- **Supabase** (PostgreSQL gratuito)
- **PlanetScale** (MySQL serverless)
- **Railway** (PostgreSQL)
- **Neon** (PostgreSQL serverless)

## 🚨 Troubleshooting

### Error: "Module not found"
```bash
# Limpiar caché y reinstalar
rm -rf .next node_modules
npm install
vercel
```

### Error: "Prisma Client not generated"
```bash
# Generar cliente de Prisma
npx prisma generate
vercel
```

### Error: "Build failed"
```bash
# Verificar localmente
npm run build
# Si funciona local, revisar variables de entorno en Vercel
```

### Error: "Database connection failed"
- Verificar que `DATABASE_URL` esté configurada correctamente
- Para SQLite, asegurarse que el archivo existe
- Para PostgreSQL, verificar la URL de conexión

## 📊 Verificar Deploy

Una vez deployado, verifica:

1. **Health Check**: `https://tu-app.vercel.app/api/health`
2. **Aplicación**: `https://tu-app.vercel.app`
3. **Logs**: En el dashboard de Vercel → Functions → View Function Logs

## 🎯 Comandos Útiles

```bash
# Ver información del proyecto
vercel ls

# Ver logs en tiempo real
vercel logs

# Eliminar deployment
vercel rm deployment-url

# Ver dominios configurados
vercel domains ls

# Configurar alias
vercel alias set deployment-url tu-dominio.com
```

## 🔄 Deploy Automático

Para configurar deploy automático desde GitHub:

1. Conecta tu repositorio de GitHub a Vercel
2. Cada push a `main` deployará automáticamente
3. Pull requests crearán preview deployments

## ✅ Checklist Final

- [ ] Vercel CLI instalado
- [ ] Login en Vercel completado
- [ ] Variables de entorno configuradas
- [ ] Deploy inicial exitoso
- [ ] Deploy a producción exitoso
- [ ] Health check funcionando
- [ ] Aplicación accesible
- [ ] Base de datos conectada

¡Tu aplicación estará disponible en una URL como `https://nextn-app.vercel.app`! 🎉
