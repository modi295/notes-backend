const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Contact = sequelize.define('Contact', {
  fullName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  comment: {
    type: DataTypes.STRING,
    allowNull: false,
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

module.exports = Contact;
