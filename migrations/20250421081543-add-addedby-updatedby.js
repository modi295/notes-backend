'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add columns to User table
    await queryInterface.addColumn('Users', 'addedBy', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Users', 'updatedBy', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Add columns to SoldNotes table
    await queryInterface.addColumn('SoldNotes', 'addedBy', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('SoldNotes', 'updatedBy', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Add columns to Notes table
    await queryInterface.addColumn('Notes', 'addedBy', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Notes', 'updatedBy', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Add columns to Lookup table
    await queryInterface.addColumn('Lookups', 'addedBy', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Lookups', 'updatedBy', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Add columns to DownloadNotes table
    await queryInterface.addColumn('DownloadNotes', 'addedBy', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('DownloadNotes', 'updatedBy', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Add columns to Contact table
    await queryInterface.addColumn('Contacts', 'addedBy', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('Contacts', 'updatedBy', {
      type: Sequelize.STRING,
      allowNull: true
    });

    // Add columns to BuyerNotes table
    await queryInterface.addColumn('BuyerNotes', 'addedBy', {
      type: Sequelize.STRING,
      allowNull: true
    });
    await queryInterface.addColumn('BuyerNotes', 'updatedBy', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove columns from User table
    await queryInterface.removeColumn('User', 'addedBy');
    await queryInterface.removeColumn('User', 'updatedBy');

    // Remove columns from SoldNotes table
    await queryInterface.removeColumn('SoldNotes', 'addedBy');
    await queryInterface.removeColumn('SoldNotes', 'updatedBy');

    // Remove columns from Notes table
    await queryInterface.removeColumn('Notes', 'addedBy');
    await queryInterface.removeColumn('Notes', 'updatedBy');

    // Remove columns from Lookup table
    await queryInterface.removeColumn('Lookup', 'addedBy');
    await queryInterface.removeColumn('Lookup', 'updatedBy');

    // Remove columns from DownloadNotes table
    await queryInterface.removeColumn('DownloadNotes', 'addedBy');
    await queryInterface.removeColumn('DownloadNotes', 'updatedBy');

    // Remove columns from Contact table
    await queryInterface.removeColumn('Contact', 'addedBy');
    await queryInterface.removeColumn('Contact', 'updatedBy');

    // Remove columns from BuyerNotes table
    await queryInterface.removeColumn('BuyerNotes', 'addedBy');
    await queryInterface.removeColumn('BuyerNotes', 'updatedBy');
  }
};
