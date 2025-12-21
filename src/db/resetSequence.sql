SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

SELECT setval('equipment_id_seq', (SELECT MAX(id) FROM equipment));

SELECT setval('requests_id_seq', (SELECT MAX(id) FROM requests));

-- Reiniciar las secuencias de las tablas de catálogo y principales
-- para que los próximos inserts no causen conflictos de clave primaria.
ALTER SEQUENCE roles_id_seq RESTART WITH 1;
ALTER SEQUENCE genders_id_seq RESTART WITH 1;
ALTER SEQUENCE departments_id_seq RESTART WITH 1;
ALTER SEQUENCE positions_id_seq RESTART WITH 1;
ALTER SEQUENCE equipment_types_id_seq RESTART WITH 1;
ALTER SEQUENCE equipment_brands_id_seq RESTART WITH 1;
ALTER SEQUENCE equipment_statuses_id_seq RESTART WITH 1;
ALTER SEQUENCE request_types_id_seq RESTART WITH 1;
ALTER SEQUENCE request_statuses_id_seq RESTART WITH 1;
ALTER SEQUENCE request_priorities_id_seq RESTART WITH 1;
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE requests_id_seq RESTART WITH 1;
ALTER SEQUENCE computer_equipment_id_seq RESTART WITH 1;
