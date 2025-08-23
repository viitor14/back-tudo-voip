import Sequelize, { Model } from 'sequelize';

export default class TermoContrato extends Model {
  static init(sequelize) {
    super.init(
      {
        cod_termo_contrato: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        nome_arquivo: { type: Sequelize.STRING, allowNull: false },
        caminho_arquivo: { type: Sequelize.STRING(500), allowNull: false },
        cod_pedido: { type: Sequelize.INTEGER, allowNull: false },
        status: { type: Sequelize.BOOLEAN, defaultValue: true },
      },
      {
        sequelize,
        tableName: 'termo_contrato',
        timestamps: false,
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Pedido, { foreignKey: 'cod_pedido', as: 'pedido' });
  }
}
