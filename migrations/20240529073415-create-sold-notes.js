'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('SoldNotes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        references: {
          model: 'Users',
          key: 'email'
        }
      },
      noteId: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      noteTitle: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      sellFor: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      sellPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('SoldNotes');
  }
};
