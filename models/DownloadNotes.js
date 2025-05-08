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
    rating: {
        type: DataTypes.STRING(1),
        allowNull: true
    },
    comment: {
        type: DataTypes.STRING(40),
        allowNull: true
    },
    ReportRemark: {
        type: DataTypes.STRING(60),
        allowNull: true
    },
    addedBy: {
        type: DataTypes.STRING,
        allowNull: true
    },
    updatedBy: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
});

User.hasMany(DownloadNotes, { foreignKey: 'email' });
DownloadNotes.belongsTo(User, { foreignKey: 'email' });
Notes.hasMany(DownloadNotes, { foreignKey: 'noteId' });
DownloadNotes.belongsTo(Notes, { foreignKey: 'noteId' });

module.exports = DownloadNotes;
