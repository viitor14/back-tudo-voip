import User from '../models/User';
// import Foto from '../models/Foto';

class UserController {
  async store(req, res) {
    try {
      const user = await User.create(req.body);

      return res.json(user);
    } catch (e) {
      // Verifique se e.errors existe antes de mapeá-lo
      const errorMessages = e.errors ? e.errors.map((err) => err.message) : [e.message];

      return res.status(400).json({
        errors: errorMessages,
      });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({
          errors: ['Faltando ID'],
        });
      }

      const user = await User.findByPk(id, {
        attributes: ['nome', 'cpf', 'email'],
      });

      if (!user) {
        return res.status(400).json({
          errors: ['User não exite'],
        });
      }

      return res.json(user);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['Faltando ID'],
        });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(400).json({
          errors: ['User não exite'],
        });
      }
      await user.destroy();
      return res.json({
        apagado: true,
      });
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;

      if (!id) {
        return res.status(400).json({
          errors: ['Faltando ID'],
        });
      }

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(400).json({
          errors: ['User não exite'],
        });
      }

      const userAtualizado = await user.update(req.body);

      return res.json(userAtualizado);
    } catch (e) {
      return res.status(400).json({
        errors: e.errors.map((err) => err.message),
      });
    }
  }
}

export default new UserController();
