import Sequelize, { Model } from 'sequelize';

export default class ZonaTelefonicaPorEstado extends Model {
  static init(sequelize) {
    super.init(
      {
        cod_zona_telefonica_por_estado: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        cod_estado: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        cod_zona_telefonica: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'zona_telefonica_por_estado',
        timestamps: false,
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Estado, { foreignKey: 'cod_estado', as: 'estado' });
    this.belongsTo(models.ZonaTelefonica, {
      foreignKey: 'cod_zona_telefonica',
      as: 'zona_telefonica',
    });
    this.hasMany(models.Cidade, { foreignKey: 'cod_zona_telefonica_por_estado', as: 'cidades' });
  }
}
