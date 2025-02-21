module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.addColumn('Notes', 'remark', {
      type: Sequelize.STRING(200),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('Notes', 'remark');
  }
};
