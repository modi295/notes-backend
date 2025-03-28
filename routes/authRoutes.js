// routes/authRoutes.js
const express = require('express');
const { register, login, forgotPassword, getUser, updateUser, uploadProfilePicture, changePassword, getAllUsers,Admin,verifyEmail } = require('../controllers/authController');
const { contact } = require('../controllers/ContactController');
const { uploadNotes, uploadDisplayPicture, uploadNotesAttachment, uploadPreviewUpload, getAllPublishedNotes, getNotes, getPublishNotesByEmail, getSaveNotes, getNotesById, getAllNotes, deleteNoteById, updateNotes, getUnderReviewNotes, getAllRejectedNotes, getUnderReviewNotesByEmail, getUserNotesByEmail } = require('../controllers/notesController');
const { getDownloadNotes, postDownloadNote, getSoldNotes, postSoldNote, getBuyerNotes, postBuyerNote, updateBuyerNote, getDownloadNotesById, getAllDownloadNotesById, getDownloadNotesByEmail } = require('../controllers/downloadController');
const {createLookup,getAllLookups, getLookupById,updateLookup,deleteLookup} = require("../controllers/LookupController");
const { getNotesDashboardData } = require('../controllers/dashboardController');



const router = express.Router();
//Login related routes
router.post('/register', register);
router.get('/users/:email', getUser);
router.get('/users', getAllUsers);
// router.put('/users/:email',updateUser );
router.put('/users/:email', uploadProfilePicture, updateUser);
router.post('/login', login);
router.post('/forgotPassword', forgotPassword);
router.put('/changePassword', changePassword);
router.post('/contact', contact);
router.post('/admin', Admin);
router.post('/verifyEmail/:token', verifyEmail);


//Notes related routes
//router.post('/uploadNotes', uploadDisplayPicture, uploadNotesAttachment, uploadPreviewUpload, uploadNotes);
router.get('/notes/:email', getNotes);
router.get('/notesById/:id', getNotesById);
router.get('/publishNotes/:email', getPublishNotesByEmail);
router.get('/allpublishNotes', getAllPublishedNotes);
router.get('/saveNotes/:email', getSaveNotes);
router.get('/allNotes', getAllNotes);
router.delete('/deleteNote/:id', deleteNoteById);
router.get('/underReviewNotes', getUnderReviewNotes);
router.get('/rejectedNotes', getAllRejectedNotes);
router.get('/underReviewNotes/:email', getUnderReviewNotesByEmail);
router.get('/getUserNotesByEmail/:email', getUserNotesByEmail);

router.put('/updateNotesStatus/:id', updateNotes);
//router.put('/updateNotes/:id', uploadDisplayPicture, uploadNotesAttachment, uploadPreviewUpload, updateNotes);


router.get('/downloadnotes/:email', getDownloadNotes);
router.post('/downloadnotes', postDownloadNote);
router.get('/downloadnotesbyId/:id', getDownloadNotesById);
router.get('/downloadnotes', getAllDownloadNotesById);
router.get('/downloadnotesbyemail/:email', getDownloadNotesByEmail);

// Define routes for SoldNotes
router.get('/soldnotes/:email', getSoldNotes);
router.post('/soldnotes', postSoldNote);

// Define routes for BuyerNotes
router.get('/buyernotes/:email', getBuyerNotes);
router.put('/buyernotes/:id', updateBuyerNote);
router.post('/buyernotes', postBuyerNote);

// Define routes for Lookup
router.post("/createLookup", createLookup);
router.get("/getAllLookup", getAllLookups);
router.get("/getLookupById/:typeId", getLookupById);
router.put("/updateLookup/:typeId", updateLookup);
router.delete("/deleteLookup/:typeId", deleteLookup);

//Define routes for Dashboard
router.get('/getDashboardData/:email', getNotesDashboardData);

module.exports = router;