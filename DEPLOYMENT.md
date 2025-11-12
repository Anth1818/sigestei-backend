# 🚀 Deployment Guide - Railway

## ⚠️ Cambios Importantes Realizados

**Prisma Client:** Se cambió de output personalizado (`src/generated/prisma`) a la ubicación estándar de node_modules (`@prisma/client`). Esto resuelve problemas de importación en producción.

## Variables de Entorno Necesarias

Configura estas variables en Railway:

```bash
DATABASE_URL=postgresql://usuario:password@host:port/database
PORT=3001
NODE_ENV=production
ALLOWED_ORIGINS=https://tu-frontend-url.com
```

## Pasos para Deploy en Railway

1. **Conecta tu repositorio a Railway**
   - Ve a [railway.app](https://railway.app)
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"

2. **Configura la base de datos**
   - Agrega un servicio PostgreSQL en Railway
   - Copia la `DATABASE_URL` que Railway genera
   - Agrégala como variable de entorno en tu servicio

3. **Configura las variables de entorno**
   - Ve a la pestaña "Variables"
   - Agrega todas las variables listadas arriba

4. **Deploy automático**
   - Railway detectará automáticamente el `nixpacks.toml`
   - Ejecutará: `pnpm install` → `pnpm build` → `pnpm start`

## Verificación Post-Deploy

- Health check: `https://tu-app.railway.app/health`
- API root: `https://tu-app.railway.app/`

## Comandos Locales

```bash
# Desarrollo
pnpm dev

# Build
pnpm build

# Producción (después de build)
pnpm start

# Regenerar Prisma Client
pnpm exec prisma generate

# Push schema a DB
pnpm exec prisma db push
```

## Troubleshooting

**Error: Cannot find module 'dist/server.js'**
- Asegúrate de que el build se ejecutó correctamente
- Verifica que existe la carpeta `dist/`

**Error: Prisma Client not found**
- Ejecuta `prisma generate` en el build
- Verifica que `postinstall` esté en `package.json`

**Error de CORS**
- Verifica que `ALLOWED_ORIGINS` incluya tu frontend
- Formato: URLs separadas por comas sin espacios
