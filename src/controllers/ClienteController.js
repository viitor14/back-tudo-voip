import Cliente from '../models/Cliente';
// import Foto from '../models/Foto';

class ClienteController {
  async store(req, res) {
    try {
      const cliente = await Cliente.create(req.body);

      return res.json(cliente);
    } catch (e) {
      // Adicione um console.error para ver o erro real no seu terminal
      console.error('ERRO AO CRIAR Cliente:', e);

      // Verifique se e.errors existe antes de mapeá-lo
      const errorMessages = e.errors ? e.errors.map((err) => err.message) : [e.message];

      return res.status(400).json({
        errors: errorMessages,
      });
    }
  }
}

export default new ClienteController();
