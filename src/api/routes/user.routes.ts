import { Router } from 'express';
import { getAllUsers} from '../controllers/user.controller';

const router = Router();

// GET /api/users
router.get('/', getAllUsers);

export default router;