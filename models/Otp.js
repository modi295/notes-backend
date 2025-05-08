const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const OTP = sequelize.define('OTP', {
  email: {
    type: DataTypes.STRING(70),
    allowNull: false,
  },
  otp: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  expiredAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  timestamps: true, 
});

module.exports = OTP;
