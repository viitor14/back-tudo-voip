// Arquivo: src/models/Cliente.js (Versão Completa e Corrigida)

import Sequelize, { Model } from 'sequelize';

export default class Cliente extends Model {
  static init(sequelize) {
    super.init(
      {
        cod_cliente: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        nome_cliente: {
          type: Sequelize.STRING(180),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: 'O nome do cliente não pode ficar vazio.',
            },
            len: {
              args: [3, 180],
              msg: 'Nome deve conter de 3 a 180 caracteres.',
            },
          },
        },
        cpf: {
          type: Sequelize.STRING(11),
          defaultValue: null,
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
          type: Sequelize.STRING(14),
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
        status: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
      },
      {
        sequelize,
        tableName: 'cliente',
        timestamps: false,
        validate: {
          cpfOuCnpj() {
            if (!this.cpf && !this.cnpj) {
              throw new Error('É necessário fornecer um CPF ou um CNPJ.');
            }
          },
        },
      },
    );
    return this;
  }

  static associate(models) {
    // Define a relação: Um Cliente pertence a um Usuário
    this.belongsTo(models.User, {
      foreignKey: 'cod_usuario',
      as: 'usuario',
    });

    // Define a relação: Um Cliente pode ter muitos Pedidos
    this.hasMany(models.Pedido, {
      foreignKey: 'cod_cliente',
      as: 'pedidos', // Usando o apelido no plural para a relação hasMany
    });
  }
}
