// Ficheiro: src/controllers/TipoVendaController.js
import TipoVenda from '../models/TipoVenda';

class TipoVendaController {
  // Listar todos os tipos de venda
  async index(req, res) {
    try {
      const tiposVenda = await TipoVenda.findAll({
        where: { status: true },
        attributes: ['cod_tipo_venda', 'tipo_venda'],
      });
      return res.json(tiposVenda);
    } catch (e) {
      return res.status(500).json({ errors: ['Ocorreu um erro ao listar os tipos de venda.'] });
    }
  }

  // Criar um novo tipo de venda (apenas para admin)
  async store(req, res) {
    try {
      if (!req.isAdmin) {
        return res.status(403).json({ errors: ['Acesso negado.'] });
      }
      const novoTipoVenda = await TipoVenda.create(req.body);
      return res.json(novoTipoVenda);
    } catch (e) {
      const errors = e.errors ? e.errors.map((err) => err.message) : [e.message];
      return res.status(400).json({ errors });
    }
  }
}

export default new TipoVendaController();
