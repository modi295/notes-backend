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

    require('./Utility/CleanOtp');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type, Authorization',
  maxAge: 3600
};
app.use(cors(corsOptions));
app.use(express.json());
require("dotenv").config();

app.use('/api', authRoutes,check);
app.use('/uploads', express.static('uploads'));
app.use('/updateNotes/:id', express.static('uploads'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


initializeDatabase();
