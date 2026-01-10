import { Router } from 'express';
import { 
  getAllRequestsByUserIdController, 
  getAllRequestsController, 
  getAllRequestsForTechnicianController, 
  registerRequestController,  
  updateRequestController,
  getRequestsPaginatedController,
  getRequestsByFiltersController
} from '../controllers/request.controller';
import authMiddleware from '../../middlewares/authMiddleware';
import roleMiddleware from '../../middlewares/roleMiddleware';

const router = Router();
router.use(authMiddleware);

router.get('/', roleMiddleware(1,2,3,4),  getAllRequestsController);

// Endpoint con paginación - GET /requests/paginated?page=1&limit=100
router.get('/paginated', roleMiddleware(1,2,3,4), getRequestsPaginatedController);

// Endpoint con filtros - GET /requests/filter?technician_ids=1,2&status_ids=1&priority_ids=1,2&type_ids=1&date_from=2024-01-01&date_to=2024-12-31&page=1&limit=100
router.get('/filter', roleMiddleware(1,2,3,4), getRequestsByFiltersController);

router.get('/getAllByUser/:id', roleMiddleware(1,2,3,4), getAllRequestsByUserIdController);

router.get('/getAllForTechnician/:id', roleMiddleware(1,2,3), getAllRequestsForTechnicianController);

router.post('/register',roleMiddleware(1,2,3,4), registerRequestController);

router.put('/updateRequest/:id', roleMiddleware(1,2,3), updateRequestController);

export default router;