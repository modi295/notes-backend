// routes/authRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/auth');
const { register, login, forgotPassword, getUser, updateUser, uploadProfilePicture, changePassword, getAllUsers,Admin,verifyEmail,sendOtpForLogin,verifyOtpLogin } = require('../controllers/authController');
const { contact } = require('../controllers/ContactController');
const { uploadNotes, uploadDisplayPicture, uploadNotesAttachment, uploadPreviewUpload, getAllPublishedNotes, getNotes, getPublishNotesByEmail, getSaveNotes, getNotesById, getAllNotes, deleteNoteById, updateNotes, getUnderReviewNotes, getAllRejectedNotes, getUnderReviewNotesByEmail, getUserNotesByEmail,getAllRejectedNotesByEmail } = require('../controllers/notesController');
const { getDownloadNotes, postDownloadNote, getSoldNotes, postSoldNote, getBuyerNotes, postBuyerNote, updateBuyerNote, getDownloadNotesById, getAllDownloadNotesById, getDownloadNotesByEmail,updateDownloadNote,getReviewFromDownloadNotesByNoteId ,getAllReportedDownloadNotes} = require('../controllers/downloadController');
const {createLookup,getAllLookups, getLookupById,updateLookup,deleteLookup} = require("../controllers/LookupController");
const { getNotesDashboardData,getAdminDashboardData } = require('../controllers/dashboardController');

const router = express.Router();
//Login related routes
router.post('/register',authMiddleware, register);
router.get('/users/:email', getUser);
router.get('/users', getAllUsers);
//router.put('/users/:email',updateUser );
//router.put('/users/:email', uploadProfilePicture, updateUser);
router.put('/users/:email', uploadProfilePicture, authMiddleware, updateUser);
router.post('/login', login);
router.post('/sendOtp', sendOtpForLogin);
router.post('/verifyOtp', verifyOtpLogin);
router.post('/forgotPassword', forgotPassword);
router.put('/changePassword', changePassword);
router.post('/contact', authMiddleware,contact);
router.post('/admin', authMiddleware, Admin);
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
router.get('/rejectedNotesByEmail/:email', getAllRejectedNotesByEmail);
router.put('/updateNotesStatus/:id',authMiddleware, updateNotes);
//router.put('/updateNotes/:id', uploadDisplayPicture, uploadNotesAttachment, uploadPreviewUpload, updateNotes);


router.get('/downloadnotes/:email', getDownloadNotes);
router.post('/downloadnotes', authMiddleware, postDownloadNote);
router.get('/downloadnotesbyId/:id', getDownloadNotesById);
router.get('/downloadnotes', getAllDownloadNotesById);
router.get('/downloadnotesbyemail/:email', getDownloadNotesByEmail);
router.put('/downloadNote/:id', authMiddleware, updateDownloadNote);
router.get('/reviewdownloadnotesbyId/:id', getReviewFromDownloadNotesByNoteId);
router.get('/reportednotes', getAllReportedDownloadNotes);

// Define routes for SoldNotes
router.get('/soldnotes/:email', getSoldNotes);
router.post('/soldnotes',authMiddleware, postSoldNote);

// Define routes for BuyerNotes
router.get('/buyernotes/:email', getBuyerNotes);
router.put('/buyernotes/:id', authMiddleware, updateBuyerNote);
router.post('/buyernotes', authMiddleware, postBuyerNote);

// Define routes for Lookup
router.post("/createLookup", authMiddleware, createLookup);
router.get("/getAllLookup", getAllLookups);
router.get("/getLookupById/:typeId", getLookupById);
router.put("/updateLookup/:typeId", authMiddleware, updateLookup);
router.delete("/deleteLookup/:typeId", deleteLookup);

//Define routes for Dashboard
router.get('/getDashboardData/:email', getNotesDashboardData);
router.get('/getAdminDashboardData', getAdminDashboardData);


module.exports = router;