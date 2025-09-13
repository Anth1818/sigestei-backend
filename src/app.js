const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const cors = require('cors');

// Middlewares globales aquí
app.use(cors({
	origin: 'http://localhost:3000', // Cambia esto por la URL de tu frontend
	credentials: true
}));
app.use(express.json());
app.use(cookieParser());

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
