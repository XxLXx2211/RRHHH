# 🚀 Guía de Deploy - Aplicación Next.js

Esta guía cubre múltiples opciones de deploy para la aplicación de gestión de candidatos.

## 📋 Pre-requisitos

- Node.js 18+ instalado
- npm o yarn
- Variables de entorno configuradas
- Base de datos configurada

## 🔧 Preparación para Deploy

### 1. Verificar configuración
```bash
# Ejecutar verificaciones pre-deploy
npm run deploy:check
```

### 2. Configurar variables de entorno
Copia `.env.example` a `.env` y configura:
```bash
DATABASE_URL="your_database_url"
GEMINI_API_KEY="your_gemini_api_key"
NODE_ENV="production"
```

## 🌐 Opciones de Deploy

### 1. Vercel (Recomendado para desarrollo rápido)

#### Configuración automática:
```bash
npm install -g vercel
vercel login
vercel --prod
```

#### Variables de entorno en Vercel:
- `DATABASE_URL`: URL de tu base de datos
- `GEMINI_API_KEY`: Tu API key de Gemini

### 2. Railway (Recomendado para aplicaciones completas)

#### Deploy automático:
1. Conecta tu repositorio a Railway
2. Configura variables de entorno en el dashboard
3. Railway detectará automáticamente la configuración

#### Variables de entorno en Railway:
```
DATABASE_URL=postgresql://...
GEMINI_API_KEY=your_key
NODE_ENV=production
```

### 3. Docker (Para cualquier proveedor)

#### Build y run local:
```bash
# Construir imagen
npm run docker:build

# Ejecutar contenedor
npm run docker:run
```

#### Deploy con Docker Compose:
```bash
# Configurar variables de entorno
export GEMINI_API_KEY="your_key"

# Iniciar servicios
docker-compose up -d
```

### 4. VPS/Servidor dedicado

#### Con PM2:
```bash
# Instalar PM2 globalmente
npm install -g pm2

# Deploy
./scripts/deploy.sh
pm2 start ecosystem.config.js --env production
```

#### Con systemd:
```bash
# Crear servicio systemd
sudo cp scripts/nextn.service /etc/systemd/system/
sudo systemctl enable nextn
sudo systemctl start nextn
```

### 5. Netlify

#### Configuración:
```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=.next
```

## 🗄️ Configuración de Base de Datos

### PostgreSQL (Producción)
```bash
# Ejecutar migraciones
npm run db:migrate:prod

# Opcional: Seed inicial
npm run db:seed
```

### SQLite (Desarrollo)
```bash
# Push schema
npm run db:push

# Seed datos
npm run db:seed
```

## 🔒 Configuración de Seguridad

### Variables de entorno sensibles:
- Nunca commitear archivos `.env`
- Usar servicios de gestión de secretos
- Rotar API keys regularmente

### Headers de seguridad:
La aplicación incluye headers de seguridad configurados en `next.config.ts`

## 📊 Monitoreo y Logs

### Health Check:
```bash
curl https://your-domain.com/api/health
```

### Logs con PM2:
```bash
pm2 logs nextn-app
pm2 monit
```

### Logs con Docker:
```bash
docker-compose logs -f app
```

## 🚨 Troubleshooting

### Problemas comunes:

#### 1. Error de Prisma Client
```bash
npm run db:generate
```

#### 2. Error de build
```bash
npm run typecheck
npm run lint:fix
```

#### 3. Error de base de datos
```bash
npm run db:migrate:prod
```

#### 4. Variables de entorno
Verificar que todas las variables estén configuradas correctamente.

## 📈 Optimizaciones de Producción

### 1. Configuración de Next.js
- Output standalone habilitado
- Compresión activada
- Headers de seguridad configurados

### 2. Base de datos
- Connection pooling configurado
- Índices optimizados
- Backups automáticos

### 3. CDN y caché
- Archivos estáticos en CDN
- Caché de API responses
- Compresión gzip/brotli

## 🔄 CI/CD

### GitHub Actions
El archivo `.github/workflows/deploy.yml` incluye:
- Tests automáticos
- Build verification
- Deploy automático a producción

### Configurar secrets en GitHub:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `DATABASE_URL`
- `GEMINI_API_KEY`

## 📞 Soporte

Para problemas de deploy:
1. Verificar logs de la aplicación
2. Revisar configuración de variables de entorno
3. Verificar conectividad de base de datos
4. Consultar documentación del proveedor

## 🎯 Checklist de Deploy

- [ ] Variables de entorno configuradas
- [ ] Base de datos migrada
- [ ] Build exitoso localmente
- [ ] Tests pasando
- [ ] Health check funcionando
- [ ] Monitoreo configurado
- [ ] Backups configurados
- [ ] SSL/HTTPS configurado
- [ ] Dominio configurado
- [ ] Performance optimizada

¡Tu aplicación está lista para producción! 🎉
