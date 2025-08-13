import User from '../models/User';
import Cliente from '../models/Cliente';
import sequelize from '../database'; // Importe sua instância/conexão do Sequelize

class RegistroController {
  async store(req, res) {
    // 1. Inicia a transação
    const t = await sequelize.transaction();

    try {
      const { usuario, cliente } = req.body;

      // 2. Cria o USUÁRIO dentro da transação
      // Note a opção { transaction: t }
      const novoUsuario = await User.create(usuario, { transaction: t });

      // 3. Pega o código do usuário recém-criado
      const { cod_usuario } = novoUsuario;

      // 4. Cria o CLIENTE usando o 'cod_usuario' e dentro da mesma transação
      const novoCliente = await Cliente.create(
        {
          ...cliente, // Pega todos os dados do cliente do req.body
          cod_usuario, // Adiciona a chave estrangeira
        },
        { transaction: t },
      );

      // 5. Se tudo deu certo, 'commita' a transação (salva no banco)
      await t.commit();

      return res.json({
        usuario: novoUsuario,
        cliente: novoCliente,
      });
    } catch (e) {
      // 6. Se qualquer erro ocorreu, desfaz TODAS as operações
      await t.rollback();

      console.error('Erro no registro:', e);
      const errorMessages = e.errors ? e.errors.map((err) => err.message) : [e.message];

      return res.status(400).json({
        errors: errorMessages,
      });
    }
  }
}

export default new RegistroController();
