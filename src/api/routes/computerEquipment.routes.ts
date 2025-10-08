import { Router } from 'express';
import { 
  getAllComputerEquipmentController,
  getComputerEquipmentByIdController,
  getComputerEquipmentByAssetNumberController,
  getComputerEquipmentBySerialNumberController,
  registerComputerEquipmentController,
  updateComputerEquipmentController
} from '../controllers/computerEquipment.controller';
import authMiddleware from '../../middlewares/authMiddleware';
import roleMiddleware from '../../middlewares/roleMiddleware';

const router = Router();
router.use(authMiddleware);
router.use(roleMiddleware(1, 2, 3)); // Solo administradores, coordinadores y técnicos

// Obtener todos los equipos de cómputo - requiere autenticación
router.get('/', getAllComputerEquipmentController);

// Obtener equipo por ID - requiere autenticación
router.get('/id/:id', getComputerEquipmentByIdController);

// Obtener equipo por número de activo - requiere autenticación
router.get('/asset/:asset_number', getComputerEquipmentByAssetNumberController);

// Obtener equipo por número de serie - requiere autenticación
router.get('/serial/:serial_number', getComputerEquipmentBySerialNumberController);

// Registrar nuevo equipo de cómputo - requiere autenticación
router.post('/register', registerComputerEquipmentController);

// Actualizar equipo de cómputo - requiere autenticación
router.put('/update/:id', updateComputerEquipmentController);

export default router;