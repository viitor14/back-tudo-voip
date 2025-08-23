import Sequelize, { Model } from 'sequelize';

export default class Estado extends Model {
  static init(sequelize) {
    super.init(
      {
        cod_estado: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        nome_estado: {
          type: Sequelize.STRING(50),
          allowNull: false,
        },
        regiao: {
          type: Sequelize.STRING(20),
          allowNull: false,
        },
        status: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: 'estado',
        timestamps: false,
      },
    );
    return this;
  }

  static associate(models) {
    this.hasMany(models.Pedido, { foreignKey: 'cod_estado', as: 'pedidos' });
    this.belongsToMany(models.ZonaTelefonica, {
      through: models.ZonaTelefonicaPorEstado,
      foreignKey: 'cod_estado',
      as: 'zonas_telefonicas',
    });
  }
}
