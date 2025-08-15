import { Router } from 'express';
import PedidoController from '../controllers/PedidoController';
import loginRequired from '../middlewares/loginRequired';

const router = new Router();

router.post('/', loginRequired, PedidoController.store);
router.get('/', loginRequired, PedidoController.index);
router.put('/:id', loginRequired, PedidoController.update);

export default router;
