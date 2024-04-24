// routes/authRoutes.js
const express = require('express');
const { register, login, forgotPassword, getUser,updateUser, uploadProfilePicture,changePassword} = require('../controllers/authController');
const { contact } = require('../controllers/ContactController');
const { uploadNotes, uploadDisplayPicture, uploadNotesAttachment, uploadPreviewUpload } = require('../controllers/notesController');

const router = express.Router();

router.post('/register', register);
router.get('/users/:email', getUser);
// router.put('/users/:email',updateUser );
router.put('/users/:email', uploadProfilePicture, updateUser);
router.post('/login', login);
router.post('/forgotPassword',forgotPassword );
router.put('/changePassword', changePassword); 
router.post('/contact', contact);
router.post('/uploadNotes', uploadDisplayPicture, uploadNotesAttachment, uploadPreviewUpload, uploadNotes);

module.exports = router;
