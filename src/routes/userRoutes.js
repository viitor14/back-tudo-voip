import { Router } from 'express';

import loginRequired from '../middlewares/loginRequired';
import UserController from '../controllers/UserController';
import ClienteController from '../controllers/ClienteController';

const router = new Router();

// Não deveria existir num sistema
// router.get('/', userController.index); // Lista todos usuarios
// router.get('/:id', userController.show); // Lista um usuario

router.post('/', ClienteController.store);
router.get('/', loginRequired, UserController.show); // Lista um usuario
router.put('/', loginRequired, UserController.update);
router.delete('/', loginRequired, UserController.delete);

export default router;
/*
index -> lista todos usuarios -> GET
store/create -> cria um novo usuario -> POST
delete -> apaga um usuario -> DELETE
show -> mostra um usuario -> GET
update -> atualiza um usuario -> PATCH ou PUT
*/
