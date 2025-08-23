import Sequelize, { Model } from 'sequelize';

export default class Cidade extends Model {
  static init(sequelize) {
    super.init(
      {
        cod_cidade: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        nome_cidade: {
          type: Sequelize.STRING(120),
          allowNull: false,
        },
        cod_zona_telefonica_por_estado: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        status: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: 'cidade',
        timestamps: false,
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.ZonaTelefonicaPorEstado, {
      foreignKey: 'cod_zona_telefonica_por_estado',
      as: 'zona_por_estado',
    });
    this.hasMany(models.Pedido, { foreignKey: 'cod_cidade', as: 'pedidos' });
  }
}
