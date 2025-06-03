# 🚀 Deployment en Netlify - CandidatoScope

## 📋 **Variables de Entorno para Netlify**

Configura estas variables en el **Netlify Dashboard** → **Site Settings** → **Environment Variables**:

### **🔑 Variables Requeridas:**

```bash
# Configuración de Supabase
NEXT_PUBLIC_SUPABASE_URL=https://rwcbpuekhaujyzgaodro.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3Y2JwdWVraGF1anl6Z2FvZHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MTgwNzUsImV4cCI6MjA2NDQ5NDA3NX0.uJ5H0RyZ2NUDziv-9DLWgL0PRzu6tN8tsU0kwpY_mM0

# Configuración de producción
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
NEXTAUTH_SECRET=candidatoscope-super-secreto-netlify-2024
NEXTAUTH_URL=https://tu-dominio.netlify.app
```

### **🤖 Variables para IA (Google Gemini):**

```bash
# API Key de Google Gemini para funcionalidades de IA
GOOGLE_GENAI_API_KEY=AIzaSyAvhZujl3qBafiBtmQQpT4rIGxPh0o7OwU
```

> **⚠️ IMPORTANTE:** Esta API key ya está configurada y es funcional. No la cambies a menos que tengas una nueva.

## 🔧 **Configuración de Build en Netlify**

### **Build Settings:**
- **Build Command:** `npm run build`
- **Publish Directory:** `.next`
- **Node Version:** `18`
- **Package Manager:** `npm`

### **Build Environment Variables:**
```bash
NPM_FLAGS=--legacy-peer-deps
NODE_VERSION=18
```

## 📦 **Pasos para Deploy:**

### **1. Conectar Repositorio:**
1. Ve a [Netlify Dashboard](https://app.netlify.com)
2. **New site from Git** → **GitHub**
3. Selecciona el repositorio: `XxLXx2211/RRHHH`
4. Branch: `master`

### **2. Configurar Build:**
- **Build Command:** `npm run build`
- **Publish Directory:** `.next`
- **Functions Directory:** (dejar vacío)

### **3. Configurar Variables de Entorno:**
- Ve a **Site Settings** → **Environment Variables**
- Agrega todas las variables listadas arriba

### **4. Configurar Dominio (opcional):**
- **Domain Settings** → **Custom Domain**
- Configura: `candidatoscope.netlify.app` o tu dominio personalizado

## ✅ **Verificación Post-Deploy:**

### **Funcionalidades a verificar:**
- ✅ **Página principal** carga correctamente
- ✅ **Lista de candidatos** se muestra
- ✅ **CRUD completo** (crear, editar, eliminar candidatos)
- ✅ **Filtros y búsqueda** funcionan
- ✅ **PWA** se puede instalar
- ✅ **Favicon** se muestra correctamente

### **Si hay errores:**
1. **Revisa los logs** en Netlify Dashboard → **Deploys** → **Deploy Log**
2. **Verifica variables de entorno** están configuradas correctamente
3. **Comprueba la base de datos** Supabase está accesible

## 🎯 **URLs Importantes:**

- **Supabase Dashboard:** https://rwcbpuekhaujyzgaodro.supabase.co
- **GitHub Repo:** https://github.com/XxLXx2211/RRHHH
- **Netlify Dashboard:** https://app.netlify.com

## 🔄 **Auto-Deploy:**

El proyecto está configurado para **auto-deploy** desde GitHub:
- Cada push a `master` → Deploy automático
- Pull requests → Deploy preview automático

## 🛠️ **Troubleshooting:**

### **Error de Build:**
```bash
# Si falla el build, usar:
npm install --legacy-peer-deps
npm run build
```

### **Error de Variables de Entorno:**
- Verifica que todas las variables estén configuradas en Netlify
- No uses comillas en las variables de Netlify Dashboard

### **Error de Base de Datos:**
- Verifica que la tabla `candidates` existe en Supabase
- Ejecuta el script `supabase-schema.sql` si es necesario

---

**¡Listo para deployment exitoso en Netlify! 🚀**
