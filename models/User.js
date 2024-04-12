const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dob: {
    type: DataTypes.DATEONLY,
    allowNull: true 
  },
  gender: {
    type: DataTypes.STRING(8),
    allowNull: true 
  },
  phoneNumberCode: {
    type: DataTypes.STRING(5),
    allowNull: true 
  },
  phoneNumber: {
    type: DataTypes.STRING(20),
    allowNull: true 
  },
  profilePicture: {
    type: DataTypes.BLOB,
    allowNull: true 
  },
  address1: {
    type: DataTypes.STRING(100),
    allowNull: true 
  },
  address2: {
    type: DataTypes.STRING(100),
    allowNull: true 
  },
  city: {
    type: DataTypes.STRING(50),
    allowNull: true 
  },
  state: {
    type: DataTypes.STRING(50),
    allowNull: true 
  },
  zipCode: {
    type: DataTypes.STRING(50),
    allowNull: true 
  },
  country: {
    type: DataTypes.STRING(30),
    allowNull: true 
  },
  university: {
    type: DataTypes.STRING(100),
    allowNull: true 
  },
  college: {
    type: DataTypes.STRING(100),
    allowNull: true 
  }
});

module.exports = User;
