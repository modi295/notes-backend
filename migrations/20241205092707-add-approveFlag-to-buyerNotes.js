module.exports = {
  up: async (queryInterface, Sequelize) => {
      await queryInterface.addColumn('BuyerNotes', 'approveFlag', {
          type: Sequelize.STRING(1),
          allowNull: true,  // Allows NULL
      });
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.removeColumn('BuyerNotes', 'approveFlag');
  }
};
