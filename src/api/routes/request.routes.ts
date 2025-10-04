import { Router } from 'express';
import { getAllRequestsController, registerRequestController,  updateRequestController } from '../controllers/request.controller';
import authMiddleware from '../../middlewares/authMiddleware';
import roleMiddleware from '../../middlewares/roleMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', roleMiddleware(1,2,3,4),  getAllRequestsController);

router.post('/register',roleMiddleware(1,2,3,4), registerRequestController);

router.put('/updateRequest/:id', roleMiddleware(1,2,3), updateRequestController);

export default router;