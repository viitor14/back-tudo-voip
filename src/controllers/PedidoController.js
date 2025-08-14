// Em src/controllers/PedidoController.js

import Pedido from '../models/Pedido';
import Cliente from '../models/Cliente'; // 1. IMPORTE O MODELO CLIENTE

class PedidoController {
  async store(req, res) {
    try {
      const { cod_cliente } = req.body;
      const clienteExiste = await Cliente.findByPk(cod_cliente);

      if (!clienteExiste) {
        return res.status(400).json({
          errors: ['Cliente com o código informado não foi encontrado.'],
        });
      }
      const pedido = await Pedido.create(req.body);
      return res.json(pedido);
    } catch (e) {
      const errorMessages = e.errors ? e.errors.map((err) => err.message) : [e.message];
      return res.status(400).json({
        errors: errorMessages,
      });
    }
  }
}

export default new PedidoController();
