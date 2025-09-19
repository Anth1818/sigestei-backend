import { Router } from 'express';
import { getAllCatalogsController } from '../controllers/catalog.controller';

const router = Router();

router.get('/', getAllCatalogsController);

export default router;