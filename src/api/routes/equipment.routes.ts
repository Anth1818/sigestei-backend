import { Router } from 'express';
import { 
  getAllEquipmentController,
  getEquipmentByIdController,
  getEquipmentByAssetNumberController,
  getEquipmentBySerialNumberController,
  registerEquipmentController,
  updateEquipmentController
} from '../controllers/equipment.controller';
import authMiddleware from '../../middlewares/authMiddleware';
import roleMiddleware from '../../middlewares/roleMiddleware';

const router = Router();
router.use(authMiddleware);

// Obtener todos los equipos de cómputo - requiere autenticación
router.get('/', roleMiddleware(1, 2, 3, 4), getAllEquipmentController);

// Obtener equipo por ID - requiere autenticación
router.get('/:id',roleMiddleware(1, 2, 3, ), getEquipmentByIdController);

// Obtener equipo por número de activo - requiere autenticación
router.get('/asset/:asset_number',roleMiddleware(1, 2, 3, ), getEquipmentByAssetNumberController);

// Obtener equipo por número de serie - requiere autenticación
router.get('/serial/:serial_number',roleMiddleware(1, 2, 3, ), getEquipmentBySerialNumberController);

// Registrar nuevo equipo de cómputo - requiere autenticación
router.post('/register', roleMiddleware(1, 2, 3, ), registerEquipmentController);

// Actualizar equipo de cómputo - requiere autenticación
router.put('/update/:id', roleMiddleware(1, 2, 3, ), updateEquipmentController);

export default router;