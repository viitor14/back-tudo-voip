import Sequelize, { Model } from 'sequelize';

export default class Portabilidade extends Model {
  static init(sequelize) {
    super.init(
      {
        cod_portabilidade: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        telefone: { type: Sequelize.STRING(20), allowNull: true },
        prefixo: { type: Sequelize.STRING(10), allowNull: true },
        range_inicio: { type: Sequelize.STRING(20), allowNull: true },
        range_fim: { type: Sequelize.STRING(20), allowNull: true },
        status_portabilidade: {
          type: Sequelize.ENUM('CONCLUÍDO', 'EM ANDAMENTO', 'RECUSADO'),
          defaultValue: 'EM ANDAMENTO',
        },
        cod_pedido: { type: Sequelize.INTEGER, allowNull: false },
        status: { type: Sequelize.BOOLEAN, defaultValue: true },
      },
      {
        sequelize,
        tableName: 'portabilidade',
        timestamps: false,
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Pedido, { foreignKey: 'cod_pedido', as: 'pedido' });
  }
}
