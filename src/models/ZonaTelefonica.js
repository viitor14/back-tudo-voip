import Sequelize, { Model } from 'sequelize';

export default class ZonaTelefonica extends Model {
  static init(sequelize) {
    super.init(
      {
        cod_zona_telefonica: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        area_telefonica: {
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
        tableName: 'zona_telefonica',
        timestamps: false,
      },
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Pedido, { foreignKey: 'cod_zona_telefonica', as: 'pedidos' });
    this.belongsToMany(models.Estado, {
      through: models.ZonaTelefonicaPorEstado,
      foreignKey: 'cod_zona_telefonica',
      as: 'estados',
    });
  }
}
