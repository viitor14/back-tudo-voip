// Ficheiro: src/controllers/CidadeController.js
import Cidade from '../models/Cidade';
import ZonaTelefonicaPorEstado from '../models/ZonaTelefonicaPorEstado';

class CidadeController {
  // Listar cidades, com filtro opcional por estado
  async index(req, res) {
    try {
      const { cod_estado } = req.query; // Ex: GET /cidades?cod_estado=25
      const where = { status: true };
      const includeOptions = [];

      if (cod_estado) {
        // Adiciona um filtro para buscar cidades que pertencem ao estado especificado
        includeOptions.push({
          model: ZonaTelefonicaPorEstado,
          as: 'zona_por_estado',
          where: { cod_estado },
          attributes: [], // Não precisa de mostrar os dados da tabela de junção
        });
      }

      const cidades = await Cidade.findAll({
        where,
        attributes: ['cod_cidade', 'nome_cidade'],
        include: includeOptions,
        order: [['nome_cidade', 'ASC']],
      });
      return res.json(cidades);
    } catch (e) {
      return res.status(500).json({ errors: ['Ocorreu um erro ao listar as cidades.'] });
    }
  }

  // Criar uma nova cidade (apenas para admin)
  async store(req, res) {
    try {
      if (!req.isAdmin) {
        return res.status(403).json({ errors: ['Acesso negado.'] });
      }
      const novaCidade = await Cidade.create(req.body);
      return res.json(novaCidade);
    } catch (e) {
      const errors = e.errors ? e.errors.map((err) => err.message) : [e.message];
      return res.status(400).json({ errors });
    }
  }
}

export default new CidadeController();
