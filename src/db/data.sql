-- ========= INSERTAR DATOS EN TABLAS DE CATÁLOGO =========
--------------------------------Primero-------------------------------------
-- Ejecutar este bloque primero

-- Insertar Roles
INSERT INTO roles (name) VALUES
('Administrador'),
('Coordinador'),
('Técnico'),
('Usuario');

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
('PC'),
('Impresora');

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
('Defectuoso'),
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
('Completada'),
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

-- Insertar equipos después de los usuarios.
INSERT INTO equipment (asset_number, serial_number, model, location, specifications, assigned_user_id, type_id, brand_id, status_id, department_id) VALUES
('100101', 'DL001234', 'OptiPlex 7090', 'Oficina 101 - IT', '{"hardware": {"cpu": "Intel Core i7-10700", "ram": "16GB DDR4", "storage": "512GB SSD", "gpu": "Intel UHD Graphics 630", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "Windows Defender"}}', 1, 2, 2, 1, NULL),
('100102', 'HP002345', 'ProDesk 400 G9', 'Oficina 102 - Support', '{"hardware": {"cpu": "Intel Core i5-11500", "ram": "8GB DDR4", "storage": "256GB SSD", "gpu": "Intel UHD Graphics 750", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 11 Pro", "office": "Microsoft Office 2021", "antivirus": "McAfee"}}', 2, 2, 1, 2, NULL),
('100103', 'LN003456', 'ThinkStation P340', 'Oficina 103 - IT', '{"hardware": {"cpu": "Intel Xeon W-1250", "ram": "32GB DDR4", "storage": "1TB SSD", "gpu": "NVIDIA Quadro P620", "network": "Ethernet"}, "software": {"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "ESET NOD32"}}', 3, 2, 3, 1, NULL),
('100104', 'AC005678', 'Aspire TC-895', 'Oficina 104 - Accounting', '{"hardware": {"cpu": "Intel Core i3-10100", "ram": "8GB DDR4", "storage": "1TB HDD", "gpu": "Intel UHD Graphics 630", "network": "Ethernet"}, "software": {"os": "Windows 10 Home", "office": "LibreOffice", "antivirus": "Avast"}}', 4, 2, 5, 4, NULL),
('100105', 'AS006789', 'VivoPC VM65N', 'Oficina 105 - Support', '{"hardware": {"cpu": "Intel Core i5-8250U", "ram": "8GB DDR4", "storage": "512GB SSD", "gpu": "NVIDIA GeForce 930MX", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 11 Home", "office": "Microsoft Office 365", "antivirus": "Kaspersky"}}', 5, 2, 6, 1, NULL),
('100106', 'MS008901', 'Cubi 5 10M', 'Oficina 106 - HR', '{"hardware": {"cpu": "Intel Core i5-10210U", "ram": "16GB DDR4", "storage": "256GB SSD", "gpu": "Intel UHD Graphics", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 10 Pro", "office": "Microsoft Office 2016", "antivirus": "Bitdefender"}}', 6, 2, 7, 3, NULL),
('100201', 'HP-LAP-001', 'EliteBook 840 G7', 'Oficina 201 - Dirección', '{"hardware": {"cpu": "Intel Core i5-10310U", "ram": "16GB DDR4", "storage": "512GB SSD", "gpu": "Intel UHD Graphics", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 11 Pro", "office": "Microsoft Office 365", "antivirus": "Windows Defender"}}', 7, 1, 1, 1, NULL),
('100202', 'DL-LAP-002', 'XPS 13 9310', 'Oficina 202 - Ventas', '{"hardware": {"cpu": "Intel Core i7-1165G7", "ram": "16GB LPDDR4x", "storage": "1TB SSD", "gpu": "Intel Iris Xe", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "McAfee"}}', 8, 1, 2, 2, NULL),
('100203', 'LN-LAP-003', 'ThinkPad X1 Carbon', 'Oficina 203', '{"hardware": {"cpu": "Intel Core i7-1185G7", "ram": "16GB LPDDR4x", "storage": "512GB SSD", "gpu": "Intel Iris Xe", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "Norton"}}', 9, 1, 3, 1, NULL),
('100204', 'HP-PC-004', 'ProDesk 600 G6', 'Oficina 204', '{"hardware": {"cpu": "Intel Core i5-10500", "ram": "8GB DDR4", "storage": "256GB SSD", "gpu": "Intel UHD Graphics 630", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 11 Pro", "office": "Microsoft Office 2021", "antivirus": "Windows Defender"}}', 10, 2, 1, 1, NULL),
('100205', 'DL-PC-005', 'OptiPlex 3080', 'Oficina 205', '{"hardware": {"cpu": "Intel Core i3-10105", "ram": "8GB DDR4", "storage": "1TB HDD", "gpu": "Intel UHD Graphics 630", "network": "Ethernet"}, "software": {"os": "Windows 10 Pro", "office": "LibreOffice", "antivirus": "Avast"}}', 11, 2, 2, 1, NULL),
('100206', 'LN-PC-006', 'ThinkCentre M720', 'Oficina 206', '{"hardware": {"cpu": "Intel Core i5-9400", "ram": "8GB DDR4", "storage": "512GB SSD", "gpu": "Intel UHD Graphics 630", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "ESET NOD32"}}', 12, 2, 3, 1, NULL),
('100207', 'AP-LAP-007', 'MacBook Air M1', 'Oficina 207', '{"hardware": {"cpu": "Apple M1", "ram": "8GB Unified", "storage": "256GB SSD", "gpu": "Apple M1 GPU", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "macOS Monterey", "office": "Microsoft Office 365", "antivirus": "N/A"}}', 13, 1, 4, 1, NULL),
('100208', 'AC-PC-008', 'Aspire TC-885', 'Oficina 208', '{"hardware": {"cpu": "Intel Core i5-9400", "ram": "12GB DDR4", "storage": "1TB HDD", "gpu": "Intel UHD Graphics 630", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 10 Home", "office": "WPS Office", "antivirus": "Kaspersky"}}', 14, 2, 5, 1, NULL),
('100209', 'AS-LAP-009', 'VivoBook 15', 'Oficina 209', '{"hardware": {"cpu": "Intel Core i5-1135G7", "ram": "8GB DDR4", "storage": "512GB SSD", "gpu": "Intel Iris Xe", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 11 Home", "office": "Microsoft Office 365", "antivirus": "Windows Defender"}}', 15, 1, 6, 1, NULL),
('100210', 'MS-PC-010', 'Trident 3', 'Oficina 210', '{"hardware": {"cpu": "Intel Core i7-9700F", "ram": "16GB DDR4", "storage": "512GB SSD + 1TB HDD", "gpu": "NVIDIA GTX 1660", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "McAfee"}}', 16, 2, 7, 1, NULL),
('100211', 'HP-LAP-011', 'ProBook 450 G8', 'Oficina 211', '{"hardware": {"cpu": "Intel Core i5-1135G7", "ram": "8GB DDR4", "storage": "256GB SSD", "gpu": "Intel Iris Xe", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "Norton"}}', 17, 1, 1, 1, NULL),
('100212', 'DL-LAP-012', 'Latitude 5420', 'Oficina 212', '{"hardware": {"cpu": "Intel Core i5-1145G7", "ram": "16GB DDR4", "storage": "512GB SSD", "gpu": "Intel Iris Xe", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 11 Pro", "office": "Microsoft Office 2021", "antivirus": "Windows Defender"}}', 18, 1, 2, 1, NULL),
('100213', 'LN-PC-013', 'IdeaCentre 3', 'Oficina 213', '{"hardware": {"cpu": "AMD Ryzen 5 3600", "ram": "8GB DDR4", "storage": "1TB HDD", "gpu": "AMD Radeon Graphics", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 10 Home", "office": "LibreOffice", "antivirus": "Avast"}}', 19, 2, 3, 1, NULL),
('100214', 'HP-PC-014', 'EliteDesk 800 G6', 'Oficina 214', '{"hardware": {"cpu": "Intel Core i7-10700", "ram": "16GB DDR4", "storage": "512GB SSD", "gpu": "Intel UHD Graphics 630", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "ESET NOD32"}}', 20, 2, 1, 1, NULL),
('100215', 'DL-PC-015', 'Vostro 3681', 'Oficina 215', '{"hardware": {"cpu": "Intel Core i3-10100", "ram": "4GB DDR4", "storage": "1TB HDD", "gpu": "Intel UHD Graphics 630", "network": "Ethernet"}, "software": {"os": "Windows 10 Home", "office": "WPS Office", "antivirus": "Windows Defender"}}', 21, 2, 2, 1, NULL),
('100216', 'LN-LAP-016', 'ThinkPad E15', 'Oficina 216', '{"hardware": {"cpu": "AMD Ryzen 7 4700U", "ram": "16GB DDR4", "storage": "512GB SSD", "gpu": "AMD Radeon Graphics", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "Kaspersky"}}', 22, 1, 3, 1, NULL),
('100217', 'AC-LAP-017', 'Swift 3', 'Oficina 217', '{"hardware": {"cpu": "Intel Core i5-1135G7", "ram": "8GB DDR4", "storage": "512GB SSD", "gpu": "Intel Iris Xe", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 11 Home", "office": "Microsoft Office 365", "antivirus": "McAfee"}}', 23, 1, 5, 1, NULL),
('100218', 'AS-PC-018', 'ROG Strix', 'Oficina 218', '{"hardware": {"cpu": "AMD Ryzen 9 5900X", "ram": "32GB DDR4", "storage": "1TB SSD", "gpu": "NVIDIA RTX 3070", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 11 Pro", "office": "Microsoft Office 2021", "antivirus": "Windows Defender"}}', 24, 2, 6, 1, NULL),
('100219', 'MS-LAP-019', 'Prestige 14', 'Oficina 219', '{"hardware": {"cpu": "Intel Core i7-1185G7", "ram": "16GB LPDDR4x", "storage": "512GB SSD", "gpu": "Intel Iris Xe", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "Norton"}}', 25, 1, 7, 1, NULL),
('100220', 'HP-PC-020', 'Pavilion Desktop', 'Oficina 220', '{"hardware": {"cpu": "Intel Core i5-10400", "ram": "8GB DDR4", "storage": "1TB HDD", "gpu": "Intel UHD Graphics 630", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 10 Home", "office": "LibreOffice", "antivirus": "Avast"}}', 26, 2, 1, 1, NULL),
('100221', 'DL-LAP-021', 'Inspiron 15 3000', 'Oficina 221', '{"hardware": {"cpu": "Intel Core i3-1115G4", "ram": "4GB DDR4", "storage": "128GB SSD", "gpu": "Intel UHD Graphics", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 11 Home", "office": "Microsoft Office 365", "antivirus": "Windows Defender"}}', 27, 1, 2, 1, NULL),
('100222', 'LN-PC-022', 'Legion Tower 5', 'Oficina 222', '{"hardware": {"cpu": "AMD Ryzen 7 5700G", "ram": "16GB DDR4", "storage": "512GB SSD + 1TB HDD", "gpu": "NVIDIA RTX 3060", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 11 Pro", "office": "Microsoft Office 2021", "antivirus": "ESET NOD32"}}', 28, 2, 3, 1, NULL),
('100223', 'AP-LAP-023', 'MacBook Pro M1', 'Oficina 223', '{"hardware": {"cpu": "Apple M1 Pro", "ram": "16GB Unified", "storage": "512GB SSD", "gpu": "Apple M1 Pro GPU", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "macOS Monterey", "office": "Microsoft Office 365", "antivirus": "N/A"}}', 29, 1, 4, 1, NULL),
('100224', 'AC-PC-024', 'Nitro 50', 'Oficina 224', '{"hardware": {"cpu": "Intel Core i5-11400F", "ram": "8GB DDR4", "storage": "512GB SSD", "gpu": "NVIDIA GTX 1650", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 10 Home", "office": "WPS Office", "antivirus": "Kaspersky"}}', 30, 2, 5, 1, NULL),
('100225', 'AS-LAP-025', 'ZenBook 14', 'Oficina 225', '{"hardware": {"cpu": "Intel Core i7-1165G7", "ram": "16GB LPDDR4x", "storage": "512GB SSD", "gpu": "Intel Iris Xe", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 11 Pro", "office": "Microsoft Office 2021", "antivirus": "McAfee"}}', 31, 1, 6, 1, NULL),
('100226', 'MS-PC-026', 'Creator Z16', 'Oficina 226', '{"hardware": {"cpu": "Intel Core i9-11900H", "ram": "32GB DDR4", "storage": "1TB SSD", "gpu": "NVIDIA RTX 3060", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 11 Pro", "office": "Microsoft Office 2021", "antivirus": "Windows Defender"}}', 32, 2, 7, 1, NULL),
('100227', 'HP-LAP-027', 'Envy 13', 'Oficina 227', '{"hardware": {"cpu": "Intel Core i5-1135G7", "ram": "8GB DDR4", "storage": "256GB SSD", "gpu": "Intel Iris Xe", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 10 Home", "office": "Microsoft Office 365", "antivirus": "Norton"}}', 33, 1, 1, 1, NULL),
('100228', 'DL-PC-028', 'OptiPlex 5090', 'Oficina 228', '{"hardware": {"cpu": "Intel Core i5-11500", "ram": "16GB DDR4", "storage": "512GB SSD", "gpu": "Intel UHD Graphics 750", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 11 Pro", "office": "Microsoft Office 2021", "antivirus": "Windows Defender"}}', 34, 2, 2, 1, NULL),
('100229', 'LN-LAP-029', 'IdeaPad 5', 'Oficina 229', '{"hardware": {"cpu": "AMD Ryzen 5 5500U", "ram": "8GB DDR4", "storage": "512GB SSD", "gpu": "AMD Radeon Graphics", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 11 Home", "office": "LibreOffice", "antivirus": "Avast"}}', 35, 1, 3, 1, NULL),
('100230', 'HP-PC-030', 'Z2 Tower G9', 'Oficina 230', '{"hardware": {"cpu": "Intel Xeon W-1390", "ram": "32GB DDR4", "storage": "1TB SSD", "gpu": "NVIDIA Quadro P2200", "network": "Ethernet"}, "software": {"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "ESET NOD32"}}', 36, 2, 1, 1, NULL),
('100231', 'DL-LAP-031', 'XPS 15 9510', 'Oficina 231', '{"hardware": {"cpu": "Intel Core i7-11800H", "ram": "16GB DDR4", "storage": "512GB SSD", "gpu": "NVIDIA GTX 3050 Ti", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 11 Pro", "office": "Microsoft Office 2021", "antivirus": "Kaspersky"}}', 37, 1, 2, 1, NULL),
('100232', 'LN-PC-032', 'ThinkStation P620', 'Oficina 232', '{"hardware": {"cpu": "AMD Ryzen Threadripper PRO 3955WX", "ram": "64GB DDR4", "storage": "2TB SSD", "gpu": "NVIDIA RTX A4000", "network": "Ethernet"}, "software": {"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "McAfee"}}', 38, 2, 3, 1, NULL),
('100233', 'AC-LAP-033', 'TravelMate P2', 'Oficina 233', '{"hardware": {"cpu": "Intel Core i3-1115G4", "ram": "4GB DDR4", "storage": "256GB SSD", "gpu": "Intel UHD Graphics", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 10 Home", "office": "WPS Office", "antivirus": "Windows Defender"}}', 39, 1, 5, 1, NULL),
('100234', 'AS-PC-034', 'Mini PC PN51', 'Oficina 234', '{"hardware": {"cpu": "AMD Ryzen 7 5700U", "ram": "16GB DDR4", "storage": "512GB SSD", "gpu": "AMD Radeon Graphics", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 11 Pro", "office": "Microsoft Office 2021", "antivirus": "Norton"}}', 40, 2, 6, 1, NULL),
('100235', 'MS-LAP-035', 'Modern 14', 'Oficina 235', '{"hardware": {"cpu": "Intel Core i5-1155G7", "ram": "8GB DDR4", "storage": "512GB SSD", "gpu": "Intel Iris Xe", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 11 Home", "office": "Microsoft Office 365", "antivirus": "Avast"}}', 41, 1, 7, 1, NULL),
('100236', 'HP-PC-036', 'Omen 25L', 'Oficina 236', '{"hardware": {"cpu": "Intel Core i7-11700K", "ram": "16GB DDR4", "storage": "1TB SSD", "gpu": "NVIDIA RTX 3070", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 11 Pro", "office": "Microsoft Office 2021", "antivirus": "ESET NOD32"}}', 42, 2, 1, 1, NULL),
('100237', 'DL-LAP-037', 'Precision 5560', 'Oficina 237', '{"hardware": {"cpu": "Intel Core i7-11850H", "ram": "32GB DDR4", "storage": "1TB SSD", "gpu": "NVIDIA RTX A2000", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "Kaspersky"}}', 43, 1, 2, 1, NULL),
('100238', 'LN-PC-038', 'ThinkCentre M90a', 'Oficina 238', '{"hardware": {"cpu": "Intel Core i5-10500", "ram": "8GB DDR4", "storage": "256GB SSD", "gpu": "Intel UHD Graphics 630", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 10 Pro", "office": "LibreOffice", "antivirus": "McAfee"}}', 44, 2, 3, 1, NULL),
('100239', 'AP-LAP-039', 'iMac 24" M1', 'Oficina 239', '{"hardware": {"cpu": "Apple M1", "ram": "8GB Unified", "storage": "256GB SSD", "gpu": "Apple M1 GPU", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "macOS Monterey", "office": "Microsoft Office 365", "antivirus": "N/A"}}', 45, 2, 4, 1, NULL),
('100240', 'AC-PC-040', 'Predator Orion 3000', 'Oficina 240', '{"hardware": {"cpu": "Intel Core i7-11700F", "ram": "16GB DDR4", "storage": "512GB SSD + 1TB HDD", "gpu": "NVIDIA RTX 3060 Ti", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 11 Home", "office": "WPS Office", "antivirus": "Windows Defender"}}', 46, 2, 5, 1, NULL),
('100241', 'AS-LAP-041', 'TUF Gaming A15', 'Oficina 241', '{"hardware": {"cpu": "AMD Ryzen 7 5800H", "ram": "16GB DDR4", "storage": "512GB SSD", "gpu": "NVIDIA RTX 3060", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 11 Home", "office": "Microsoft Office 365", "antivirus": "Norton"}}', 47, 1, 6, 1, NULL),
('100242', 'MS-PC-042', 'MEG Aegis Ti5', 'Oficina 242', '{"hardware": {"cpu": "Intel Core i9-11900K", "ram": "64GB DDR4", "storage": "2TB SSD", "gpu": "NVIDIA RTX 3090", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 11 Pro", "office": "Microsoft Office 2021", "antivirus": "ESET NOD32"}}', 48, 2, 7, 1, NULL),
('100243', 'HP-LAP-043', 'Spectre x360', 'Oficina 243', '{"hardware": {"cpu": "Intel Core i7-1165G7", "ram": "16GB LPDDR4x", "storage": "1TB SSD", "gpu": "Intel Iris Xe", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 11 Pro", "office": "Microsoft Office 2021", "antivirus": "Kaspersky"}}', 49, 1, 1, 1, NULL),
('100244', 'DL-PC-044', 'Alienware Aurora R13', 'Oficina 244', '{"hardware": {"cpu": "Intel Core i9-12900KF", "ram": "32GB DDR5", "storage": "1TB SSD", "gpu": "NVIDIA RTX 3080", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 11 Pro", "office": "Microsoft Office 2021", "antivirus": "McAfee"}}', 50, 2, 2, 1, NULL),
('100245', 'LN-LAP-045', 'ThinkBook 15', 'Oficina 245', '{"hardware": {"cpu": "Intel Core i5-1135G7", "ram": "8GB DDR4", "storage": "256GB SSD", "gpu": "Intel Iris Xe", "network": "Wi-Fi, Bluetooth"}, "software": {"os": "Windows 10 Home", "office": "LibreOffice", "antivirus": "Avast"}}', 51, 1, 3, 1, NULL),
('100246', 'HP-PC-046', 'ProDesk 405 G8', 'Oficina 246', '{"hardware": {"cpu": "AMD Ryzen 5 PRO 4650G", "ram": "8GB DDR4", "storage": "256GB SSD", "gpu": "AMD Radeon Graphics", "network": "Ethernet, Wi-Fi"}, "software": {"os": "Windows 10 Pro", "office": "Microsoft Office 2019", "antivirus": "Windows Defender"}}', 52, 2, 1, 1, NULL);

-- Insertar SOLICITUDES al final, ya que dependen de los usuarios y los equipos.
INSERT INTO requests (description, request_date, requester_id, comments_technician, beneficiary_id, technician_id, equipment_id, type_equipment_id, type_id, status_id, priority_id) VALUES
('El equipo presenta pantalla azul constante y se reinicia automáticamente. Necesita revisión urgente.', '2025-08-01T09:30:00Z', 1, NULL, 1, NULL, 1, 2, 4, 1, 3),
('Solicitud de mantenimiento preventivo mensual. Limpieza de hardware y actualización de software.', '2025-08-02T14:15:00Z', 2, NULL, 2, NULL, 2, 2, 1, 1, 3),
('Instalación de nuevo software de diseño gráfico para el equipo de marketing.', '2025-08-03T10:45:00Z', 1, NULL, 6, NULL, 3, 2, 6, 1, 3),
('Actualización del sistema operativo cancelada por incompatibilidad de hardware.', '2025-08-04T08:20:00Z', 3, NULL, 3, NULL, 4, 2, 8, 1, 3),
('Problema con conectividad de red. El equipo no puede acceder a recursos compartidos.', '2025-08-05T16:30:00Z', 2, NULL, 5, NULL, 5, 2, 9, 1, 3),
('Limpieza de virus y malware detectado por el antivirus corporativo.', '2025-08-06T11:00:00Z', 4, NULL, 4, NULL, 6, 2, 4, 1, 3);
-------------------------------------------Fin del segundo-----------------------------