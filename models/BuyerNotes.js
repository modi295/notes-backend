const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User'); 
const Notes = require('./Notes');


const BuyerNotes = sequelize.define('BuyerNotes', {
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
    approveFlag: {  
        type: DataTypes.STRING(1),
        allowNull: true, 
    }
}, {
    timestamps: true,
});

User.hasMany(BuyerNotes, { foreignKey: 'email' });
BuyerNotes.belongsTo(User, { foreignKey: 'email' });
Notes.hasMany(BuyerNotes, { foreignKey: 'noteId' });
BuyerNotes.belongsTo(Notes, { foreignKey: 'noteId' });

module.exports =  BuyerNotes;
