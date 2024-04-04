
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: 'localhost',
  port: 5432,
  database: 'NotesApplication',
  username: 'postgres',
  password: 'Online',
});

module.exports = sequelize;