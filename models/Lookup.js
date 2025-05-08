const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Lookup = sequelize.define('Lookup', {
  typeId: {
    type: DataTypes.STRING(6),
    allowNull: false,
    primaryKey: true, 
  },
  typeCode: {
    type: DataTypes.STRING(6),
    allowNull: true, 
  },
  typeName: {
    type: DataTypes.STRING(40),
    allowNull: true,
  },
    addedBy: {
        type: DataTypes.STRING,
        allowNull: true
    },
    updatedBy: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, 
{
  timestamps: true,
});

module.exports = Lookup;
