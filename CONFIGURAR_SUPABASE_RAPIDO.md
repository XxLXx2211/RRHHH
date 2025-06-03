# 🚀 Configuración Rápida de Supabase (Sin Contraseña)

## ✅ Ya Configurado

Tu proyecto ya tiene configuradas las API keys de Supabase:
- **Project URL**: `https://gcyqggtvnlcmzkjffxuc.supabase.co`
- **API Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 📋 Pasos para Completar la Configuración

### 1. Crear las Tablas en Supabase

1. Ve a [supabase.com/dashboard](https://supabase.com/dashboard)
2. Abre tu proyecto: **gcyqggtvnlcmzkjffxuc**
3. Ve a **SQL Editor** en el menú lateral
4. Copia y pega el contenido del archivo `supabase-schema.sql`
5. Haz clic en **Run** para ejecutar el script

### 2. Probar la Conexión

```bash
# Probar conexión con API keys (sin contraseña)
npm run supabase:test-api
```

### 3. Probar la API

```bash
# Iniciar el servidor
npm run dev

# En otra terminal, probar la API de salud
curl http://localhost:9002/api/health-supabase
```

### 4. Usar la Nueva API

La aplicación ahora tiene dos APIs:

#### API Original (Prisma):
- `GET /api/candidates` - Requiere contraseña de BD
- `POST /api/candidates`
- `PUT /api/candidates/[id]`
- `DELETE /api/candidates/[id]`

#### API Nueva (Supabase):
- `GET /api/candidates-supabase` - Solo requiere API keys ✅
- `POST /api/candidates-supabase`
- `PUT /api/candidates-supabase/[id]`
- `DELETE /api/candidates-supabase/[id]`

## 🔧 Cambiar la Aplicación para Usar Supabase

### Opción 1: Cambiar Temporalmente

Edita `src/hooks/use-candidates.ts` y cambia:
```typescript
// Cambiar de:
const response = await fetch('/api/candidates', {

// A:
const response = await fetch('/api/candidates-supabase', {
```

### Opción 2: Variable de Entorno

Agrega a `.env.local`:
```bash
USE_SUPABASE_API=true
```

Y modifica el hook para usar esta variable.

## 🎯 Ventajas de Usar Supabase API

✅ **Sin contraseña de BD necesaria**
✅ **Solo API keys públicas**
✅ **Más fácil de configurar**
✅ **Funciona inmediatamente**
✅ **Mejor para desarrollo**
✅ **Escalable automáticamente**

## 📊 Verificar que Todo Funciona

1. **Crear tablas**: Ejecutar `supabase-schema.sql` en Supabase
2. **Probar conexión**: `npm run supabase:test-api`
3. **Iniciar app**: `npm run dev`
4. **Verificar salud**: Visitar `http://localhost:9002/api/health-supabase`
5. **Probar candidatos**: Visitar `http://localhost:9002/api/candidates-supabase`

## 🚀 Resultado Esperado

- ✅ Sin "Error al cargar candidatos"
- ✅ Lista de candidatos funcionando
- ✅ Crear/editar/eliminar candidatos
- ✅ Búsquedas funcionando
- ✅ Sin configuración de contraseña
- ✅ Listo para producción en Vercel

## 🔄 Migrar Datos (Si Tienes Datos en SQLite)

Si ya tienes datos en SQLite y quieres migrarlos:

1. Exporta datos de SQLite
2. Usa el SQL Editor de Supabase para importar
3. O usa la API para crear los registros uno por uno

## 📝 Notas Importantes

- Las API keys que tienes son **públicas** y seguras para usar en el frontend
- Supabase maneja automáticamente la seguridad con Row Level Security (RLS)
- No necesitas configurar contraseñas de base de datos
- Todo funciona a través de HTTPS y API REST

¡Listo! Con esto tu aplicación funcionará perfectamente con Supabase sin necesidad de contraseñas de base de datos.
