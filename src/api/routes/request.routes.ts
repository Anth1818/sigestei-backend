import { Router } from 'express';
import { getAllRequestsController, registerRequestController } from '../controllers/request.controller';
import authMiddleware from '../../middlewares/authMiddleware';
import roleMiddleware from '../../middlewares/roleMiddleware';

const router = Router();
router.use(authMiddleware);
router.use(roleMiddleware(1,2,3,4)); // Todos los roles

router.get('/', getAllRequestsController);

router.post('/register', registerRequestController);

export default router;