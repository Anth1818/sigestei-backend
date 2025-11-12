import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app = express();


// Middlewares globales aquí
const allowedOrigins = process.env.ALLOWED_ORIGINS 
	? process.env.ALLOWED_ORIGINS.split(',') 
	: ['http://localhost:3000'];

app.use(cors({
	origin: (origin, callback) => {
		// Permitir requests sin origin (como Postman, curl, etc.)
		if (!origin) return callback(null, true);
		
		if (allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
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

// Importar rutas del historial de solicitudes
import requestHistoryRoutes from './api/routes/requestHistory.routes';
app.use('/api/request-history', requestHistoryRoutes);

// Importar rutas de equipos de cómputo
import equipmentRoutes from './api/routes/equipment.routes';
app.use('/api/equipment', equipmentRoutes);

// Importar rutas del dashboard
import dashboardRoutes from './api/routes/dashboard.routes';
app.use('/api/dashboard', dashboardRoutes);

// Importar rutas de auditoría
import auditRoutes from './api/routes/audit.routes';
app.use('/api/audit', auditRoutes);



// Ruta de prueba
app.get('/', (req, res) => {
	res.send('API funcionando');
});

// Health check para Railway/render/etc
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Middleware de manejo de errores (debe ir al final)
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
	console.error('Error:', err);
	res.status(500).json({
		message: 'Error interno del servidor',
		error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
	});
});

export default app;
