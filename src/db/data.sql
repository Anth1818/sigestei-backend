-- ========= INSERTAR DATOS EN TABLAS DE CATÁLOGO =========

-- Insertar Roles
INSERT INTO roles (name) VALUES
('Admin'),
('Technician'),
('User');

-- Insertar Géneros
INSERT INTO genders (name) VALUES
('M'),
('F');

-- Insertar Departamentos
INSERT INTO departments (name) VALUES
('IT'),
('Support'),
('Accounting'),
('HR'),
('Marketing');

-- Insertar Cargos (asumiendo su relación con departamentos)
INSERT INTO positions (name, department_id) VALUES
('Manager', 1), -- IT
('Technician', 2), -- Support
('Contador Senior', 3), -- Accounting
('Especialista en contabilidad', 3), -- Accounting
('Analista de Soporte', 2), -- Support
('Diseñadora Gráfica', 5), -- Marketing
('Especialista en RRHH', 4); -- HR

-- Insertar Tipos de Equipos
INSERT INTO equipment_types (name) VALUES
('Laptop'),
('PC');

-- Insertar Marcas de Equipos
INSERT INTO equipment_brands (name) VALUES
('HP'),
('Dell'),
('Lenovo'),
('Apple'),
('Acer'),
('ASUS'),
('MSI');

-- Insertar Estados de Equipos
INSERT INTO equipment_statuses (name) VALUES
('Activo'),
('En mantenimiento'),
('En reparación'),
('Inactivo');

-- Insertar Tipos de Solicitudes
INSERT INTO request_types (name) VALUES
('Reparación'),
('Mantenimiento'),
('Instalación'),
('Actualización'),
('Soporte');

-- Insertar Estados de Solicitudes
INSERT INTO request_statuses (name) VALUES
('Pendiente'),
('En progreso'),
('Completada'),
('Cancelada');

-- Insertar Prioridades de Solicitudes
INSERT INTO request_priorities (name) VALUES
('Alta'),
('Media'),
('Baja');


-- ========= INSERTAR DATOS EN TABLAS PRINCIPALES =========

-- Insertar Usuarios (usando los IDs de las tablas de catálogo)
-- NOTA: Se usa un hash de contraseña genérico. En una aplicación real, cada uno sería único.
INSERT INTO users (id, full_name, identity_card, email, password_hash, is_active, role_id, position_id, gender_id, created_at) VALUES
(1, 'John Doe', 12345678, 'jdoe@mail.com', '$2b$10$fakedPasswordHash123', true, 1, 1, 1, '2025-08-01T10:00:00Z'),
(2, 'Alice Smith', 87654321, 'asmith@mail.com', '$2b$10$fakedPasswordHash123', false, 2, 2, 2, '2025-08-02T11:00:00Z'),
(3, 'Roberto Pérez', 55667788, 'r.perez@mail.com', '$2b$10$fakedPasswordHash123', true, 3, 3, 1, '2025-08-03T09:00:00Z'),
(4, 'Laura Jiménez', 44556677, 'laura.jimenez@mail.com', '$2b$10$fakedPasswordHash123', true, 3, 7, 2, '2025-08-04T12:00:00Z'),
(5, 'Carmen Ruiz', 99887766, 'carmen.ruiz@mail.com', '$2b$10$fakedPasswordHash123', true, 3, 5, 2, '2025-08-05T08:30:00Z'),
(6, 'María González', 11223344, 'm.gonzalez@mail.com', '$2b$10$fakedPasswordHash123', true, 3, 6, 2, '2025-08-06T10:15:00Z');
-- NOTA: Se asume que 'Carlos Rodríguez', 'Ana García', 'Luis Martínez', 'Pedro Fernández' son también usuarios. 
-- Para este ejemplo, usaremos a los existentes como técnicos.

-- Insertar Equipos de Computación
INSERT INTO computer_equipment (id, asset_number, serial_number, model, location, hardware_specs, software_specs, assigned_user_id, type_id, brand_id, status_id) VALUES
(101, '100101', 'DL001234', 'OptiPlex 7090', 'Oficina 101 - IT', '{"cpu": "Intel Core i7-10700", "ram": "16GB DDR4", "storage": "512GB SSD", "gpu": "Intel UHD Graphics 630", "network": "Ethernet, Wi-Fi"}', '{"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "Windows Defender"}', 1, 2, 2, 1),
(102, '100102', 'HP002345', 'ProDesk 400 G9', 'Oficina 102 - Support', '{"cpu": "Intel Core i5-11500", "ram": "8GB DDR4", "storage": "256GB SSD", "gpu": "Intel UHD Graphics 750", "network": "Ethernet, Wi-Fi"}', '{"os": "Windows 11 Pro", "office": "Microsoft Office 2021", "antivirus": "McAfee"}', 2, 2, 1, 2),
(103, '100103', 'LN003456', 'ThinkStation P340', 'Oficina 103 - IT', '{"cpu": "Intel Xeon W-1250", "ram": "32GB DDR4", "storage": "1TB SSD", "gpu": "NVIDIA Quadro P620", "network": "Ethernet"}', '{"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "ESET NOD32"}', 1, 2, 3, 1),
(104, '100104', 'AC005678', 'Aspire TC-895', 'Oficina 104 - Accounting', '{"cpu": "Intel Core i3-10100", "ram": "8GB DDR4", "storage": "1TB HDD", "gpu": "Intel UHD Graphics 630", "network": "Ethernet"}', '{"os": "Windows 10 Home", "office": "LibreOffice", "antivirus": "Avast"}', 3, 2, 5, 4),
(105, '100105', 'AS006789', 'VivoPC VM65N', 'Oficina 105 - Support', '{"cpu": "Intel Core i5-8250U", "ram": "8GB DDR4", "storage": "512GB SSD", "gpu": "NVIDIA GeForce 930MX", "network": "Ethernet, Wi-Fi"}', '{"os": "Windows 11 Home", "office": "Microsoft Office 365", "antivirus": "Kaspersky"}', 2, 2, 6, 1),
(106, '100106', 'MS008901', 'Cubi 5 10M', 'Oficina 106 - HR', '{"cpu": "Intel Core i5-10210U", "ram": "16GB DDR4", "storage": "256GB SSD", "gpu": "Intel UHD Graphics", "network": "Ethernet, Wi-Fi"}', '{"os": "Windows 10 Pro", "office": "Microsoft Office 2016", "antivirus": "Bitdefender"}', 4, 2, 7, 3),
(201, '100201', 'HP-LAP-001', 'EliteBook 840 G7', 'Oficina 201 - Dirección', '{"cpu": "Intel Core i5-10310U", "ram": "16GB DDR4", "storage": "512GB SSD", "gpu": "Intel UHD Graphics", "network": "Wi-Fi, Bluetooth"}', '{"os": "Windows 11 Pro", "office": "Microsoft Office 365", "antivirus": "Windows Defender"}', 6, 1, 1, 1),
(202, '100202', 'DL-LAP-002', 'XPS 13 9310', 'Oficina 202 - Ventas', '{"cpu": "Intel Core i7-1165G7", "ram": "16GB LPDDR4x", "storage": "1TB SSD", "gpu": "Intel Iris Xe", "network": "Wi-Fi, Bluetooth"}', '{"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "McAfee"}', 5, 1, 2, 2);

-- Insertar Solicitudes
INSERT INTO requests (id, description, request_date, requester_id, beneficiary_id, technician_id, computer_equipment_id, type_id, status_id, priority_id) VALUES
(1, 'El equipo presenta pantalla azul constante y se reinicia automáticamente. Necesita revisión urgente.', '2025-08-01T09:30:00Z', 1, NULL, 2, 101, 1, 1, 1),
(2, 'Solicitud de mantenimiento preventivo mensual. Limpieza de hardware y actualización de software.', '2025-08-02T14:15:00Z', 2, NULL, 2, 102, 2, 2, 2),
(3, 'Instalación de nuevo software de diseño gráfico para el equipo de marketing.', '2025-08-03T10:45:00Z', 1, 6, 2, 103, 3, 3, 3),
(4, 'Actualización del sistema operativo cancelada por incompatibilidad de hardware.', '2025-08-04T08:20:00Z', 3, NULL, 2, 104, 4, 4, 2),
(5, 'Problema con conectividad de red. El equipo no puede acceder a recursos compartidos.', '2025-08-05T16:30:00Z', 2, 5, 2, 105, 5, 1, 1),
(6, 'Limpieza de virus y malware detectado por el antivirus corporativo.', '2025-08-06T11:00:00Z', 4, NULL, 2, 106, 2, 2, 2);