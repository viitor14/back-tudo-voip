import { Router } from 'express';
import RegistroController from '../controllers/RegistroController';

const router = new Router();

router.post('/', RegistroController.store);

export default router;
