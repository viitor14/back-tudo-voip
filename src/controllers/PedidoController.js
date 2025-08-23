import sequelize from '../database';
import Pedido from '../models/Pedido';
import Portabilidade from '../models/Portabilidade';
import Cliente from '../models/Cliente';
import Cidade from '../models/Cidade';
import ZonaTelefonicaPorEstado from '../models/ZonaTelefonicaPorEstado';
import Estado from '../models/Estado';
import ZonaTelefonica from '../models/ZonaTelefonica';
import TipoVenda from '../models/TipoVenda';

class PedidoController {
  // Criar um novo pedido de forma simplificada
  async store(req, res) {
    // Inicia a transação
    const t = await sequelize.transaction();

    try {
      const {
        cod_cidade,
        cod_tipo_venda,
        numeros_portabilidade, // Novo campo
        // ...outros campos
      } = req.body;

      // Validação para portabilidade
      // Supondo que o cod_tipo_venda para Portabilidade seja 2
      if (cod_tipo_venda === 2) {
        if (
          !numeros_portabilidade ||
          !Array.isArray(numeros_portabilidade) ||
          numeros_portabilidade.length === 0
        ) {
          throw new Error(
            'Para pedidos de portabilidade, é necessário fornecer pelo menos um número.',
          );
        }
      }

      const clienteAutenticado = await Cliente.findByPk(req.clienteId);
      if (!clienteAutenticado) {
        throw new Error('Cliente autenticado não encontrado.');
      }

      const cidadeInfo = await Cidade.findByPk(cod_cidade, {
        include: {
          model: ZonaTelefonicaPorEstado,
          as: 'zona_por_estado',
          include: [
            { model: Estado, as: 'estado' },
            { model: ZonaTelefonica, as: 'zona_telefonica' },
          ],
        },
      });
      if (!cidadeInfo) {
        throw new Error('Cidade selecionada não encontrada.');
      }

      const dadosPedido = {
        ...req.body,
        cod_cliente: clienteAutenticado.cod_cliente,
        cod_estado: cidadeInfo.zona_por_estado.estado.cod_estado,
        cod_zona_telefonica: cidadeInfo.zona_por_estado.zona_telefonica.cod_zona_telefonica,
        data_pedido: new Date(),
      };

      // Cria o pedido dentro da transação
      const novoPedido = await Pedido.create(dadosPedido, { transaction: t });

      // Se for portabilidade, cria os registos na tabela de portabilidade
      if (cod_tipo_venda === 2) {
        const portabilidadesParaCriar = numeros_portabilidade.map((numero) => ({
          telefone: numero,
          cod_pedido: novoPedido.cod_pedido,
        }));

        await Portabilidade.bulkCreate(portabilidadesParaCriar, { transaction: t });
      }

      // Se tudo correu bem, confirma a transação
      await t.commit();

      return res.json(novoPedido);
    } catch (e) {
      // Se algo falhou, desfaz todas as operações
      await t.rollback();
      console.error('ERRO AO CRIAR PEDIDO:', e);
      const errors = e.errors ? e.errors.map((err) => err.message) : [e.message];
      return res.status(400).json({ errors: errors.length > 0 ? errors : [e.message] });
    }
  }

  // --- Os outros métodos (index, show, update) continuam iguais ---

  // Listar pedidos com filtros e permissões
  async index(req, res) {
    try {
      const { status_pedido, cod_cliente_filtro } = req.query;
      const where = {};

      if (status_pedido) {
        where.status_pedido = status_pedido;
      }

      if (req.isAdmin) {
        if (cod_cliente_filtro) {
          where.cod_cliente = cod_cliente_filtro;
        }
      } else {
        where.cod_cliente = req.clienteId;
      }

      const pedidos = await Pedido.findAll({
        where,
        attributes: ['cod_pedido', 'data_pedido', 'status_pedido', 'nome_completo', 'nome_empresa'],
        include: [
          { model: Cliente, as: 'cliente', attributes: ['email'] },
          { model: Estado, as: 'estado', attributes: ['nome_estado'] },
          { model: Cidade, as: 'cidade', attributes: ['nome_cidade'] },
          { model: TipoVenda, as: 'tipo_venda', attributes: ['tipo_venda'] },
        ],
        order: [['data_pedido', 'DESC']],
      });

      return res.json(pedidos);
    } catch (e) {
      console.error('ERRO AO BUSCAR PEDIDOS:', e);
      return res.status(500).json({ errors: ['Ocorreu um erro ao buscar os pedidos.'] });
    }
  }

  // Ver detalhes de um pedido específico
  async show(req, res) {
    try {
      const { id } = req.params;
      const where = { cod_pedido: id };

      if (!req.isAdmin) {
        where.cod_cliente = req.clienteId;
      }

      const pedido = await Pedido.findOne({
        where,
        include: [
          { model: Cliente, as: 'cliente' },
          { model: Estado, as: 'estado' },
          { model: Cidade, as: 'cidade' },
          { model: ZonaTelefonica, as: 'zona_telefonica' },
          { model: TipoVenda, as: 'tipo_venda' },
        ],
      });

      if (!pedido) {
        return res.status(404).json({ errors: ['Pedido não encontrado.'] });
      }

      return res.json(pedido);
    } catch (e) {
      return res.status(500).json({ errors: ['Ocorreu um erro ao obter o pedido.'] });
    }
  }

  // Atualizar um pedido
  async update(req, res) {
    try {
      if (!req.isAdmin) {
        return res
          .status(403)
          .json({ errors: ['Acesso negado. Apenas administradores podem alterar pedidos.'] });
      }

      const { id } = req.params;
      const pedido = await Pedido.findByPk(id);

      if (!pedido) {
        return res.status(404).json({ errors: ['Pedido não encontrado.'] });
      }

      const pedidoAtualizado = await pedido.update(req.body);
      return res.json(pedidoAtualizado);
    } catch (e) {
      const errors = e.errors ? e.errors.map((err) => err.message) : [e.message];
      return res.status(400).json({ errors });
    }
  }

  async destroy(req, res) {
    try {
      // 2. Pega o ID do pedido a ser excluído a partir dos parâmetros da URL
      const { id } = req.params;

      // 3. Busca o pedido no banco de dados para garantir que ele existe
      const pedido = await Pedido.findByPk(id);

      if (!pedido) {
        return res.status(404).json({ errors: ['Pedido não encontrado.'] });
      }

      // 4. Exclui o pedido do banco de dados
      await pedido.destroy();

      // 5. Retorna uma mensagem de sucesso
      return res.json({ message: 'Pedido excluído com sucesso.' });
    } catch (e) {
      console.error('ERRO AO EXCLUIR PEDIDO:', e);
      // Trata erros de chave estrangeira, caso existam tabelas dependentes (ex: portabilidade)
      if (e.name === 'SequelizeForeignKeyConstraintError') {
        return res.status(400).json({
          errors: [
            'Não é possível excluir este pedido, pois existem dados associados a ele (ex: portabilidade, contratos).',
          ],
        });
      }
      return res.status(500).json({ errors: ['Ocorreu um erro ao excluir o pedido.'] });
    }
  }
}

export default new PedidoController();
