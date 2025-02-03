'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Notes', {
      fields: ['email'],
      type: 'foreign key',
      name: 'fk_notes_user_email', // optional, specify a custom constraint name
      references: {
        table: 'Users', // name of the target table
        field: 'email', // name of the target field
      },
      onDelete: 'CASCADE', // action on delete
      onUpdate: 'CASCADE', // action on update
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Notes', 'fk_notes_user_email');
  }
};
