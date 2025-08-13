/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('alunos', {
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

      cpf: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      telefone: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      ativo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },

      turma_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'turmas',
          key: 'id',
        },
        onDelete: 'SET NULL', // Se a turma for deletada, o aluno fica "sem turma"
        onUpdate: 'CASCADE',
      },

      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },

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
    await queryInterface.dropTable('alunos');
  },
};
