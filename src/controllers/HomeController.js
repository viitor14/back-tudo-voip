class HomeController {
  async index(req, res) {
    try {
      return res.json('Index');
    } catch (error) {
      return res.status(400).json({
        errors: error.errors.map((err) => err.message),
      });
    }
  }
}

export default new HomeController();
