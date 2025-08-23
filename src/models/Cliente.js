// Arquivo: src/models/Cliente.js (Versão Completa e Corrigida)

import Sequelize, { Model } from 'sequelize';
import bcryptjs from 'bcryptjs';

export default class Cliente extends Model {
  static init(sequelize) {
    super.init(
      {
        cod_cliente: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
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

        nome_completo: {
          type: Sequelize.STRING(180),
          validate: {
            len: {
              args: [3, 180],
              msg: 'Nome deve conter de 3 a 180 caracteres.',
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

        nome_empresa: {
          type: Sequelize.STRING(180),
          validate: {
            len: {
              args: [3, 180],
              msg: 'Nome deve conter de 3 a 180 caracteres.',
            },
          },
        },

        email: {
          type: Sequelize.STRING,
          defaultValue: '',
          unique: {
            msg: 'email ja existe',
          },
          validate: {
            isEmail: {
              msg: 'Email inválido',
            },
          },
        },

        senha: {
          type: Sequelize.STRING,
          defaultValue: '',
        },

        password: {
          type: Sequelize.VIRTUAL,
          defaultValue: '',
          validate: {
            len: {
              args: [6, 50],
              msg: 'A senha deve ter entre 6 e 50 caractere',
            },
          },
        },

        admin: {
          type: Sequelize.BOOLEAN,
          defaultValue: 'false',
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

    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.senha = await bcryptjs.hash(user.password, 8);
      }
    });
    return this;
  }

  passwordIsValid(password) {
    return bcryptjs.compare(password, this.senha);
  }

  static associate(models) {
    // Define a relação: Um Cliente pertence a um Usuário

    // Define a relação: Um Cliente pode ter muitos Pedidos
    this.hasMany(models.Pedido, {
      foreignKey: 'cod_cliente',
      as: 'pedidos', // Usando o apelido no plural para a relação hasMany
    });
  }
}
