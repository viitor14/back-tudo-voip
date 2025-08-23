// Ficheiro: src/controllers/ZonaTelefonicaController.js
import ZonaTelefonica from '../models/ZonaTelefonica';
import Estado from '../models/Estado'; // Para a associação

class ZonaTelefonicaController {
  // Listar todas as zonas telefónicas
  async index(req, res) {
    try {
      const zonas = await ZonaTelefonica.findAll({
        where: { status: true },
        attributes: ['cod_zona_telefonica', 'area_telefonica'],
        include: {
          // Opcional: mostrar a que estados a zona pertence
          model: Estado,
          as: 'estados',
          attributes: ['nome_estado'],
          through: { attributes: [] }, // Não mostrar dados da tabela de junção
        },
        order: [['area_telefonica', 'ASC']],
      });
      return res.json(zonas);
    } catch (e) {
      return res.status(500).json({ errors: ['Ocorreu um erro ao listar as zonas telefónicas.'] });
    }
  }

  // Criar uma nova zona (apenas para admin)
  async store(req, res) {
    try {
      if (!req.isAdmin) {
        return res.status(403).json({ errors: ['Acesso negado.'] });
      }
      const novaZona = await ZonaTelefonica.create(req.body);
      return res.json(novaZona);
    } catch (e) {
      const errors = e.errors ? e.errors.map((err) => err.message) : [e.message];
      return res.status(400).json({ errors });
    }
  }
}

export default new ZonaTelefonicaController();
