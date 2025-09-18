import { Router } from 'express';
import { getAllUsersController, registerUserController, updateUserController, toggleActiveUserController, resetUserPasswordController} from '../controllers/user.controller';
import authMiddleware from '../../middlewares/authMiddleware';
import roleMiddleware from '../../middlewares/roleMiddleware';

const router = Router();
router.use(authMiddleware);
router.use(roleMiddleware(1)); // Solo administradores


//Rutas Listas 
// GET /api/users
router.get('/', getAllUsersController);

// GET /api/users/identity_card/:identity_card
import { getUserByIdentityCardController } from '../controllers/user.controller';
router.get('/identity_card/:identity_card', getUserByIdentityCardController);

// POST /api/users/register
router.post('/register', registerUserController);


// PUT /api/users/update/:identity_card
router.put('/update/:identity_card', updateUserController);

// PUT /api/users/toggleactive/:identity_card
router.put('/toggleactive/:identity_card', toggleActiveUserController);


// PUT /api/users/resetpassword/:identity_card
router.put('/resetpassword/:identity_card', resetUserPasswordController);


export default router;