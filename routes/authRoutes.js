// routes/authRoutes.js
const express = require('express');
const { register, login, forgotPassword, getUser,updateUser, uploadProfilePicture,changePassword} = require('../controllers/authController');
const { contact } = require('../controllers/ContactController');
const { uploadNotes, uploadDisplayPicture, uploadNotesAttachment, uploadPreviewUpload,getAllPublishedNotes ,getNotes, getPublishNotes,getSaveNotes,getNotesById,getAllNotes,deleteNoteById,updateNotes} = require('../controllers/notesController');
const { getDownloadNotes,  postDownloadNote, getSoldNotes, postSoldNote, getBuyerNotes, postBuyerNote,updateBuyerNote } = require('../controllers/downloadController');


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
router.get('/allpublishNotes',getAllPublishedNotes );
router.get('/saveNotes/:email', getSaveNotes);
router.get('/allNotes', getAllNotes);
router.delete('/deleteNote/:id', deleteNoteById);
//router.put('/updateNotes/:id', uploadDisplayPicture, uploadNotesAttachment, uploadPreviewUpload, updateNotes);


router.get('/downloadnotes/:email', getDownloadNotes);
router.post('/downloadnotes', postDownloadNote);

// Define routes for SoldNotes
router.get('/soldnotes/:email', getSoldNotes);
router.post('/soldnotes', postSoldNote);

// Define routes for BuyerNotes
router.get('/buyernotes/:email', getBuyerNotes);
router.put('/buyernotes/:id', updateBuyerNote);
router.post('/buyernotes', postBuyerNote);

module.exports = router;
