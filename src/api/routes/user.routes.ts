import { Router } from 'express';
import { getAllUsers, registerUser} from '../controllers/user.controller';
import authMiddleware from '../../middlewares/authMiddleware';
import roleMiddleware from '../../middlewares/roleMiddleware';

const router = Router();
router.use(authMiddleware);
router.use(roleMiddleware(1)); // Solo administradores

// GET /api/users
router.get('/', getAllUsers);

// POST /api/users/register
router.post('/register', registerUser );

export default router;