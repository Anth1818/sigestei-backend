import { Router } from 'express';
import { getAllUsers, registerUser} from '../controllers/user.controller';

const router = Router();

// GET /api/users
router.get('/', getAllUsers);

// POST /api/users/register
router.post('/register', registerUser );

export default router;