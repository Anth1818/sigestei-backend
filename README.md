# SIGESTEI Backend API

Sistema integrado de gestión de solicitudes técnicas e inventario de equipos informáticos 

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Configuración Local](#configuración-local)
- [Despliegue en Producción](#despliegue-en-producción)
- [Scripts Disponibles](#scripts-disponibles)
- [API Endpoints](#api-endpoints)
- [Base de Datos](#base-de-datos)
- [Variables de Entorno](#variables-de-entorno)
- [Convenciones del Proyecto](#convenciones-del-proyecto)

## 📖 Descripción

SIGESTEI es un sistema backend para la gestión integral de equipos de cómputo (PCs, laptops, impresoras), solicitudes de servicio técnico, asignaciones de equipos y auditoría de cambios. Proporciona una API RESTful completa para administrar el inventario de equipos, usuarios, departamentos y el flujo de trabajo de solicitudes de soporte técnico.

### Características Principales

- 🔐 **Autenticación y Autorización**: Sistema basado en JWT con roles (Admin, Coordinador Técnico, Usuario)
- 📦 **Gestión de Equipos**: Inventario completo de equipos con seguimiento de estado y asignaciones
- 📝 **Sistema de Solicitudes**: Flujo completo de solicitudes de soporte con prioridades y estados
- 👥 **Gestión de Usuarios**: Administración de usuarios con roles y permisos
- 📊 **Dashboard**: Estadísticas y métricas del sistema
- 🔍 **Auditoría**: Registro completo de cambios y acciones del sistema
- 📱 **Catálogos**: Gestión de catálogos (tipos de equipo, marcas, estados, etc.)

## 🛠️ Tecnologías

### Core
- **Node.js 22** - Entorno de ejecución
- **TypeScript 5.9** - Lenguaje de programación
- **Express 5.1** - Framework web
- **pnpm 10.11** - Gestor de paquetes

### Base de Datos
- **PostgreSQL** - Base de datos relacional
- **Prisma 7.2** - ORM y migraciones de base de datos
- **pg 8.16** - Cliente PostgreSQL

### Autenticación y Seguridad
- **jsonwebtoken** - Tokens JWT
- **bcrypt 6.0** - Hashing de contraseñas
- **cookie-parser** - Manejo de cookies

### Utilidades
- **cors** - Manejo de CORS
- **dotenv** - Variables de entorno
- **nodemon** - Hot-reload en desarrollo

## 🏗️ Arquitectura

El proyecto sigue una arquitectura en capas con separación de responsabilidades:

```
┌─────────────────────────────────────────┐
│           Client (Frontend)             │
└─────────────────┬───────────────────────┘
                  │ HTTP/REST
┌─────────────────▼───────────────────────┐
│        Routes (Endpoints)               │
│  - Define endpoints y validaciones      │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           Controllers                   │
│  - Maneja requests/responses HTTP       │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│            Services                     │
│  - Lógica de negocio                    │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│          Repositories                   │
│  - Acceso a datos (Prisma)              │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│        Database (PostgreSQL)            │
└─────────────────────────────────────────┘
```

### Middlewares
- **authMiddleware**: Verifica autenticación JWT
- **roleMiddleware**: Controla acceso basado en roles
- **auditMiddleware**: Registra acciones para auditoría

## 📂 Estructura del Proyecto

```
sigestei-backend/
├── prisma/                     # Esquema y migraciones de Prisma
│   ├── schema.prisma          # Definición del modelo de datos
│   └── migrations/            # Migraciones de base de datos
├── src/
│   ├── api/
│   │   ├── controllers/       # Controladores (lógica HTTP)
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── equipment.controller.ts
│   │   │   ├── request.controller.ts
│   │   │   ├── catalog.controller.ts
│   │   │   ├── dashboard.controller.ts
│   │   │   └── audit.controller.ts
│   │   ├── repositories/      # Acceso a datos
│   │   │   ├── user.repository.ts
│   │   │   ├── equipment.repository.ts
│   │   │   ├── request.repository.ts
│   │   │   └── ...
│   │   ├── routes/            # Definición de rutas
│   │   │   ├── auth.routes.ts
│   │   │   ├── user.routes.ts
│   │   │   └── ...
│   │   └── services/          # Lógica de negocio
│   │       ├── auth.service.ts
│   │       ├── user.service.ts
│   │       └── ...
│   ├── config/                # Configuraciones
│   │   └── prisma.ts         # Cliente Prisma
│   ├── middlewares/           # Middlewares personalizados
│   │   ├── authMiddleware.ts
│   │   ├── roleMiddleware.ts
│   │   └── auditMiddleware.ts
│   ├── utils/                 # Utilidades
│   │   ├── controllerFactory.ts
│   │   ├── queryHelpers.ts
│   │   └── types.ts
│   ├── app.ts                # Configuración de Express
│   └── server.ts             # Punto de entrada
├── .env                      # Variables de entorno (no versionado)
├── Dockerfile               # Configuración Docker
├── docker-compose.yml       # Orquestación local
├── railway.json            # Configuración Railway
├── package.json           # Dependencias
└── tsconfig.json         # Configuración TypeScript
```

## ✅ Requisitos Previos

### Para Desarrollo Local
- **Node.js 22+** ([Descargar](https://nodejs.org/))
- **pnpm 10.11+** (instalar con `corepack enable`)
- **PostgreSQL 15+** ([Descargar](https://www.postgresql.org/download/))
- **Git** ([Descargar](https://git-scm.com/))

### Para Producción con Docker
- **Docker** ([Descargar](https://www.docker.com/))
- **Docker Compose** (incluido con Docker Desktop)

## 🚀 Configuración Local

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/sigestei-backend.git
cd sigestei-backend
```

### 2. Instalar Dependencias

```bash
# Habilitar pnpm si no lo tienes
corepack enable

# Instalar dependencias
pnpm install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/sigestei"

# JWT
JWT_SECRET="tu-secreto-super-seguro-cambiar-en-produccion"

# Configuración del servidor
PORT=3001
NODE_ENV=development

# CORS - Orígenes permitidos (separados por coma)
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173"
```

### 4. Configurar la Base de Datos

#### Opción A: PostgreSQL Local

```bash
# Crear base de datos
createdb sigestei

# O usando psql
psql -U postgres
CREATE DATABASE sigestei;
\q
```

#### Opción B: Docker Compose (Recomendado)

```bash
# Iniciar PostgreSQL en Docker
docker-compose up -d postgres
```

### 5. Ejecutar Migraciones

```bash
# Aplicar migraciones
pnpm prisma migrate deploy

# O en desarrollo (crea nuevas migraciones)
pnpm prisma migrate dev
```

### 6. Inicializar Datos (Opcional)

```bash
# Windows
.\init-data.ps1

# Linux/Mac
./init-data.sh
```

### 7. Iniciar el Servidor

```bash
# Modo desarrollo (con hot-reload)
pnpm dev

# Modo producción
pnpm build
pnpm start
```

El servidor estará disponible en `http://localhost:3001`

### 8. Verificar Instalación

```bash
# Health check
curl http://localhost:3001/health

# Respuesta esperada:
# {"status":"ok","timestamp":"2026-02-03T..."}
```

## 🏭 Despliegue en Producción

### Opción 1: Railway (Recomendado)

1. **Crear cuenta en [Railway.app](https://railway.app/)**

2. **Crear nuevo proyecto desde GitHub**
   - Conecta tu repositorio
   - Railway detectará automáticamente el `railway.json`

3. **Configurar Base de Datos**
   - Agrega un servicio PostgreSQL
   - Railway generará automáticamente `DATABASE_URL`

4. **Configurar Variables de Entorno**
   ```
   NODE_ENV=production
   JWT_SECRET=<generar-secreto-seguro>
   ALLOWED_ORIGINS=https://tu-frontend.com
   ```

5. **Deploy**
   - Railway desplegará automáticamente en cada push a main

### Opción 2: Docker

1. **Construir imagen**
   ```bash
   docker build -t sigestei-backend .
   ```

2. **Ejecutar contenedor**
   ```bash
   docker run -d \
     -p 3001:3001 \
     -e DATABASE_URL="postgresql://user:pass@host:5432/db" \
     -e JWT_SECRET="tu-secreto" \
     -e NODE_ENV="production" \
     -e ALLOWED_ORIGINS="https://tu-frontend.com" \
     --name sigestei-backend \
     sigestei-backend
   ```

### Opción 3: Render, Heroku, etc.

1. **Configurar buildpack de Node.js**
2. **Configurar variables de entorno** (ver sección Variables de Entorno)
3. **Agregar PostgreSQL addon**
4. **Deploy desde GitHub**

## 📜 Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia servidor con hot-reload (nodemon)

# Producción
pnpm build           # Compila TypeScript y genera Prisma Client
pnpm start           # Inicia servidor en producción

# Base de datos
pnpm prisma migrate dev        # Crea y aplica nueva migración
pnpm prisma migrate deploy     # Aplica migraciones pendientes
pnpm prisma generate           # Genera Prisma Client
pnpm prisma studio             # Abre interfaz visual de la BD

# Testing
pnpm test            # (Por configurar)
```

## 🌐 API Endpoints

### Autenticación (`/api/auth`)

#### `POST /api/auth/login` - Login de usuario
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

#### `POST /api/auth/logout` - Logout de usuario
Sin body requerido.

---

### Usuarios (`/api/users`)
> Requiere autenticación. Roles: 1=Admin, 2=Manager, 3=Técnico, 4=Usuario

- `GET /api/users` - Listar todos los usuarios (Admin)
- `GET /api/users/identity_card/:identity_card` - Obtener usuario por cédula (Todos)
- `GET /api/users/allUsersByAllDepartments` - Obtener usuarios agrupados por departamento (Admin)
- `GET /api/users/allUsersByDepartment/:department_id` - Obtener usuarios por departamento (Todos)
- `GET /api/users/allUsersEnabledToGetSupport/department/:department_id` - Obtener usuarios habilitados para soporte (Todos)

#### `POST /api/users/register` - Registrar nuevo usuario (Admin)
```json
{
  "identity_card": 1234567890,
  "full_name": "Juan Pérez",
  "email": "juan.perez@ejemplo.com",
  "password": "contraseñaSegura123",
  "role_id": 4,
  "position_id": 1,
  "gender_id": 1,
  "department_id": 1
}
```
**Campos obligatorios**: `identity_card`, `full_name`, `email`, `password`, `role_id`  
**Campos opcionales**: `position_id`, `gender_id`, `department_id`

#### `PUT /api/users/update/:identity_card` - Actualizar usuario (Admin)
```json
{
  "full_name": "Juan Pérez Actualizado",
  "email": "juan.perez.nuevo@ejemplo.com",
  "role_id": 3,
  "position_id": 2,
  "gender_id": 1,
  "department_id": 2
}
```
Puedes enviar solo los campos que deseas actualizar.

#### `PUT /api/users/toggleActive/:identity_card` - Activar/desactivar usuario (Admin)
Sin body requerido. Alterna el estado `is_active` del usuario.

#### `PUT /api/users/resetPassword/:identity_card` - Resetear contraseña (Admin)
Sin body requerido. Resetea la contraseña al número de cédula del usuario.

#### `PUT /api/users/changePassword/:identity_card` - Cambiar contraseña (Todos)
```json
{
  "new_password": "nuevaContraseñaSegura456"
}
```

---

### Equipos (`/api/equipment`)
> Requiere autenticación

- `GET /api/equipment` - Listar todos los equipos (Todos)
  - Query param opcional: `?type=1` (filtrar por tipo de equipo)
- `GET /api/equipment/:id` - Obtener equipo por ID (Admin, Manager, Técnico)
- `GET /api/equipment/asset/:asset_number` - Obtener equipo por número de activo (Admin, Manager, Técnico)
- `GET /api/equipment/serial/:serial_number` - Obtener equipo por número de serie (Admin, Manager, Técnico)

#### `POST /api/equipment/register` - Registrar nuevo equipo (Admin, Manager, Técnico)
```json
{
  "asset_number": "ACT-2024-001",
  "serial_number": "SN123456789",
  "model": "Dell Latitude 5420",
  "location": "Oficina Principal - Piso 3",
  "type_id": 1,
  "brand_id": 2,
  "status_id": 1,
  "department_id": 1,
  "assigned_user_id": 5,
  "specifications": {
    "processor": "Intel Core i7",
    "ram": "16GB",
    "storage": "512GB SSD",
    "os": "Windows 11 Pro"
  }
}
```
**Campos obligatorios**: `asset_number`, `serial_number`, `type_id`, `brand_id`, `status_id`  
**Campos opcionales**: `model`, `location`, `department_id`, `assigned_user_id`, `specifications` (JSON)

#### `PUT /api/equipment/update/:id` - Actualizar equipo (Admin, Manager, Técnico)
```json
{
  "model": "Dell Latitude 5430",
  "location": "Oficina Principal - Piso 2",
  "status_id": 2,
  "assigned_user_id": 7,
  "specifications": {
    "processor": "Intel Core i7",
    "ram": "32GB",
    "storage": "1TB SSD",
    "os": "Windows 11 Pro"
  }
}
```
Puedes enviar solo los campos que deseas actualizar.

---

### Solicitudes (`/api/requests`)
> Requiere autenticación

- `GET /api/requests` - Listar todas las solicitudes (Todos)
- `GET /api/requests/paginated?page=1&limit=100` - Listar solicitudes con paginación (Todos)
- `GET /api/requests/filter` - Filtrar solicitudes con múltiples criterios (Todos)
  - Query params: `technician_ids=1,2`, `status_ids=1`, `priority_ids=1,2`, `type_ids=1`, `date_from=2024-01-01`, `date_to=2024-12-31`, `page=1`, `limit=100`
- `GET /api/requests/getAllByUser/:id` - Obtener solicitudes por usuario (Todos)
- `GET /api/requests/getAllForTechnician/:id` - Obtener solicitudes de un técnico (Admin, Manager, Técnico)

#### `POST /api/requests/register` - Crear nueva solicitud (Todos)
```json
{
  "description": "La computadora no enciende, se escucha un pitido constante",
  "requester_id": 15,
  "beneficiary_id": 15,
  "equipment_id": 42,
  "type_id": 1,
  "status_id": 1,
  "priority_id": 2,
  "type_equipment_id": 1
}
```
**Campos obligatorios**: `description`, `requester_id`, `equipment_id`, `type_id`  
**Campos opcionales**: `beneficiary_id`, `technician_id`, `type_equipment_id`, `status_id` (default: 1), `priority_id` (default: 2), `comments_technician`, `reassignment_reason`

#### `PUT /api/requests/updateRequest/:id` - Actualizar solicitud (Admin, Manager, Técnico)
```json
{
  "status_id": 2,
  "priority_id": 1,
  "technician_id": 3,
  "comments_technician": "Se reemplazó la memoria RAM defectuosa",
  "resolution_date": "2024-02-03T15:30:00Z"
}
```
Puedes enviar solo los campos que deseas actualizar. Los cambios de estado, prioridad y técnico asignado se registran automáticamente en el historial.

---

### Catálogos (`/api/catalogs`)
> Público (no requiere autenticación)

- `GET /api/catalogs` - Obtener todos los catálogos en una sola respuesta
  - Tipos de equipo, marcas, estados de equipo
  - Departamentos, posiciones, géneros
  - Tipos de solicitud, estados de solicitud, prioridades
  - Opciones de SO, suites de oficina, soluciones antivirus
  - Tipos de equipo de cómputo

### Dashboard (`/api/dashboard`)
> Requiere autenticación

- `GET /api/dashboard/metrics` - Obtener métricas del dashboard

### Auditoría (`/api/audit`)
> Requiere autenticación. Admin y Manager

- `GET /api/audit/requests/:requestId` - Historial de auditoría de una solicitud (Admin, Manager, Técnico)
- `GET /api/audit/equipment/:equipmentId` - Historial de auditoría de un equipo (Admin, Manager, Técnico)
- `GET /api/audit/users/:userId/logins` - Historial de logins de un usuario (Admin, Manager)
- `GET /api/audit/users/:userId/changes` - Historial de cambios de un usuario (Admin, Manager)
- `GET /api/audit/recent` - Obtener cambios recientes del sistema (Admin, Manager)
- `GET /api/audit/statistics` - Obtener estadísticas de auditoría (Admin, Manager)
- `GET /api/audit/search` - Buscar en logs de auditoría con filtros (Admin, Manager)
  - Query params: `entity_type`, `entity_id`, `change_type`, `changed_by_id`, `start_date`, `end_date`, `limit`

### Historial de Solicitudes (`/api/request-history`)
> Requiere autenticación

- `GET /api/request-history/:requestId` - Obtener historial completo de una solicitud
- `GET /api/request-history/:requestId/type/:changeType` - Obtener historial por tipo de cambio
- `GET /api/request-history/user/:userId` - Obtener todos los cambios realizados por un usuario

## 🗄️ Base de Datos

### Modelo de Datos Principal

- **users**: Usuarios del sistema (Admin, Técnico, Usuario)
- **equipment**: Inventario de equipos (PCs, Laptops, Impresoras)
- **requests**: Solicitudes de servicio técnico
- **request_history**: Historial de cambios en solicitudes
- **departments**: Departamentos de la organización
- **positions**: Puestos de trabajo
- **equipment_types**: Tipos de equipo (catálogo)
- **equipment_brands**: Marcas de equipo (catálogo)
- **equipment_statuses**: Estados de equipo (catálogo)
- **request_types**: Tipos de solicitud (catálogo)
- **request_statuses**: Estados de solicitud (catálogo)
- **request_priorities**: Prioridades (catálogo)
- **audit_logs**: Registro de auditoría

### Gestión de Migraciones

```bash
# Crear nueva migración
pnpm prisma migrate dev --name nombre_descriptivo

# Aplicar migraciones en producción
pnpm prisma migrate deploy

# Ver estado de migraciones
pnpm prisma migrate status

# Resetear base de datos (⚠️ solo desarrollo)
pnpm prisma migrate reset
```

## 🔐 Variables de Entorno

### Requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DATABASE_URL` | URL de conexión a PostgreSQL | `postgresql://user:pass@localhost:5432/sigestei` |
| `JWT_SECRET` | Secreto para firmar tokens JWT | `mi-secreto-super-seguro-de-64-caracteres-minimo` |

### Opcionales

| Variable | Descripción | Default | Ejemplo |
|----------|-------------|---------|---------|
| `PORT` | Puerto del servidor | `3001` | `3000` |
| `NODE_ENV` | Entorno de ejecución | `development` | `production` |
| `ALLOWED_ORIGINS` | Orígenes CORS permitidos (separados por coma) | `http://localhost:3000` | `https://app.com,https://admin.app.com` |

### Ejemplo Completo (.env)

```bash
# Base de datos
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sigestei"

# JWT
JWT_SECRET="super-secreto-cambiar-en-produccion-minimo-64-caracteres-para-seguridad"

# Servidor
PORT=3001
NODE_ENV=development

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:5173,http://localhost:4200"
```

## 📝 Convenciones del Proyecto

### Estructura de Código

1. **Controladores** (`controllers/`): Manejan HTTP request/response
2. **Servicios** (`services/`): Contienen lógica de negocio
3. **Repositorios** (`repositories/`): Acceso a datos con Prisma
4. **Rutas** (`routes/`): Definen endpoints y middlewares
5. **Middlewares** (`middlewares/`): Lógica transversal (auth, audit)
6. **Utils** (`utils/`): Funciones auxiliares reutilizables

### Patrones de Diseño

- **Repository Pattern**: Abstracción de acceso a datos
- **Service Layer**: Lógica de negocio separada de HTTP
- **Dependency Injection**: A través de imports ES6
- **Factory Pattern**: Para crear controladores genéricos

### Estilo de Código

- **TypeScript**: Tipado estricto
- **ES6+**: Import/export, async/await, arrow functions
- **Camel Case**: Para variables y funciones
- **Pascal Case**: Para clases y tipos
- **Snake Case**: Para nombres de tablas y columnas en BD

### Git Workflow

```bash
# Rama principal
main (o master)

# Ramas de desarrollo
feature/nombre-feature
bugfix/nombre-bug
hotfix/nombre-hotfix
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para reportar problemas o solicitar features, abre un issue en el repositorio.

## 📄 Licencia

ISC

---

**Desarrollado con ❤️ para la gestión eficiente de equipos tecnológicos**