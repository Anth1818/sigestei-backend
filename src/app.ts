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

app.get('/', (req, res) => {
	res.send('API funcionando');
});

export default app;
