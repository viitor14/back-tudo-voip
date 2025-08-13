'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('matriculas', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },

      // --- Chaves Estrangeiras (Foreign Keys) ---

      aluno_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'alunos', // Nome da tabela referenciada
          key: 'id',
        },
        // Se o aluno for deletado, a matrícula dele também é.
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },

      disciplina_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'disciplinas',
          key: 'id',
        },
        // Impede que uma disciplina seja deletada se houver matrículas ativas nela.
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },

      professor_id: {
        type: Sequelize.INTEGER,
        allowNull: false, // Uma matrícula deve ter um professor responsável.
        references: {
          model: 'professores',
          key: 'id',
        },
        // Impede que um professor seja deletado se ele estiver lecionando.
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },

      turma_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'turmas',
          key: 'id',
        },
        // Impede que uma turma seja deletada se houver matrículas nela.
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      },

      // --- Dados da Matrícula ---

      ano_letivo: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      nota_final: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },

      numero_faltas: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      // --- Timestamps ---

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('matriculas');
  },
};
