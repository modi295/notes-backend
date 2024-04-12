'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'dob', {
      type: Sequelize.DATEONLY,
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'gender', {
      type: Sequelize.STRING(8),
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'phoneNumberCode', {
      type: Sequelize.STRING(5),
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'phoneNumber', {
      type: Sequelize.STRING(20),
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'profilePicture', {
      type: Sequelize.BLOB('long'),
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'address1', {
      type: Sequelize.STRING(100),
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'address2', {
      type: Sequelize.STRING(100),
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'city', {
      type: Sequelize.STRING(50),
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'state', {
      type: Sequelize.STRING(50),
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'zipCode', {
      type: Sequelize.STRING(50),
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'country', {
      type: Sequelize.STRING(30),
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'university', {
      type: Sequelize.STRING(100),
      allowNull: true
    });

    await queryInterface.addColumn('Users', 'college', {
      type: Sequelize.STRING(100),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'dob');
    await queryInterface.removeColumn('Users', 'gender');
    await queryInterface.removeColumn('Users', 'phoneNumberCode');
    await queryInterface.removeColumn('Users', 'phoneNumber');
    await queryInterface.removeColumn('Users', 'profilePicture');
    await queryInterface.removeColumn('Users', 'address1');
    await queryInterface.removeColumn('Users', 'address2');
    await queryInterface.removeColumn('Users', 'city');
    await queryInterface.removeColumn('Users', 'state');
    await queryInterface.removeColumn('Users', 'zipCode');
    await queryInterface.removeColumn('Users', 'country');
    await queryInterface.removeColumn('Users', 'university');
    await queryInterface.removeColumn('Users', 'college');
  }
};
