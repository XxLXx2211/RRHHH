# ✅ CHECKLIST DE DEPLOYMENT NETLIFY - CandidatoScope

## 🔧 **CONFIGURACIÓN COMPLETADA**

### ✅ **Archivos Configurados:**
- [x] `.env` - Variables de entorno actualizadas para Netlify
- [x] `.env.netlify` - Archivo de referencia para variables de Netlify
- [x] `netlify.toml` - Configuración de build optimizada
- [x] `next.config.ts` - Configuración de Next.js para Netlify
- [x] `NETLIFY_DEPLOY.md` - Documentación de deployment actualizada

### ✅ **Variables de Entorno Configuradas:**
- [x] `NEXT_PUBLIC_SUPABASE_URL` - URL correcta de Supabase
- [x] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - API Key de Supabase actualizada
- [x] `NEXTAUTH_SECRET` - Secreto para Netlify
- [x] `NEXTAUTH_URL` - URL configurada para Netlify
- [x] `GOOGLE_GENAI_API_KEY` - API Key de Google Gemini
- [x] `NODE_ENV` - Configurado para producción
- [x] `NEXT_TELEMETRY_DISABLED` - Deshabilitado para optimización

### ✅ **Configuración de Build:**
- [x] **Build Command:** `npm install --legacy-peer-deps && npm run build`
- [x] **Publish Directory:** `.next`
- [x] **Node Version:** `18`
- [x] **Plugin:** `@netlify/plugin-nextjs`

## 🚀 **PASOS PARA DEPLOYMENT**

### **1. Conectar Repositorio en Netlify:**
1. Ve a [Netlify Dashboard](https://app.netlify.com)
2. Click en **"New site from Git"**
3. Selecciona **GitHub**
4. Busca y selecciona: `XxLXx2211/RRHHH`
5. Branch: `master` o `main`

### **2. Configurar Build Settings:**
- **Build command:** `npm install --legacy-peer-deps && npm run build`
- **Publish directory:** `.next`
- **Functions directory:** (dejar vacío)

### **3. Agregar Variables de Entorno:**
Ve a **Site Settings** → **Environment Variables** y agrega:

```
NEXT_PUBLIC_SUPABASE_URL=https://rwcbpuekhaujyzgaodro.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3Y2JwdWVraGF1anl6Z2FvZHJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MTgwNzUsImV4cCI6MjA2NDQ5NDA3NX0.uJ5H0RyZ2NUDziv-9DLWgL0PRzu6tN8tsU0kwpY_mM0
NEXTAUTH_SECRET=candidatoscope-super-secreto-netlify-2024
NEXTAUTH_URL=https://tu-sitio.netlify.app
GOOGLE_GENAI_API_KEY=AIzaSyAvhZujl3qBafiBtmQQpT4rIGxPh0o7OwU
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1
```

### **4. Deploy:**
1. Click **"Deploy site"**
2. Espera a que termine el build
3. Actualiza `NEXTAUTH_URL` con la URL real del sitio

## 🔍 **VERIFICACIÓN POST-DEPLOY**

### **Funcionalidades a Probar:**
- [ ] Página principal carga correctamente
- [ ] Lista de candidatos se muestra desde Supabase
- [ ] CRUD de candidatos funciona (crear, editar, eliminar)
- [ ] Filtros y búsqueda funcionan
- [ ] PWA se puede instalar
- [ ] Favicon e iconos se muestran correctamente
- [ ] Funcionalidades de IA (si están implementadas)

### **Si hay Errores:**
1. **Revisa los logs:** Netlify Dashboard → Deploys → Deploy Log
2. **Verifica variables:** Site Settings → Environment Variables
3. **Comprueba Supabase:** Verifica que la base de datos esté accesible

## 🎯 **URLS IMPORTANTES**

- **GitHub Repo:** https://github.com/XxLXx2211/RRHHH
- **Supabase Dashboard:** https://rwcbpuekhaujyzgaodro.supabase.co
- **Netlify Dashboard:** https://app.netlify.com

## ⚠️ **NOTAS IMPORTANTES**

1. **No hay archivos de Vercel** - Proyecto limpio para Netlify
2. **API Key de Google Gemini** ya está configurada y funcional
3. **Supabase** configurado con la URL y API Key correctas
4. **PWA** configurada con iconos y manifest.json
5. **Auto-deploy** activado desde GitHub

---

**¡Proyecto listo para deployment exitoso en Netlify! 🚀**
