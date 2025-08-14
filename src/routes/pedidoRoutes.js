import { Router } from 'express';
import PedidoController from '../controllers/PedidoController';

const router = new Router();

router.post('/', PedidoController.store);

export default router;
