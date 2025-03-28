const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Notes = require('./Notes');


const DownloadNotes = sequelize.define('DownloadNotes', {
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        references: {
            model: User,
            key: 'email'
        }
    },
    purchaseEmail: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    buyerEmail: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    noteId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Notes,
            key: 'id'
        }
    },
    noteTitle: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    sellFor: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
    sellPrice: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    PurchaseTypeFlag: {
        type: DataTypes.STRING(5),
    },
}, {
    timestamps: true,
});

User.hasMany(DownloadNotes, { foreignKey: 'email' });
DownloadNotes.belongsTo(User, { foreignKey: 'email' });
Notes.hasMany(DownloadNotes, { foreignKey: 'noteId' });
DownloadNotes.belongsTo(Notes, { foreignKey: 'noteId' });

module.exports = DownloadNotes;
