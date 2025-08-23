// Ficheiro: src/middlewares/loginRequired.js
import jwt from 'jsonwebtoken';
import Cliente from '../models/Cliente';

export default async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({
      errors: ['Login Required'],
    });
  }

  const [, token] = authorization.split(' ');

  try {
    const dados = jwt.verify(token, process.env.TOKEN_SECRET);
    const { cod_cliente, email } = dados;
    const cliente = await Cliente.findOne({
      where: {
        cod_cliente,
        email,
      },
    });

    if (!cliente) {
      return res.status(401).json({
        errors: ['Utilizador Inválido'],
      });
    }

    req.clienteId = cod_cliente;
    req.clienteEmail = email;
    req.isAdmin = cliente.admin;
    return next();
  } catch (e) {
    console.error('ERRO no jwt.verify:', e.name, '-', e.message);

    return res.status(401).json({
      errors: ['Token expirado ou inválido'],
    });
  }
};
