'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Notes', 'noteTitle', {
      type: Sequelize.STRING(100),
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Notes', 'noteTitle', {
      type: Sequelize.STRING(100),
      allowNull: false,
      unique: true, // Add back the uniqueness constraint if rolling back
    });
  }
};
