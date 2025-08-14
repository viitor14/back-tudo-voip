import Sequelize, { Model } from 'sequelize';
import bcryptjs from 'bcryptjs';

export default class User extends Model {
  static init(sequelize) {
    super.init(
      {
        cod_usuario: {
          type: Sequelize.INTEGER,
          primaryKey: true, // Informa que esta é a chave primária
          autoIncrement: true, // Informa que ela é auto-incremental
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
          defaultValue: 'true',
        },
      },
      {
        sequelize,
        tableName: 'usuario',
      },
    );

    // Antes de salvar dados, essa função será executada
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
    // this (Usuario) tem um (hasOne) models.Cliente
    this.hasOne(models.Cliente, {
      foreignKey: 'cod_usuario',
      as: 'cliente', // Apelido no singular, pois é apenas um
    });
  }
}
