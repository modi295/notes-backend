'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Notes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      noteTitle: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      category: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      displayPicture: {
        type: Sequelize.BLOB,
      },
      notesAttachment: {
        type: Sequelize.BLOB,
        allowNull: false,
      },
      notesType: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      numberOfPages: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      notesDescription: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      universityInformation: {
        type: Sequelize.STRING(200),
      },
      country: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      courseInformation: {
        type: Sequelize.STRING(100),
      },
      courseCode: {
        type: Sequelize.STRING(100),
      },
      professorLecturer: {
        type: Sequelize.STRING(100),
      },
      sellFor: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      sellPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0,
      },
      previewUpload: {
        type: Sequelize.BLOB,
      },
      statusFlag: {
        type: Sequelize.STRING(3),
      },
      publishFlag: {
        type: Sequelize.STRING(3),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Notes');
  }
};
