const express = require('express');
const app = express();

// Middlewares globales aquí
// app.use(express.json());

// Rutas

// Importar rutas de autenticación
const authRoutes = require('./api/routes/authRoutes');
app.use('/api/auth', authRoutes);

// Importar rutas de usuarios
const userRoutes = require('./api/routes/userRoutes');
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
	res.send('API funcionando');
});

module.exports = app;
