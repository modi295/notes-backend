module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('DownloadNotes', 'rating', {
        type: Sequelize.STRING(1),
        allowNull: true,
      }),
      queryInterface.addColumn('DownloadNotes', 'comment', {
        type: Sequelize.STRING(40),
        allowNull: true,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('DownloadNotes', 'rating'),
      queryInterface.removeColumn('DownloadNotes', 'comment'),
    ]);
  }
};
