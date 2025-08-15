import jwt from 'jsonwebtoken';
import { Op } from 'sequelize'; // 1. IMPORTE O 'Op' PARA FAZER A CONSULTA 'OU'
import User from '../models/User';
import Cliente from '../models/Cliente';

class TokenController {
  async store(req, res) {
    const { documento = '', senha = '' } = req.body;

    if (!documento || !senha) {
      return res.status(401).json({
        errors: ['Credenciais inválidas'],
      });
    }

    const cliente = await Cliente.findOne({
      where: {
        [Op.or]: [{ cpf: documento }, { cnpj: documento }],
      },
    });

    if (!cliente) {
      return res.status(401).json({
        errors: ['Credenciais inválidas'], // Mensagem genérica por segurança
      });
    }

    const user = await User.findByPk(cliente.cod_usuario);

    if (!user) {
      return res.status(401).json({
        errors: ['Usuário associado não encontrado'],
      });
    }

    if (!(await user.passwordIsValid(senha))) {
      return res.status(401).json({
        errors: ['Credenciais inválidas'], // Mensagem genérica por segurança
      });
    }

    // AQUI ESTÁ A CORREÇÃO
    const { cod_usuario, email } = user;
    const token = jwt.sign({ id: cod_usuario, email }, process.env.TOKEN_SECRET, {
      expiresIn: process.env.TOKEN_EXPIRATION,
    });

    return res.json({ token, user: { nome: cliente.nome_cliente, email: user.email } });
  }
}

export default new TokenController();
