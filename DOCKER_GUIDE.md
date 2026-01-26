# Guía de Dockerización - SIGESTEI Backend

## 📋 Archivos Creados

- **Dockerfile**: Configuración multi-etapa para construcción y producción
- **.dockerignore**: Archivos excluidos de la imagen Docker
- **.env.example**: Plantilla de variables de entorno

## 🏗️ Arquitectura del Dockerfile

El Dockerfile utiliza un **build multi-etapa** para optimizar el tamaño de la imagen:

### Etapa 1: Builder
- Instala todas las dependencias (incluyendo devDependencies)
- Compila TypeScript a JavaScript
- Genera el cliente de Prisma

### Etapa 2: Production
- Solo incluye dependencias de producción
- Copia los archivos compilados de la etapa builder
- Ejecuta como usuario no-root para mayor seguridad
- Tamaño de imagen optimizado (~150-200MB)

## 🚀 Uso en Desarrollo Local

### Construir la imagen:
```bash
docker build -t sigestei-backend .
```

### Ejecutar el contenedor:
```bash
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://postgres:password@host.docker.internal:5432/sigestei_db" \
  sigestei-backend
```

## 📦 Integración con Docker Compose (Raíz del Proyecto)

En el directorio raíz donde tendrás frontend + backend + db, tu `docker-compose.yml` debería verse así:

```yaml
version: '3.8'

services:
  # Base de datos PostgreSQL
  postgres:
    image: postgres:16-alpine
    container_name: sigestei-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: sigestei1818
      POSTGRES_DB: sigestei_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - sigestei-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5

  # Backend
  backend:
    build:
      context: ./sigestei-backend
      dockerfile: Dockerfile
    container_name: sigestei-backend
    restart: unless-stopped
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://postgres:sigestei1818@postgres:5432/sigestei_db?schema=public
      PORT: 3000
      # Agrega aquí tus otras variables de entorno (JWT_SECRET, etc.)
    ports:
      - "3000:3000"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - sigestei-network

  # Frontend (ejemplo, ajusta según tu configuración)
  frontend:
    build:
      context: ./sigestei-frontend
      dockerfile: Dockerfile
    container_name: sigestei-frontend
    restart: unless-stopped
    environment:
      VITE_API_URL: http://backend:3000
      # O la variable que uses en tu frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    networks:
      - sigestei-network

volumes:
  postgres_data:
    driver: local

networks:
  sigestei-network:
    driver: bridge
```

## 🔧 Configuración en Servidor Ubuntu

### 1. Preparar el servidor:
```bash
# Actualizar el sistema
sudo apt update && sudo apt upgrade -y

# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Instalar Docker Compose
sudo apt install docker-compose-plugin

# Agregar tu usuario al grupo docker (opcional)
sudo usermod -aG docker $USER
newgrp docker
```

### 2. Clonar repositorios:
```bash
mkdir sigestei-app && cd sigestei-app
git clone <url-backend> sigestei-backend
git clone <url-frontend> sigestei-frontend
```

### 3. Configurar variables de entorno:
```bash
# Crear archivo .env en la raíz
cat > .env << EOF
DB_PASSWORD=sigestei1818
JWT_SECRET=tu_jwt_secret_super_seguro
EOF

# O copiar desde el ejemplo y editar
cp sigestei-backend/.env.example .env
nano .env
```

### 4. Crear el docker-compose.yml:
Usa el ejemplo de arriba en el directorio raíz

### 5. Iniciar los servicios:
```bash
# Construir e iniciar todos los servicios
docker compose up -d --build

# Ver logs
docker compose logs -f

# Ver estado
docker compose ps
```

### 6. Comandos útiles:
```bash
# Detener servicios
docker compose down

# Detener y eliminar volúmenes (⚠️ elimina la base de datos)
docker compose down -v

# Reconstruir un servicio específico
docker compose up -d --build backend

# Ejecutar migraciones manualmente (si es necesario)
docker compose exec backend pnpm prisma migrate deploy

# Ver logs de un servicio específico
docker compose logs -f backend

# Acceder al shell del contenedor
docker compose exec backend sh
```

## 🔒 Consideraciones de Seguridad

1. **Variables de Entorno**: Nunca commitees archivos `.env` con credenciales reales
2. **Passwords**: Usa contraseñas seguras en producción
3. **Puerto PostgreSQL**: En producción, considera no exponer el puerto 5432
4. **Usuario no-root**: El Dockerfile ya ejecuta como usuario no-root
5. **Actualizaciones**: Mantén las imágenes actualizadas regularmente

## 📊 Optimizaciones Incluidas

- ✅ Build multi-etapa para reducir tamaño de imagen
- ✅ Usuario no-root por seguridad
- ✅ Cache de capas de Docker optimizado
- ✅ Solo incluye dependencias de producción en imagen final
- ✅ Healthcheck para PostgreSQL
- ✅ Migraciones automáticas al iniciar (via `pnpm start`)
- ✅ Volúmenes para persistencia de datos
- ✅ Imagen final de ~210MB

## ✅ Imagen Docker Construida

La imagen `sigestei-backend:latest` se ha construido exitosamente con:
- **Tamaño**: ~210MB (comprimido)
- **Base**: Node.js 22 Alpine
- **Incluye**: Runtime de Node.js, dependencias de producción, código compilado y cliente de Prisma

### Verificar la imagen:
```bash
docker images sigestei-backend
```

## 🆘 Solución de Problemas

### El backend no puede conectarse a la base de datos:
- Verifica que el servicio `postgres` esté saludable: `docker compose ps`
- Verifica la variable `DATABASE_URL` en el backend
- El host debe ser `postgres` (nombre del servicio), no `localhost`

### Las migraciones no se aplican:
```bash
docker compose exec backend pnpm prisma migrate deploy
```

### Error al construir la imagen:
- Limpia el cache de Docker: `docker builder prune`
- Reconstruye sin cache: `docker compose build --no-cache`

### Ver logs detallados:
```bash
docker compose logs -f backend
docker compose logs -f postgres
```

## 📝 Notas Adicionales

- El comando `pnpm start` ejecuta automáticamente `prisma migrate deploy` antes de iniciar el servidor
- El puerto por defecto es 3000, ajústalo según necesites
- Las migraciones de Prisma se aplican automáticamente al iniciar el contenedor
- El volumen `postgres_data` persiste los datos de la base de datos entre reinicios

## 🔄 Workflow de Deployment

1. Haz push de tus cambios al repositorio
2. En el servidor, pull los cambios: `git pull`
3. Reconstruye los servicios: `docker compose up -d --build`
4. Las migraciones se aplicarán automáticamente
