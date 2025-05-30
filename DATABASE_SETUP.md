# 🗄️ Configuración de Base de Datos PostgreSQL

Este documento explica cómo configurar PostgreSQL para CandidatoScope.

## 📋 Requisitos Previos

- Docker y Docker Compose instalados
- Node.js 18+ instalado
- npm o yarn instalado

## 🚀 Configuración Rápida

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

El archivo `.env.local` ya está configurado con valores por defecto para desarrollo:

```env
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/candidatoscope?schema=public"
```

### 3. Iniciar PostgreSQL con Docker

```bash
# Iniciar PostgreSQL en segundo plano
docker-compose up -d postgres

# Verificar que esté funcionando
docker-compose ps
```

### 4. Configurar la Base de Datos

```bash
# Generar el cliente de Prisma
npm run db:generate

# Aplicar el esquema a la base de datos
npm run db:push

# Poblar con datos de ejemplo (opcional)
npm run db:seed
```

### 5. Iniciar la Aplicación

```bash
npm run dev
```

## 🛠️ Comandos Útiles

### Base de Datos

```bash
# Generar cliente de Prisma
npm run db:generate

# Aplicar cambios al esquema
npm run db:push

# Crear y aplicar migraciones
npm run db:migrate

# Abrir Prisma Studio (interfaz visual)
npm run db:studio

# Poblar con datos de ejemplo
npm run db:seed
```

### Docker

```bash
# Iniciar todos los servicios
docker-compose up -d

# Ver logs de PostgreSQL
docker-compose logs postgres

# Detener servicios
docker-compose down

# Reiniciar PostgreSQL
docker-compose restart postgres
```

## 🔧 Administración de Base de Datos

### Opción 1: Prisma Studio
```bash
npm run db:studio
```
Abre en: http://localhost:5555

### Opción 2: pgAdmin (incluido en Docker)
- URL: http://localhost:5050
- Email: admin@candidatoscope.com
- Password: admin123

### Opción 3: Línea de Comandos
```bash
# Conectar a PostgreSQL
docker exec -it candidatoscope-postgres psql -U postgres -d candidatoscope

# Comandos útiles en psql:
# \dt - Listar tablas
# \d candidates - Describir tabla candidates
# SELECT * FROM candidates; - Ver todos los candidatos
# \q - Salir
```

## 📊 Estructura de la Base de Datos

### Tabla Principal: `candidates`
- Información personal (nombre, cédula, edad, etc.)
- Datos de contacto (teléfono, email, dirección)
- Proceso de entrevista (fechas, entrevistadores)
- Información profesional (área, experiencia, salario)
- Seguimiento (estatus, comentarios)

### Tablas de Referencia:
- `locations` - Ubicaciones principales
- `zones` - Zonas por ubicación

## 🔒 Seguridad

### Desarrollo
- Usuario: `postgres`
- Password: `postgres123`
- Puerto: `5432`

### Producción
Para producción, considera usar:
- **Neon** (https://neon.tech) - PostgreSQL serverless
- **Railway** (https://railway.app) - Hosting con PostgreSQL
- **Supabase** (https://supabase.com) - Backend as a Service
- **DigitalOcean** - Managed PostgreSQL

## 🐛 Solución de Problemas

### Error: "database does not exist"
```bash
docker-compose down
docker-compose up -d postgres
npm run db:push
```

### Error: "Port 5432 already in use"
```bash
# Cambiar puerto en docker-compose.yml
ports:
  - "5433:5432"  # Usar puerto 5433 en lugar de 5432

# Actualizar DATABASE_URL en .env.local
DATABASE_URL="postgresql://postgres:postgres123@localhost:5433/candidatoscope?schema=public"
```

### Error: "Cannot connect to database"
```bash
# Verificar que Docker esté funcionando
docker ps

# Verificar logs de PostgreSQL
docker-compose logs postgres

# Reiniciar servicios
docker-compose restart
```

## 📈 Migración desde Datos Mock

Los datos mock existentes en `src/app/page.tsx` se pueden migrar ejecutando:

```bash
npm run db:seed
```

Esto creará candidatos de ejemplo basados en los datos mock originales.

## 🔄 Backup y Restauración

### Crear Backup
```bash
docker exec candidatoscope-postgres pg_dump -U postgres candidatoscope > backup.sql
```

### Restaurar Backup
```bash
docker exec -i candidatoscope-postgres psql -U postgres candidatoscope < backup.sql
```
