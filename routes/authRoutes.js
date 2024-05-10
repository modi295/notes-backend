// routes/authRoutes.js
const express = require('express');
const { register, login, forgotPassword, getUser,updateUser, uploadProfilePicture,changePassword} = require('../controllers/authController');
const { contact } = require('../controllers/ContactController');
const { uploadNotes, uploadDisplayPicture, uploadNotesAttachment, uploadPreviewUpload ,getNotes, getPublishNotes,getSaveNotes,getNotesById,getAllNotes,deleteNoteById,updateNotes} = require('../controllers/notesController');

const router = express.Router();
//Login related routes
router.post('/register', register);
router.get('/users/:email', getUser);
// router.put('/users/:email',updateUser );
router.put('/users/:email', uploadProfilePicture, updateUser);
router.post('/login', login);
router.post('/forgotPassword',forgotPassword );
router.put('/changePassword', changePassword); 
router.post('/contact', contact);

//Notes related routes

//router.post('/uploadNotes', uploadDisplayPicture, uploadNotesAttachment, uploadPreviewUpload, uploadNotes);
router.get('/notes/:email',getNotes );
router.get('/notesById/:id',getNotesById );
router.get('/publishNotes/:email',getPublishNotes );
router.get('/saveNotes/:email', getSaveNotes);
router.get('/allNotes', getAllNotes);
router.delete('/deleteNote/:id', deleteNoteById);
//router.put('/updateNotes/:id', uploadDisplayPicture, uploadNotesAttachment, uploadPreviewUpload, updateNotes);


module.exports = router;
