import Sequelize, { Model } from 'sequelize';

export default class Cliente extends Model {
  static init(sequelize) {
    super.init(
      {
        cod_cliente: {
          type: Sequelize.INTEGER,
          primaryKey: true, // Informa que esta é a chave primária
          autoIncrement: true, // Informa que ela é auto-incremental
        },

        nome_cliente: {
          type: Sequelize.STRING,
          defaultValue: '',
          validate: {
            len: {
              args: [3, 50],
              msg: 'Nome de conter 3 a 50 caracteres',
            },
          },
        },
        cpf: {
          type: Sequelize.STRING,
          defaultValue: null, // MUDANÇA 1: Usar null em vez de string vazia
          unique: {
            msg: 'CPF já cadastrado',
          },
          validate: {
            validaCpf(value) {
              if (value && value.length !== 11) {
                throw new Error('CPF deve conter 11 números.');
              }
            },
          },
        },
        cnpj: {
          type: Sequelize.STRING,
          defaultValue: null,
          unique: {
            msg: 'CNPJ já cadastrado',
          },
          validate: {
            validaCnpj(value) {
              if (value && value.length !== 14) {
                throw new Error('CNPJ deve conter 14 números.');
              }
            },
          },
        },

        cod_usuario: {
          type: Sequelize.INTEGER,
          defaultValue: '',
        },
        status: {
          type: Sequelize.BOOLEAN,
          defaultValue: 'false',
        },
      },
      {
        sequelize,
        tableName: 'cliente',
      },
    );

    // Antes de salvar dados, essa função será executada

    return this;
  }

  static associate(models) {
    // 'este' modelo (Cliente) pertence a (belongsTo) um 'User'
    this.belongsTo(models.User, {
      foreignKey: 'cod_usuario',
      as: 'usuario',
    });
  }
}
