# Dockerfile para aplicación Next.js con Prisma
FROM node:18-alpine AS base

# Instalar dependencias necesarias para Prisma
RUN apk add --no-cache libc6-compat openssl

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de configuración de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias
RUN npm ci --only=production && npm cache clean --force

# Generar cliente de Prisma
RUN npx prisma generate

# Etapa de construcción
FROM base AS builder
WORKDIR /app

# Instalar todas las dependencias (incluyendo devDependencies)
COPY package*.json ./
RUN npm ci

# Copiar código fuente
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Construir aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine AS runner
WORKDIR /app

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Cambiar propietario de archivos
RUN chown -R nextjs:nodejs /app

# Cambiar a usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Variables de entorno
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Comando de inicio
CMD ["node", "server.js"]
