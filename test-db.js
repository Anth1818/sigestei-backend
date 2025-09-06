const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error de conexión:', err);
  } else {
    console.log('Conexión exitosa:', res.rows);
  }
  pool.end();
});
