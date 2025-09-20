SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));

SELECT setval('equipment_id_seq', (SELECT MAX(id) FROM equipment));

SELECT setval('requests_id_seq', (SELECT MAX(id) FROM requests));