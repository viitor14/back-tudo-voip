// Ficheiro: src/controllers/ClienteController.js
import Cliente from '../models/Cliente';

class ClienteController {
  // Criar um novo cliente (registo)
  async store(req, res) {
    try {
      const novoCliente = await Cliente.create(req.body);
      const { cod_cliente, nome_completo, nome_empresa, email } = novoCliente;
      return res.json({ cod_cliente, nome: nome_completo || nome_empresa, email });
    } catch (e) {
      const errors = e.errors ? e.errors.map((err) => err.message) : [e.message];
      return res.status(400).json({ errors });
    }
  }

  // Listar todos os clientes (apenas para admin)
  async index(req, res) {
    try {
      if (!req.isAdmin) {
        return res.status(403).json({ errors: ['Acesso negado'] });
      }
      const clientes = await Cliente.findAll({
        attributes: ['cod_cliente', 'nome_completo', 'nome_empresa', 'email', 'status'],
      });
      return res.json(clientes);
    } catch (e) {
      return res.status(500).json({ errors: ['Ocorreu um erro ao listar os clientes.'] });
    }
  }

  // Ver o próprio perfil
  async show(req, res) {
    try {
      const cliente = await Cliente.findByPk(req.clienteId);
      if (!cliente) {
        return res.status(404).json({ errors: ['Cliente não encontrado.'] });
      }
      const { cod_cliente, nome_completo, nome_empresa, email, cpf, cnpj } = cliente;
      return res.json({ cod_cliente, nome_completo, nome_empresa, email, cpf, cnpj });
    } catch (e) {
      return res.status(500).json({ errors: ['Ocorreu um erro ao obter o perfil.'] });
    }
  }

  // Atualizar o próprio perfil
  async update(req, res) {
    try {
      const cliente = await Cliente.findByPk(req.clienteId);
      if (!cliente) {
        return res.status(404).json({ errors: ['Cliente não encontrado.'] });
      }

      // Impede que o utilizador altere o seu status de admin
      if (req.body.admin) {
        delete req.body.admin;
      }

      const clienteAtualizado = await cliente.update(req.body);
      const { cod_cliente, nome_completo, nome_empresa, email } = clienteAtualizado;
      return res.json({ cod_cliente, nome: nome_completo || nome_empresa, email });
    } catch (e) {
      const errors = e.errors ? e.errors.map((err) => err.message) : [e.message];
      return res.status(400).json({ errors });
    }
  }
}

export default new ClienteController();
