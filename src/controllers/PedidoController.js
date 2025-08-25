import sequelize from '../database';
import Pedido from '../models/Pedido';
import Portabilidade from '../models/Portabilidade';
import Cliente from '../models/Cliente';
import Cidade from '../models/Cidade';
import ZonaTelefonicaPorEstado from '../models/ZonaTelefonicaPorEstado';
import Estado from '../models/Estado';
import ZonaTelefonica from '../models/ZonaTelefonica';
import TipoVenda from '../models/TipoVenda';
import TermoContrato from '../models/TermoContrato';

class PedidoController {
  async store(req, res) {
    const t = await sequelize.transaction();

    try {
      const { cod_cidade, cod_tipo_venda, numeros_portabilidade } = req.body;

      if (cod_tipo_venda === 2 && (!numeros_portabilidade || numeros_portabilidade.length === 0)) {
        throw new Error(
          'Para pedidos de portabilidade, é necessário fornecer pelo menos um número.',
        );
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

      const dadosBasePedido = {
        ...req.body,
        cod_cliente: clienteAutenticado.cod_cliente,
        cod_estado: cidadeInfo.zona_por_estado.estado.cod_estado,
        cod_zona_telefonica: cidadeInfo.zona_por_estado.zona_telefonica.cod_zona_telefonica,
        data_pedido: new Date(),
      };
      delete dadosBasePedido.numeros_portabilidade;

      let pedidosCriados = [];

      if (cod_tipo_venda === 2) {
        const promises = numeros_portabilidade.map(async (numero) => {
          const novoPedido = await Pedido.create(dadosBasePedido, { transaction: t });
          await Portabilidade.create(
            {
              telefone: numero,
              cod_pedido: novoPedido.cod_pedido,
            },
            { transaction: t },
          );
          return novoPedido;
        });
        pedidosCriados = await Promise.all(promises);
      } else {
        const novoPedido = await Pedido.create(dadosBasePedido, { transaction: t });
        pedidosCriados.push(novoPedido);
      }

      await t.commit();
      return res.status(201).json(pedidosCriados);
    } catch (e) {
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

        include: [
          { model: Estado, as: 'estado' },
          { model: Cidade, as: 'cidade' },
          { model: ZonaTelefonica, as: 'zona_telefonica' }, // Adicionei a Zona Telefónica que faltava
          { model: TipoVenda, as: 'tipo_venda' },
          { model: Portabilidade, as: 'portabilidade' },
        ],
        order: [['cod_pedido', 'DESC']],
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
          { model: Portabilidade, as: 'portabilidade', attributes: ['telefone'] },
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
    // Inicia a transação
    const t = await sequelize.transaction();

    try {
      if (!req.isAdmin && !req.clienteId) {
        // Verificação de segurança
        return res.status(403).json({ errors: ['Acesso negado.'] });
      }

      const { id } = req.params;
      const pedido = await Pedido.findByPk(id);

      if (!pedido) {
        return res.status(404).json({ errors: ['Pedido não encontrado.'] });
      }

      // Lógica de permissão: admin pode apagar qualquer um, cliente só o seu
      if (!req.isAdmin && pedido.cod_cliente !== req.clienteId) {
        return res
          .status(403)
          .json({ errors: ['Você não tem permissão para excluir este pedido.'] });
      }

      // 1. Exclui os registos dependentes DENTRO da transação
      await Portabilidade.destroy({ where: { cod_pedido: id }, transaction: t });
      await TermoContrato.destroy({ where: { cod_pedido: id }, transaction: t });

      // 2. Exclui o pedido principal DENTRO da transação
      await pedido.destroy({ transaction: t });

      // 3. Se tudo correu bem, confirma a transação
      await t.commit();

      return res.json({
        message: 'Pedido e todos os seus dados associados foram excluídos com sucesso.',
      });
    } catch (e) {
      // 4. Se algo falhou, desfaz todas as operações
      await t.rollback();
      console.error('ERRO AO EXCLUIR PEDIDO:', e);
      return res.status(500).json({ errors: ['Ocorreu um erro ao excluir o pedido.'] });
    }
  }
}

export default new PedidoController();
