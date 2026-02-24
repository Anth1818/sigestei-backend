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
services:
  # Base de datos PostgreSQL
  postgres:
    image: postgres:16-alpine
    container_name: sigestei-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD} # Usa una variable de entorno o un secreto en producción
      POSTGRES_DB: ${DB_NAME}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      # NOTA: NO montar data.sql aquí porque se ejecutaría ANTES de las migraciones
      # Los datos iniciales deben cargarse DESPUÉS de que el backend aplique las migraciones
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
      ALLOWED_ORIGINS: ${ALLOWED_ORIGINS} # URL del frontend en desarrollo (ajusta según tu configuración, en producción debería ser la URL real del frontend)
      NODE_ENV: production
      DATABASE_URL: postgresql://postgres:${DB_PASSWORD}@postgres:5432/${DB_NAME}?schema=public
      PORT: 3001
    ports:
      - "3001:3001" # Exponemos el puerto 3001 para el backend
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - sigestei-network

  # Frontend (Next.js)
  frontend:
    build:
      context: ./sigestei-frontend
      dockerfile: Dockerfile
      args:
        NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    container_name: sigestei-frontend
    restart: unless-stopped
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL} # URl del backend en producción por 
    ports:
      - "3000:3000" # Exponemos el puerto 3000 para el frontend (puedes cambiarlo)
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
DB_NAME=sigestei_db
NEXT_PUBLIC_API_URL=http://localhost:3001
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

# Rebuild de los servicios sin cache (si haces cambios en el Dockerfile o dependencias)
docker compose build --no-cache

# Iniciar sin reconstruir (si ya construiste antes) 
docker compose up -d

# Ver logs
docker compose logs -f

# Ver estado
docker compose ps
```

### 6. Cargar datos iniciales (Primera vez):

**Opción A - Usando el script automático (Recomendado):**

En Windows (PowerShell):
```powershell
# Copiar el script desde el repositorio backend
cp sigestei-backend/init-data.ps1 .

# Ejecutar el script
.\init-data.ps1
```

En Linux/Mac:
```bash
# Copiar el script desde el repositorio backend
cp sigestei-backend/init-data.sh .

# Dar permisos de ejecución
chmod +x init-data.sh

# Ejecutar el script
./init-data.sh
```

**Opción B - Manualmente:**
```bash
# Espera a que el backend termine de iniciar
docker compose logs -f backend

# En otra terminal, verifica las tablas
docker compose exec postgres psql -U postgres -d sigestei_db -c "\dt"

# Carga los datos
docker compose exec -T postgres psql -U postgres -d sigestei_db < sigestei-backend/src/db/data.sql
```

### 7. Comandos útiles:
```bash
# Detener servicios
docker compose down

# Detener y eliminar volúmenes (⚠️ elimina la base de datos)
docker compose down -v

# Reconstruir un servicio específico
docker compose up -d --build backend

# Ejecutar migraciones manualmente (si es necesario)
docker compose exec backend pnpm prisma migrate deploy

# Ejecutar un script SQL en la base de datos
docker compose exec -T postgres psql -U postgres -d sigestei_db < sigestei-backend/src/db/data.sql

# Acceder al shell de PostgreSQL
docker compose exec postgres psql -U postgres -d sigestei_db

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

### Error: "relation does not exist" al cargar datos:
Esto significa que intentaste cargar `data.sql` antes de que las migraciones crearan las tablas.

**Solución:**
1. Espera a que el backend termine de aplicar las migraciones (ver logs: `docker compose logs -f backend`)
2. Verifica que las tablas existen: `docker compose exec postgres psql -U postgres -d sigestei_db -c "\dt"`
3. Luego carga los datos: `docker compose exec -T postgres psql -U postgres -d sigestei_db < sigestei-backend/src/db/data.sql`

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

### 🗄️ Gestión de Datos Iniciales (data.sql)

**Primera Inicialización:**
El orden correcto de ejecución es:

1. PostgreSQL inicia y crea la base de datos
2. Backend inicia y Prisma ejecuta las migraciones (crea las tablas)
3. **Ejecutar el script de inicialización** para insertar los datos iniciales

**Usando el script automático (Recomendado):**

Windows PowerShell:
```powershell
.\init-data.ps1
```

Linux/Mac:
```bash
./init-data.sh
```

El script automáticamente:
- ✅ Espera a que PostgreSQL esté listo
- ✅ Espera a que las migraciones se apliquen
- ✅ Verifica que las tablas existan
- ✅ Carga los datos desde `data.sql`

**Manualmente (si prefieres hacerlo paso a paso):**

```bash
# Después de que todos los servicios estén corriendo:
docker compose exec -T postgres psql -U postgres -d sigestei_db < sigestei-backend/src/db/data.sql
```

**⚠️ IMPORTANTE**: Debes ejecutar el comando anterior la primera vez que levantes los contenedores, después de que el backend haya aplicado las migraciones correctamente.

**Actualizar datos después de la primera inicialización:**

Cuando modifiques `data.sql` y necesites aplicar los cambios:

```bash
# Opción 1: Ejecutar el SQL actualizado manualmente
docker compose exec -T postgres psql -U postgres -d sigestei_db < sigestei-backend/src/db/data.sql

# Opción 2: Recrear completamente la base de datos (⚠️ ELIMINA TODOS LOS DATOS)
docker compose down -v  # Elimina volúmenes
docker compose up -d    # Recrea todo desde cero
```

**Recomendación para Producción:**
Para actualizaciones de datos en producción, considera:
- Crear scripts SQL separados para cada actualización (ej: `update-2026-01-27.sql`)
- Ejecutarlos manualmente con registro de qué se aplicó
- Mantener `data.sql` solo para inicialización de nuevos entornos

## 🔄 Workflow de Deployment

1. Haz push de tus cambios al repositorio
2. En el servidor, pull los cambios: `git pull`
3. Reconstruye los servicios: `docker compose up -d --build`
4. Las migraciones se aplicarán automáticamente
