'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('turmas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      nome: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      ano_letivo: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      periodo: {
        type: Sequelize.STRING,
        allowNull: false, // Uma turma deve ter um período definido.
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('turmas');
  },
};
