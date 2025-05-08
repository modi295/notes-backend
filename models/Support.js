const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Support = sequelize.define('Support', {
  supportEmail: {
    type: DataTypes.STRING(60),
    allowNull: true,
  },
  supportPhone: {
    type: DataTypes.STRING(10),
    allowNull: true,
  },
  emailAddress: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  facebookUrl: {
    type: DataTypes.STRING(120),
    allowNull: true,
  },
  twitterUrl: {
    type: DataTypes.STRING(120),
    allowNull: true,
  },
  linkedinUrl: {
    type: DataTypes.STRING(120),
    allowNull: true,
  },
  noteImage: {
    type: DataTypes.STRING(350),
    allowNull: true,
  },
  profilePicture: {
    type: DataTypes.STRING(350),
    allowNull: true,
  },
  addedBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  updatedBy: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  timestamps: true,
  tableName: 'Supports',
});

module.exports = Support;
