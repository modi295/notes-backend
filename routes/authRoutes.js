// routes/authRoutes.js
const express = require('express');
const { register, login, forgotPassword, getUser,updateUser} = require('../controllers/authController');
const { contact } = require('../controllers/ContactController');

const router = express.Router();

router.post('/register', register);
router.get('/users/:email', getUser);
router.put('/users/:email',updateUser );

router.post('/login', login);
router.post('/forgotPassword',forgotPassword );
router.post('/contact', contact);

module.exports = router;
