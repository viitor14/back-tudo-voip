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
        cod_cliente: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        unidade_federativa: {
          type: Sequelize.STRING(50),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'O campo Unidade Federativa não pode ser vazio.',
            },
          },
        },
        zona_telefonica: {
          type: Sequelize.SMALLINT,
          allowNull: false,
          validate: {
            isInt: {
              msg: 'A zona telefônica deve ser um número.',
            },
          },
        },
        cidade: {
          type: Sequelize.STRING(100),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'O campo Cidade não pode ser vazio.',
            },
          },
        },
        cod_tipo_venda: {
          type: Sequelize.SMALLINT,
          allowNull: false,
        },
        quantidade_novos_numeros: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
          validate: {
            isInt: true,
            min: {
              args: [1],
              msg: 'A quantidade de números deve ser no mínimo 1.',
            },
          },
        },
        observacoes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        status_pedido: {
          type: Sequelize.ENUM('ATIVO', 'EM ANDAMENTO', 'CANCELADO'),
          allowNull: false,
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
        timestamps: true, // Habilita o gerenciamento automático de datas
        createdAt: 'data_pedido', // Mapeia 'createdAt' do Sequelize para a coluna 'data_pedido'
        updatedAt: 'data_atualizacao', // Mapeia 'updatedAt' do Sequelize para a coluna 'data_atualizacao'
      },
    );
    return this;
  }

  // Define as relações com outras tabelas
  static associate(models) {
    this.belongsTo(models.Cliente, {
      foreignKey: 'cod_cliente',
      as: 'cliente',
    });
  }
}
