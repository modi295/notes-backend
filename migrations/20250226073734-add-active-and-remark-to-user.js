module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'active', {
      type: Sequelize.STRING(1),
      allowNull: true
    });
    await queryInterface.addColumn('Users', 'remark', {
      type: Sequelize.STRING(200),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'active');
    await queryInterface.removeColumn('Users', 'remark');
  }
};
