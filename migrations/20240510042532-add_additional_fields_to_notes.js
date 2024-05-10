'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Notes', 'displayPictureP', {
      type: Sequelize.STRING(350),
      allowNull: true
    });
    await queryInterface.addColumn('Notes', 'notesAttachmentP', {
      type: Sequelize.STRING(350),
      allowNull: true
    });
    await queryInterface.addColumn('Notes', 'previewUploadP', {
      type: Sequelize.STRING(350),
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Notes', 'displayPictureP');
    await queryInterface.removeColumn('Notes', 'notesAttachmentP');
    await queryInterface.removeColumn('Notes', 'previewUploadP');
  }
};
