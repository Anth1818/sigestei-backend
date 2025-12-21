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
router.use(roleMiddleware(1, 2, 3)); // Solo administradores, coordinadores y técnicos

// Obtener todos los equipos de cómputo - requiere autenticación
router.get('/', getAllEquipmentController);

// Obtener equipo por ID - requiere autenticación
router.get('/:id', getEquipmentByIdController);

// Obtener equipo por número de activo - requiere autenticación
router.get('/asset/:asset_number', getEquipmentByAssetNumberController);

// Obtener equipo por número de serie - requiere autenticación
router.get('/serial/:serial_number', getEquipmentBySerialNumberController);

// Registrar nuevo equipo de cómputo - requiere autenticación
router.post('/register', registerEquipmentController);

// Actualizar equipo de cómputo - requiere autenticación
router.put('/update/:id', updateEquipmentController);

export default router;