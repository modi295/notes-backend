'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Supports', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      supportEmail: {
        type: Sequelize.STRING(60),
        allowNull: true,
      },
      supportPhone: {
        type: Sequelize.STRING(10),
        allowNull: true,
      },
      emailAddress: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      facebookUrl: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },
      twitterUrl: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },
      linkedinUrl: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },
      noteImage: {
        type: Sequelize.STRING(350),
        allowNull: true,
      },
      profilePicture: {
        type: Sequelize.STRING(350),
        allowNull: true,
      },
      addedBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      updatedBy: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Supports');
  }
};
