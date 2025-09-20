import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();


// Middlewares globales aquí
app.use(cors({
	origin: 'http://localhost:3000', // Cambia esto por la URL de tu frontend
	credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Rutas

// Importar rutas de autenticación
import authRoutes from './api/routes/auth.routes';
app.use('/api/auth', authRoutes);

// Importar rutas de usuarios
import userRoutes from './api/routes/user.routes';
app.use('/api/users', userRoutes);

// Importar rutas de catálogos
import catalogRoutes from './api/routes/catalog.routes';
app.use('/api/catalogs', catalogRoutes);

// Importar rutas de solicitudes
import requestRoutes from './api/routes/request.routes';
// ...
app.use('/api/requests', requestRoutes);



// Ruta de prueba
app.get('/', (req, res) => {
	res.send('API funcionando');
});

export default app;
