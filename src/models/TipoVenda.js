import Sequelize, { Model } from 'sequelize';

export default class TipoVenda extends Model {
  static init(sequelize) {
    super.init(
      {
        cod_tipo_venda: {
          type: Sequelize.SMALLINT,
          primaryKey: true,
          autoIncrement: true,
        },
        tipo_venda: {
          type: Sequelize.STRING(80),
          allowNull: false,
        },
        status: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: 'tipo_venda',
        timestamps: false,
      },
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Pedido, { foreignKey: 'cod_tipo_venda', as: 'pedidos' });
  }
}
