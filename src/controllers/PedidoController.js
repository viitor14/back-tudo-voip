import Pedido from '../models/Pedido';
import Cliente from '../models/Cliente';

class PedidoController {
  // --- MÉTODO CREATE (store) ---
  async store(req, res) {
    try {
      // 1. Busque o perfil de cliente associado ao usuário LOGADO.
      const cliente = await Cliente.findOne({ where: { cod_usuario: req.userId } });

      if (!cliente) {
        return res.status(404).json({
          errors: ['Perfil de cliente não encontrado para este usuário.'],
        });
      }

      // 2. Pegue os dados do pedido do corpo da requisição.
      // Note que NÃO pegamos mais o 'cod_cliente' do req.body.
      const {
        unidade_federativa,
        zona_telefonica,
        cidade,
        cod_tipo_venda,
        quantidade_novos_numeros,
        observacoes,
      } = req.body;

      // 3. Crie o pedido, forçando a associação com o cliente correto.
      const novoPedido = await Pedido.create({
        cod_cliente: cliente.cod_cliente, // Use o ID do cliente encontrado
        unidade_federativa,
        zona_telefonica,
        cidade,
        cod_tipo_venda,
        quantidade_novos_numeros,
        observacoes,
      });

      return res.json(novoPedido);
    } catch (e) {
      console.error('ERRO AO CRIAR PEDIDO:', e);
      const errorMessages = e.errors ? e.errors.map((err) => err.message) : [e.message];
      return res.status(400).json({ errors: errorMessages });
    }
  }

  // --- MÉTODO LIST (index) ---
  async index(req, res) {
    try {
      const { status_pedido } = req.query; // Filtros opcionais da URL
      const where = {};

      if (status_pedido) {
        where.status_pedido = status_pedido;
      }

      // LÓGICA DE PERMISSÃO
      // Se não for admin, adicione um filtro obrigatório para o cliente do usuário
      if (!req.isAdmin) {
        const cliente = await Cliente.findOne({ where: { cod_usuario: req.userId } });

        // Se o usuário não tem cliente, ele não tem pedidos para ver.
        if (!cliente) return res.json([]);

        where.cod_cliente = cliente.cod_cliente;
      }

      const pedidos = await Pedido.findAll({
        where,
        include: {
          model: Cliente,
          as: 'cliente',
          attributes: ['nome_cliente'], // Para mostrar o nome do cliente na lista
        },
        order: [['data_pedido', 'DESC']],
      });

      return res.json(pedidos);
    } catch (e) {
      console.error('ERRO AO BUSCAR PEDIDOS:', e);
      return res.status(500).json({ errors: ['Ocorreu um erro ao buscar os pedidos.'] });
    }
  }
}

export default new PedidoController();
