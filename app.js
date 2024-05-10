const sequelize = require('./db');
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const check =require('./controllers/checkController');
const bodyParser = require('body-parser');


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
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cors());
app.use(express.json());

app.use('/api', authRoutes,check);
app.use('/uploads', express.static('uploads'));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


initializeDatabase();
