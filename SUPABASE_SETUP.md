# 🚀 Configuración de Supabase para CandidatoScope

Esta guía te ayudará a configurar Supabase como base de datos para tu aplicación CandidatoScope.

## 📋 Prerrequisitos

1. **Cuenta de Supabase**: Crea una cuenta en [supabase.com](https://supabase.com)
2. **Proyecto de Supabase**: Crea un nuevo proyecto en tu dashboard

## 🔧 Configuración Paso a Paso

### 1. Obtener Credenciales de Supabase

1. Ve a tu proyecto en Supabase
2. Navega a **Settings** → **Database**
3. En la sección **Connection string**, copia la URL de PostgreSQL
4. Reemplaza `[YOUR-PASSWORD]` con tu contraseña real

### 2. Configurar Variables de Entorno

#### Para Desarrollo Local (.env.local):
```bash
# Reemplaza con tus credenciales reales
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.[TU-PROJECT-REF].supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[TU-PASSWORD]@db.[TU-PROJECT-REF].supabase.co:5432/postgres"
```

#### Para Producción (Vercel):
Configura estas variables en el Dashboard de Vercel:
- `DATABASE_URL`
- `DIRECT_URL`

### 3. Ejecutar Configuración Automática

```bash
# Dar permisos al script
chmod +x scripts/setup-supabase.sh

# Ejecutar configuración
./scripts/setup-supabase.sh
```

### 4. Configuración Manual (Alternativa)

Si prefieres configurar manualmente:

```bash
# 1. Generar cliente de Prisma
npx prisma generate

# 2. Aplicar migraciones
npx prisma db push

# 3. Verificar conexión
npm run dev
```

## 🔍 Verificación

### Comprobar que Todo Funciona:

1. **Iniciar aplicación**:
   ```bash
   npm run dev
   ```

2. **Verificar en el navegador**:
   - Ve a http://localhost:9002
   - Intenta cargar la lista de candidatos
   - No debería aparecer "Error al cargar candidatos"

3. **Verificar en Supabase**:
   - Ve a tu proyecto en Supabase
   - Navega a **Table Editor**
   - Deberías ver las tablas: `candidates`, `locations`, `zones`

## 🚀 Deployment en Vercel

### Configurar Variables de Entorno en Vercel:

1. Ve a tu proyecto en Vercel
2. Navega a **Settings** → **Environment Variables**
3. Agrega las siguientes variables:

```
DATABASE_URL=postgresql://postgres:[TU-PASSWORD]@db.[TU-PROJECT-REF].supabase.co:5432/postgres
DIRECT_URL=postgresql://postgres:[TU-PASSWORD]@db.[TU-PROJECT-REF].supabase.co:5432/postgres
NEXTAUTH_SECRET=tu-secreto-super-seguro-para-produccion
NEXTAUTH_URL=https://tu-dominio.vercel.app
```

### Hacer Deploy:

```bash
git add .
git commit -m "🔧 Configuración de Supabase"
git push origin master
```

## 🛠️ Troubleshooting

### Error: "Error al cargar candidatos"

1. **Verificar conexión**:
   ```bash
   npx prisma db push
   ```

2. **Verificar variables de entorno**:
   - Asegúrate de que `DATABASE_URL` esté correcta
   - Verifica que la contraseña no tenga caracteres especiales sin escapar

3. **Verificar logs**:
   - Revisa la consola del navegador
   - Revisa los logs del servidor

### Error de Conexión a Base de Datos

1. **Verificar IP allowlist en Supabase**:
   - Ve a **Settings** → **Database**
   - En **Connection pooling**, asegúrate de que esté habilitado

2. **Verificar formato de URL**:
   ```
   postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Error en Build de Vercel

1. **Verificar que las variables estén configuradas en Vercel**
2. **Verificar que el build script incluya prisma generate**:
   ```json
   "vercel-build": "npx prisma generate && npm run build"
   ```

## 📚 Recursos Adicionales

- [Documentación de Supabase](https://supabase.com/docs)
- [Prisma con Supabase](https://www.prisma.io/docs/guides/database/supabase)
- [Deploy en Vercel](https://vercel.com/docs)

## 🆘 Soporte

Si tienes problemas:

1. Verifica que todas las variables de entorno estén configuradas
2. Asegúrate de que tu proyecto de Supabase esté activo
3. Revisa los logs de error en la consola
4. Verifica que las migraciones se hayan aplicado correctamente
