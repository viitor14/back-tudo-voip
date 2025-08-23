import Estado from '../models/Estado';

class EstadoController {
  // Listar todos os estados
  async index(req, res) {
    try {
      const estados = await Estado.findAll({
        where: { status: true }, // Apenas estados ativos
        attributes: ['cod_estado', 'nome_estado', 'regiao'],
        order: [['nome_estado', 'ASC']], // Ordenado por nome
      });
      return res.json(estados);
    } catch (e) {
      return res.status(500).json({ errors: ['Ocorreu um erro ao listar os estados.'] });
    }
  }

  // Criar um novo estado (apenas para admin)
  async store(req, res) {
    try {
      if (!req.isAdmin) {
        return res.status(403).json({ errors: ['Acesso negado.'] });
      }
      const novoEstado = await Estado.create(req.body);
      return res.json(novoEstado);
    } catch (e) {
      const errors = e.errors ? e.errors.map((err) => err.message) : [e.message];
      return res.status(400).json({ errors });
    }
  }
}

export default new EstadoController();
