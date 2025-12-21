import { Router } from 'express';
import { getAllCatalogsController } from '../controllers/catalog.controller';

const router = Router();

// Obtener todos los catálogos - requiere autenticación
// GET /api/catalogs
router.get('/', getAllCatalogsController);

export default router;