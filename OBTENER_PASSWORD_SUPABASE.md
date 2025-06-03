# 🔑 Cómo Obtener la Contraseña de Supabase

## 📋 Pasos para Obtener tu Contraseña de Base de Datos

### 1. Ve a tu Dashboard de Supabase
- Abre [supabase.com](https://supabase.com)
- Inicia sesión en tu cuenta
- Selecciona tu proyecto: **gcyqggtvnlcmzkjffxuc**

### 2. Navega a Database Settings
- En el menú lateral, ve a **Settings** ⚙️
- Haz clic en **Database** 🗄️

### 3. Encuentra la Connection String
- Busca la sección **Connection string**
- Verás algo como:
  ```
  postgresql://postgres:[YOUR-PASSWORD]@db.gcyqggtvnlcmzkjffxuc.supabase.co:5432/postgres
  ```

### 4. Copia tu Contraseña
- La contraseña está entre `:` y `@`
- Por ejemplo, si ves: `postgresql://postgres:mi_password_123@db...`
- Tu contraseña es: `mi_password_123`

### 5. Actualiza .env.local
Reemplaza `[TU-PASSWORD]` en `.env.local` con tu contraseña real:

```bash
# Antes:
DATABASE_URL="postgresql://postgres:[TU-PASSWORD]@db.gcyqggtvnlcmzkjffxuc.supabase.co:5432/postgres"

# Después (ejemplo):
DATABASE_URL="postgresql://postgres:mi_password_123@db.gcyqggtvnlcmzkjffxuc.supabase.co:5432/postgres"
```

## 🧪 Probar la Conexión

Una vez configurada la contraseña:

```bash
# Probar conexión
npm run supabase:test

# Si funciona, configurar la base de datos
npm run db:setup

# Iniciar la aplicación
npm run dev
```

## 🔒 Alternativa: Resetear Contraseña

Si no recuerdas tu contraseña:

1. Ve a **Settings** → **Database**
2. Busca **Database password**
3. Haz clic en **Reset database password**
4. Copia la nueva contraseña
5. Actualiza tu `.env.local`

## ⚠️ Importante

- **NUNCA** compartas tu contraseña de base de datos
- **NO** la subas a GitHub (está en .gitignore)
- Úsala solo en archivos `.env.local` y `.env.production`

## 🎯 Resultado Esperado

Cuando esté configurado correctamente:
- ✅ `npm run supabase:test` debe pasar sin errores
- ✅ La aplicación debe cargar candidatos sin "Error al cargar candidatos"
- ✅ Podrás agregar, editar y eliminar candidatos
