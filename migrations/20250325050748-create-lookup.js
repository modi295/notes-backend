'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Lookup', { 
      typeId: {
        type: Sequelize.STRING(3),
        allowNull: false,
        primaryKey: true, 
      },
      typeCode: {
        type: Sequelize.STRING(6),
        allowNull: true, 
      },
      typeName: {
        type: Sequelize.STRING(40),
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Lookups');
  }
};
