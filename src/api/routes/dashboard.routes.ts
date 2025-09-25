import { Router } from 'express';
import { getDashboardMetricsController } from '../controllers/dashboard.controller';
import authMiddleware from '../../middlewares/authMiddleware';

const router = Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// GET /api/dashboard/metrics - Obtener métricas del dashboard
router.get('/metrics', getDashboardMetricsController);

export default router;