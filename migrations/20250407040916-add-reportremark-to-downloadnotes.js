'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('DownloadNotes', 'ReportRemark', {
      type: Sequelize.STRING(60),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('DownloadNotes', 'ReportRemark');
  }
};
