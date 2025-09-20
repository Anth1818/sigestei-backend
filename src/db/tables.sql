-- ========= TABLAS DE CATÁLOGO O DIMENSIONALES =========
-- Estas tablas evitan la redundancia y mantienen la consistencia.

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE genders (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    department_id INT REFERENCES departments(id)
);


CREATE TABLE equipment_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- Ej: 'Laptop', 'PC', 'Impresora'
);

CREATE TABLE equipment_brands (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- Ej: 'Dell', 'HP', 'Lenovo'
);

CREATE TABLE equipment_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- Ej: 'Activo', 'En Mantenimiento', 'En Reparación', 'Inactivo'
);

CREATE TABLE request_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- Ej: 'Reparación', 'Mantenimiento', 'Instalación'
);

CREATE TABLE request_statuses (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- Ej: 'Pendiente', 'En Progreso', 'Completada', 'Cancelada'
);

CREATE TABLE request_priorities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- Ej: 'Alta', 'Media', 'Baja'
);

-- ========= TABLAS PRINCIPALES O DE HECHOS =========
-- Estas tablas contienen el núcleo de la información del negocio.

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    identity_card INT UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- NUNCA guardar contraseñas en texto plano
    is_active BOOLEAN DEFAULT true,
    role_id INT NOT NULL REFERENCES roles(id),
    position_id INT REFERENCES positions(id),
    gender_id INT REFERENCES genders(id),
    department_id INT REFERENCES departments(id), -- NOTA: Este campo es redundante ya que el departamento se puede obtener a través de 'position_id'. Se mantiene por conveniencia y para simplificar consultas (desnormalización).
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE computer_equipment (
    id SERIAL PRIMARY KEY,
    asset_number VARCHAR(100) UNIQUE NOT NULL, -- N° de bien o activo fijo
    serial_number VARCHAR(255) UNIQUE NOT NULL,
    model VARCHAR(255),
    location VARCHAR(255),
    hardware_specs JSONB, -- Usamos JSONB para flexibilidad en las especificaciones
    software_specs JSONB,
    assigned_user_id INT REFERENCES users(id), -- Usuario al que está asignado el equipo
    type_id INT NOT NULL REFERENCES equipment_types(id),
    brand_id INT NOT NULL REFERENCES equipment_brands(id),
    status_id INT NOT NULL REFERENCES equipment_statuses(id)
);

CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    description TEXT NOT NULL,
    request_date TIMESTAMPTZ DEFAULT NOW(),
    resolution_date TIMESTAMPTZ, -- Fecha en que se completó o canceló
    comments_technician TEXT, -- Comentarios del técnico

    -- IDs de los involucrados
    requester_id INT NOT NULL REFERENCES users(id),         -- Quien crea la solicitud
    beneficiary_id INT REFERENCES users(id),                -- Para quien es la solicitud (tercero)
    technician_id INT REFERENCES users(id),                 -- Técnico asignado a la tarea
    -- MEJORA SUGERIDA: Se podría agregar una restricción (CHECK o un TRIGGER) para asegurar que el 'technician_id' corresponda a un usuario con el rol de 'Technician'.

    -- IDs de los elementos
    computer_equipment_id INT REFERENCES computer_equipment(id),
    type_id INT NOT NULL REFERENCES request_types(id),
    status_id INT NOT NULL REFERENCES request_statuses(id),
    priority_id INT NOT NULL REFERENCES request_priorities(id)
);