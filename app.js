const sequelize = require('./db');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');


async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    await sequelize.sync(); // Sync models with the database
    console.log('Models synchronized with the database.');

    // Your application logic here
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


initializeDatabase();
