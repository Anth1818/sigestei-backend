# Etapa 1: Build
FROM node:22-alpine AS builder

# Instalar pnpm
RUN corepack enable && corepack prepare pnpm@10.11.1 --activate

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias y schema de Prisma
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
COPY prisma.config.ts ./

# Instalar dependencias (incluyendo devDependencies para el build)
# Proporcionar una DATABASE_URL temporal para que Prisma pueda generar el cliente
RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" pnpm install --frozen-lockfile

# Copiar el resto del código fuente
COPY . .

# Generar el cliente de Prisma
RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" pnpm prisma generate

# Compilar TypeScript
RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" pnpm build

# Etapa 2: Production
FROM node:22-alpine AS production

# Instalar pnpm y openssl (requerido por Prisma)
RUN corepack enable && corepack prepare pnpm@10.11.1 --activate && \
    apk add --no-cache openssl

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
COPY prisma.config.ts ./

# Instalar solo dependencias de producción (ignorando scripts de postinstall)
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Instalar prisma CLI como devDependency para generar el cliente
RUN pnpm add -D prisma@7.2.0

# Copiar los archivos compilados desde la etapa de build
COPY --from=builder /app/dist ./dist

# Regenerar el cliente de Prisma en producción
RUN DATABASE_URL="postgresql://user:pass@localhost:5432/db" pnpm prisma generate

# Remover prisma CLI para reducir tamaño (mantener @prisma/client)
RUN pnpm remove -D prisma

# Crear un usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Cambiar al usuario no-root
USER nodejs

# Exponer el puerto (ajusta según tu configuración)
EXPOSE 3001

# Variables de entorno por defecto (se pueden sobrescribir en docker-compose)
ENV NODE_ENV=production

# Comando de inicio: ejecutar migraciones y luego iniciar el servidor
CMD ["pnpm", "start"]
