import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import Cliente from '../models/Cliente';

class TokenController {
  async store(req, res) {
    const { documento = '', senha = '' } = req.body;

    if (!documento || !senha) {
      return res.status(401).json({
        errors: ['Credenciais inválidas'],
      });
    }

    // Procura o cliente pelo CPF ou CNPJ
    const cliente = await Cliente.findOne({
      where: {
        [Op.or]: [{ cpf: documento }, { cnpj: documento }],
      },
    });

    if (!cliente) {
      return res.status(401).json({
        errors: ['Utilizador não encontrado'],
      });
    }

    if (!(await cliente.passwordIsValid(senha))) {
      return res.status(401).json({
        errors: ['Senha inválida'],
      });
    }

    const { cod_cliente, email, admin } = cliente;

    // Gera o token com as informações do cliente
    const token = jwt.sign({ cod_cliente, email, admin }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    return res.json({
      token,
      user: {
        nome: cliente.nome_completo || cliente.nome_empresa,
        email,
        admin,
      },
    });
  }
}

export default new TokenController();
