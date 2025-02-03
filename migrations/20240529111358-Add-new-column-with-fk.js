'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Add new columns to DownloadNotes
        // await queryInterface.addColumn('DownloadNotes', 'purchaseEmail', {
        //     type: Sequelize.STRING(100),
        //     allowNull: true
        // });
        // await queryInterface.addColumn('DownloadNotes', 'buyerEmail', {
        //     type: Sequelize.STRING(100),
        //     allowNull: true
        // });

        // // Add new columns to SoldNotes
        // await queryInterface.addColumn('SoldNotes', 'purchaseEmail', {
        //     type: Sequelize.STRING(100),
        //     allowNull: true
        // });
        // await queryInterface.addColumn('SoldNotes', 'buyerEmail', {
        //     type: Sequelize.STRING(100),
        //     allowNull: true
        // });

        // // Add new columns to BuyerNotes
        // await queryInterface.addColumn('BuyerNotes', 'purchaseEmail', {
        //     type: Sequelize.STRING(100),
        //     allowNull: true
        // });
        // await queryInterface.addColumn('BuyerNotes', 'buyerEmail', {
        //     type: Sequelize.STRING(100),
        //     allowNull: true
        // });

        // Add foreign key constraints
        await queryInterface.addConstraint('DownloadNotes', {
            fields: ['noteId'],
            type: 'foreign key',
            name: 'fk_downloadnotes_noteId',
            references: {
                table: 'Notes',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        await queryInterface.addConstraint('SoldNotes', {
            fields: ['noteId'],
            type: 'foreign key',
            name: 'fk_soldnotes_noteId',
            references: {
                table: 'Notes',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
        await queryInterface.addConstraint('BuyerNotes', {
            fields: ['noteId'],
            type: 'foreign key',
            name: 'fk_buyernotes_noteId',
            references: {
                table: 'Notes',
                field: 'id'
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE'
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Remove added columns from DownloadNotes
        await queryInterface.removeColumn('DownloadNotes', 'purchaseEmail');
        await queryInterface.removeColumn('DownloadNotes', 'buyerEmail');

        // Remove added columns from SoldNotes
        await queryInterface.removeColumn('SoldNotes', 'purchaseEmail');
        await queryInterface.removeColumn('SoldNotes', 'buyerEmail');

        // Remove added columns from BuyerNotes
        await queryInterface.removeColumn('BuyerNotes', 'purchaseEmail');
        await queryInterface.removeColumn('BuyerNotes', 'buyerEmail');

        // Remove foreign key constraints
        await queryInterface.removeConstraint('DownloadNotes', 'fk_downloadnotes_noteId');
        await queryInterface.removeConstraint('SoldNotes', 'fk_soldnotes_noteId');
        await queryInterface.removeConstraint('BuyerNotes', 'fk_buyernotes_noteId');
    }
};
