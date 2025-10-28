-- ========= INSERTAR DATOS EN TABLAS DE CATÁLOGO =========
--------------------------------Primero-------------------------------------
-- Ejecutar este bloque primero

-- Insertar Roles
INSERT INTO roles (name) VALUES
('admin'),
('manager'),
('technician'),
('user');

-- Insertar Géneros
INSERT INTO genders (name) VALUES
('M'),
('F');

-- Insertar Departamentos
INSERT INTO departments (name) VALUES
-- ========= NIVEL ESTRATÉGICO =========
('Directorio ejecutivo'),
('Auditoría interna'),
('Presidencia'),
('Dirección general'),
('Dirección de despacho'),

-- ========= NIVEL UNIDADES DE APOYO =========
('Consultoría jurídica'),
('Oficina de planificación, organización y presupuesto'),
('Oficina de administración y servicios'),
('Oficina de sistemas y tecnología de la información'),
('Oficina de recursos humanos'),
('Oficina de comunicación e imagen institucional'),
('Oficina de relaciones internacionales'),
('Oficina de atención ciudadana'),

-- ========= NIVEL UNIDADES SUSTANTIVAS =========
('Gerencia de atención integral y prevención de violencia contra las mujeres'),
('Gerencia de la defensoría nacional de los derechos de la mujer'),
('Gerencia de desarrollo alternativo y política regional'),
('Gerencia de investigación y capacitación');


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
('Averiado'),
('Inactivo');

-- Insertar Tipos de Solicitudes
INSERT INTO request_types (name) VALUES
('Mantenimiento Preventivo'),
('Mantenimiento Correctivo'),
('Reparación de Hardware'),
('Reparación de Software'),
('Instalación de Hardware'),
('Instalación de Software'),
('Actualización de Hardware'),
('Actualización de Software'),
('Soporte de Hardware'),
('Soporte de Software');

-- Insertar Estados de Solicitudes
INSERT INTO request_statuses (name) VALUES
('Pendiente'),
('En proceso'),
('Resuelta'),
('Cancelada');

-- Insertar Prioridades de Solicitudes
INSERT INTO request_priorities (name) VALUES
('Alta'),
('Media'),
('Baja');

INSERT INTO antivirus_solutions (name) VALUES
('Windows Defender'),
('McAfee'),
('Norton Antivirus'),
('Kaspersky'),
('Avast'),
('ESET NOD32');

INSERT INTO office_suites (name) VALUES
('Microsoft Office'),
('LibreOffice'),
('Google Workspace'),
('WPS Office'),
('OnlyOffice');

INSERT INTO os_options (name) VALUES
('Windows 7 Professional'),
('Windows 10 Pro'),
('Windows 11 Pro'),
('Ubuntu 20.04 LTS'),
('macOS Monterey'),
('Fedora 34');

--------------------Fin del primero----------------------------------


--------------------Segundo--------------------------------
-- Ejecutar este bloque después del primero

-- Insertar Cargos (asumiendo su relación con departamentos)
INSERT INTO positions (name, department_id) VALUES
-- Nivel Estratégico
('Director Ejecutivo', 1),
('Auditor Interno', 2),
('Presidente/a', 3),
('Asistente de Presidencia', 3),
('Director General', 4),
('Asistente de Dirección General', 4),
('Jefe de Despacho', 5),
('Analista de Despacho', 5),

-- Nivel Unidades de Apoyo
( 'Consultor Jurídico', 6),
('Abogado Litigante', 6),
('Jefe de Planificación y Presupuesto', 7),
('Analista de Organización', 7),
('Jefe de Administración y Servicios', 8),
('Coordinador de Servicios Generales', 8),
('Jefe de Sistemas y TI', 9),
('Técnico de Soporte de TI', 9),
('Analista Programador', 9),
('Jefe de Recursos Humanos', 10),
('Analista de RRHH', 10),
('Jefe de Comunicaciones', 11),
('Comunicador Social', 11),
('Jefe de Relaciones Internacionales', 12),
('Jefe de Atención Ciudadana', 13),
('Analista de Atención al Ciudadano', 13),

-- Nivel Unidades Sustantivas
('Gerente de Atención Integral', 14),
('Especialista en Prevención de Violencia', 14),
('Gerente de Defensoría', 15),
('Defensor de Derechos', 15),
('Gerente de Desarrollo Regional', 16),
('Gerente de Investigación y Capacitación', 17);

-- Insertar USUARIOS PRIMERO, ya que los equipos y solicitudes dependen de ellos.
INSERT INTO users (full_name, identity_card, email, password_hash, is_active, role_id, position_id, gender_id, department_id, created_at) VALUES

-- ========= USUARIOS INICIALES DE MUESTRA (IDs 1-4) =========
('Samuel Admin', 11111111, 'samuel.admin@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 1, 6, 1, 4, '2025-08-01T10:00:00Z'),
('Samuel Coordinador', 11111112, 'samuel.coordinador@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', false, 2, 5, 2, 4, '2025-08-02T11:00:00Z'),
('Samuel Tecnico', 11111113, 'samuel.tecnico@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 3, 16, 1, 9, '2025-08-03T09:00:00Z'),
('Samuel Usuario', 11111114, 'samuel.usuario@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 19, 2, 10, '2025-08-04T12:00:00Z'),

-- ========= PERFILES DE FRANLLELYS (IDs 5-8) =========
('Franllelys Admin', 21111111, 'franllelys.admin@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 1, 4, 2, 3, '2025-08-05T08:30:00Z'),
('Franllelys Coordinador', 21111112, 'franllelys.coordinador@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 2, 13, 2, 8, '2025-09-01T09:00:00Z'),
('Franllelys Tecnico', 21111113, 'franllelys.tecnico@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 3, 16, 2, 9, '2025-09-01T09:00:00Z'),
('Franllelys Usuario', 21111114, 'franllelys.usuario@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 19, 2, 10, '2025-09-01T09:00:00Z'),

-- ========= PERFILES DE ISAAC (IDs 9-12) =========
('Isaac Admin', 31111111, 'isaac.admin@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 1, 1, 1, 1, '2025-09-02T10:00:00Z'),
('Isaac Coordinador', 31111112, 'isaac.coordinador@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 2, 11, 1, 7, '2025-09-02T10:00:00Z'),
('Isaac Tecnico', 31111113, 'isaac.tecnico@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 3, 16, 1, 9, '2025-09-02T10:00:00Z'),
('Isaac Usuario', 31111114, 'isaac.usuario@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 21, 1, 11, '2025-09-02T10:00:00Z'),

-- ========= PERFILES DE ANTHONY (IDs 13-16) =========
('Anthony Admin', 27451286, 'anthony.admin@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 1, 3, 1, 3, '2025-08-01T10:00:00Z'),
('Anthony Coordinador', 27451287, 'anthony.coordinador@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 2, 15, 1, 9, '2025-09-03T11:00:00Z'),
('Anthony Tecnico', 27451288, 'anthony.tecnico@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 3, 16, 1, 9, '2025-09-03T11:00:00Z'),
('Anthony Usuario', 27451289, 'anthony.usuario@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 22, 1, 12, '2025-09-03T11:00:00Z'),

-- ========= TÉCNICOS ADICIONALES PARA LA OFICINA DE SISTEMAS (IDs 17-20) =========
('Carlos Pérez', 18123456, 'carlos.perez.ti@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 3, 16, 1, 9, '2025-09-04T08:00:00Z'),
('Ana Martínez', 19789012, 'ana.martinez.ti@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 3, 16, 2, 9, '2025-09-04T08:00:00Z'),
('Luis Rodriguez', 20345678, 'luis.rodriguez.ti@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 3, 17, 1, 9, '2025-09-04T08:00:00Z'),
('Sofía Gómez', 22901234, 'sofia.gomez.ti@gmail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 3, 17, 2, 9, '2025-09-04T08:00:00Z'),

-- ========= USUARIOS GENERALES (2 POR CADA UNO DE LOS 16 DEPTOS RESTANTES) (IDs 21-52) =========
('Usuario Depto 1-A', 10000001, 'usuario.depto1.a@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 1, 1, 1, '2025-09-05T09:00:00Z'),
('Usuario Depto 1-B', 10000002, 'usuario.depto1.b@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 1, 2, 1, '2025-09-05T09:00:00Z'),
('Usuario Depto 2-A', 10000003, 'usuario.depto2.a@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 2, 1, 2, '2025-09-05T09:00:00Z'),
('Usuario Depto 2-B', 10000004, 'usuario.depto2.b@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 2, 2, 2, '2025-09-05T09:00:00Z'),
('Usuario Depto 3-A', 10000005, 'usuario.depto3.a@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 4, 1, 3, '2025-09-05T09:00:00Z'),
('Usuario Depto 3-B', 10000006, 'usuario.depto3.b@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 4, 2, 3, '2025-09-05T09:00:00Z'),
('Usuario Depto 4-A', 10000007, 'usuario.depto4.a@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 6, 1, 4, '2025-09-05T09:00:00Z'),
('Usuario Depto 4-B', 10000008, 'usuario.depto4.b@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 6, 2, 4, '2025-09-05T09:00:00Z'),
('Usuario Depto 5-A', 10000009, 'usuario.depto5.a@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 8, 1, 5, '2025-09-05T09:00:00Z'),
('Usuario Depto 5-B', 10000010, 'usuario.depto5.b@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 8, 2, 5, '2025-09-05T09:00:00Z'),
('Usuario Depto 6-A', 10000011, 'usuario.depto6.a@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 10, 1, 6, '2025-09-05T09:00:00Z'),
('Usuario Depto 6-B', 10000012, 'usuario.depto6.b@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 10, 2, 6, '2025-09-05T09:00:00Z'),
('Usuario Depto 7-A', 10000013, 'usuario.depto7.a@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 12, 1, 7, '2025-09-05T09:00:00Z'),
('Usuario Depto 7-B', 10000014, 'usuario.depto7.b@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 12, 2, 7, '2025-09-05T09:00:00Z'),
('Usuario Depto 8-A', 10000015, 'usuario.depto8.a@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 14, 1, 8, '2025-09-05T09:00:00Z'),
('Usuario Depto 8-B', 10000016, 'usuario.depto8.b@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 14, 2, 8, '2025-09-05T09:00:00Z'),
('Usuario Depto 10-A', 10000017, 'usuario.depto10.a@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 19, 1, 10, '2025-09-05T09:00:00Z'),
('Usuario Depto 10-B', 10000018, 'usuario.depto10.b@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 19, 2, 10, '2025-09-05T09:00:00Z'),
('Usuario Depto 11-A', 10000019, 'usuario.depto11.a@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 21, 1, 11, '2025-09-05T09:00:00Z'),
('Usuario Depto 11-B', 10000020, 'usuario.depto11.b@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 21, 2, 11, '2025-09-05T09:00:00Z'),
('Usuario Depto 12-A', 10000021, 'usuario.depto12.a@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 22, 1, 12, '2025-09-05T09:00:00Z'),
('Usuario Depto 12-B', 10000022, 'usuario.depto12.b@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 22, 2, 12, '2025-09-05T09:00:00Z'),
('Usuario Depto 13-A', 10000023, 'usuario.depto13.a@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 24, 1, 13, '2025-09-05T09:00:00Z'),
('Usuario Depto 13-B', 10000024, 'usuario.depto13.b@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 24, 2, 13, '2025-09-05T09:00:00Z'),
('Usuario Depto 14-A', 10000025, 'usuario.depto14.a@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 26, 1, 14, '2025-09-05T09:00:00Z'),
('Usuario Depto 14-B', 10000026, 'usuario.depto14.b@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 26, 2, 14, '2025-09-05T09:00:00Z'),
('Usuario Depto 15-A', 10000027, 'usuario.depto15.a@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 28, 1, 15, '2025-09-05T09:00:00Z'),
('Usuario Depto 15-B', 10000028, 'usuario.depto15.b@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 28, 2, 15, '2025-09-05T09:00:00Z'),
('Usuario Depto 16-A', 10000029, 'usuario.depto16.a@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 29, 1, 16, '2025-09-05T09:00:00Z'),
('Usuario Depto 16-B', 10000030, 'usuario.depto16.b@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 29, 2, 16, '2025-09-05T09:00:00Z'),
('Usuario Depto 17-A', 10000031, 'usuario.depto17.a@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 30, 1, 17, '2025-09-05T09:00:00Z'),
('Usuario Depto 17-B', 10000032, 'usuario.depto17.b@mail.com','$2a$12$zsg/NmEsaTarWsfTm7ar3expazqfZdf8alFMV/JbpmbcorxiyxvBi', true, 4, 30, 2, 17, '2025-09-05T09:00:00Z');

-- Insertar EQUIPOS DE COMPUTACIÓN después de los usuarios.
INSERT INTO computer_equipment (asset_number, serial_number, model, location, hardware_specs, software_specs, assigned_user_id, type_id, brand_id, status_id) VALUES
('100101', 'DL001234', 'OptiPlex 7090', 'Oficina 101 - IT', '{"cpu": "Intel Core i7-10700", "ram": "16GB DDR4", "storage": "512GB SSD", "gpu": "Intel UHD Graphics 630", "network": "Ethernet, Wi-Fi"}', '{"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "Windows Defender"}', 1, 2, 2, 1),
('100102', 'HP002345', 'ProDesk 400 G9', 'Oficina 102 - Support', '{"cpu": "Intel Core i5-11500", "ram": "8GB DDR4", "storage": "256GB SSD", "gpu": "Intel UHD Graphics 750", "network": "Ethernet, Wi-Fi"}', '{"os": "Windows 11 Pro", "office": "Microsoft Office 2021", "antivirus": "McAfee"}', 2, 2, 1, 2),
('100103', 'LN003456', 'ThinkStation P340', 'Oficina 103 - IT', '{"cpu": "Intel Xeon W-1250", "ram": "32GB DDR4", "storage": "1TB SSD", "gpu": "NVIDIA Quadro P620", "network": "Ethernet"}', '{"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "ESET NOD32"}', 3, 2, 3, 1),
('100104', 'AC005678', 'Aspire TC-895', 'Oficina 104 - Accounting', '{"cpu": "Intel Core i3-10100", "ram": "8GB DDR4", "storage": "1TB HDD", "gpu": "Intel UHD Graphics 630", "network": "Ethernet"}', '{"os": "Windows 10 Home", "office": "LibreOffice", "antivirus": "Avast"}', 4, 2, 5, 4),
('100105', 'AS006789', 'VivoPC VM65N', 'Oficina 105 - Support', '{"cpu": "Intel Core i5-8250U", "ram": "8GB DDR4", "storage": "512GB SSD", "gpu": "NVIDIA GeForce 930MX", "network": "Ethernet, Wi-Fi"}', '{"os": "Windows 11 Home", "office": "Microsoft Office 365", "antivirus": "Kaspersky"}', 5, 2, 6, 1),
('100106', 'MS008901', 'Cubi 5 10M', 'Oficina 106 - HR', '{"cpu": "Intel Core i5-10210U", "ram": "16GB DDR4", "storage": "256GB SSD", "gpu": "Intel UHD Graphics", "network": "Ethernet, Wi-Fi"}', '{"os": "Windows 10 Pro", "office": "Microsoft Office 2016", "antivirus": "Bitdefender"}', 6, 2, 7, 3),
('100201', 'HP-LAP-001', 'EliteBook 840 G7', 'Oficina 201 - Dirección', '{"cpu": "Intel Core i5-10310U", "ram": "16GB DDR4", "storage": "512GB SSD", "gpu": "Intel UHD Graphics", "network": "Wi-Fi, Bluetooth"}', '{"os": "Windows 11 Pro", "office": "Microsoft Office 365", "antivirus": "Windows Defender"}', 7, 1, 1, 1),
('100202', 'DL-LAP-002', 'XPS 13 9310', 'Oficina 202 - Ventas', '{"cpu": "Intel Core i7-1165G7", "ram": "16GB LPDDR4x", "storage": "1TB SSD", "gpu": "Intel Iris Xe", "network": "Wi-Fi, Bluetooth"}', '{"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "McAfee"}', 8, 1, 2, 2);

-- Insertar SOLICITUDES al final, ya que dependen de los usuarios y los equipos.
INSERT INTO requests (description, request_date, requester_id, comments_technician, beneficiary_id, technician_id, computer_equipment_id, type_id, status_id, priority_id) VALUES
('El equipo presenta pantalla azul constante y se reinicia automáticamente. Necesita revisión urgente.', '2025-08-01T09:30:00Z', 1, NUll, 1, NULL, 1, 4, 1, 3),
('Solicitud de mantenimiento preventivo mensual. Limpieza de hardware y actualización de software.', '2025-08-02T14:15:00Z', 2, NUll, 2, NULL, 2, 1, 1, 3),
('Instalación de nuevo software de diseño gráfico para el equipo de marketing.', '2025-08-03T10:45:00Z', 1, NUll, 6, NULL, 3, 6, 1, 3),
('Actualización del sistema operativo cancelada por incompatibilidad de hardware.', '2025-08-04T08:20:00Z', 3, NUll, 3, NULL, 4, 8, 1, 3),
('Problema con conectividad de red. El equipo no puede acceder a recursos compartidos.', '2025-08-05T16:30:00Z', 2, NUll, 5, NULL, 5, 9, 1, 3),
('Limpieza de virus y malware detectado por el antivirus corporativo.', '2025-08-06T11:00:00Z', 4, NUll, 4, NULL, 6, 4, 1, 3);
-------------------------------------------Fin del segundo-----------------------------