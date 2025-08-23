import Sequelize, { Model } from 'sequelize';

export default class Pedido extends Model {
  static init(sequelize) {
    super.init(
      {
        cod_pedido: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        cod_cliente: { type: Sequelize.BIGINT, allowNull: false },
        cod_estado: { type: Sequelize.INTEGER, allowNull: false },
        cod_zona_telefonica: { type: Sequelize.INTEGER, allowNull: false },
        cod_cidade: { type: Sequelize.INTEGER, allowNull: false },
        cod_tipo_venda: { type: Sequelize.SMALLINT, allowNull: false },
        quantidade_novos_numeros: { type: Sequelize.INTEGER, allowNull: true },
        cpf: { type: Sequelize.STRING(11), allowNull: true },
        nome_completo: { type: Sequelize.STRING(180), allowNull: true },
        cnpj: { type: Sequelize.STRING(14), allowNull: true },
        nome_empresa: { type: Sequelize.STRING(180), allowNull: true },
        observacoes: { type: Sequelize.TEXT, allowNull: true },
        data_pedido: { type: Sequelize.DATEONLY },
        status_pedido: {
          type: Sequelize.ENUM('CONCLUÍDO', 'EM ANDAMENTO', 'RECUSADO'),
          defaultValue: 'EM ANDAMENTO',
        },
        motivo_cancelamento: {
          type: Sequelize.ENUM(
            'NÚMERO VAGO',
            'CPF DIVERGENTE',
            'CNPJ DIVERGENTE',
            'LOCALIDADE NÃO ATENDIDA',
          ),
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'pedido',
        timestamps: false, // Suas colunas de data são manuais
      },
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Cliente, { foreignKey: 'cod_cliente', as: 'cliente' });
    this.belongsTo(models.Estado, { foreignKey: 'cod_estado', as: 'estado' });
    this.belongsTo(models.ZonaTelefonica, {
      foreignKey: 'cod_zona_telefonica',
      as: 'zona_telefonica',
    });
    this.belongsTo(models.Cidade, { foreignKey: 'cod_cidade', as: 'cidade' });
    this.belongsTo(models.TipoVenda, { foreignKey: 'cod_tipo_venda', as: 'tipo_venda' });
    this.hasMany(models.Portabilidade, { foreignKey: 'cod_pedido', as: 'portabilidades' });
    this.hasMany(models.TermoContrato, { foreignKey: 'cod_pedido', as: 'termos_contrato' });
  }
}
