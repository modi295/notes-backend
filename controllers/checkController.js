const express = require('express');
const multer = require('multer');
const Notes = require('../models/Notes');
const router = express.Router();


// Multer disk storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Set destination folder based on file type
        if (file.fieldname === 'displayPictureP') {
            cb(null,  'uploads/images');
        } else {
            cb(null,  'uploads/pdfs');
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original filename
    }
});

// Multer upload instance
const upload = multer({ storage: storage });

// POST endpoint for uploading a note
router.post('/upload', upload.fields([
    { name: 'displayPictureP', maxCount: 1 },
    { name: 'notesAttachmentP', maxCount: 1 },
    { name: 'previewUploadP', maxCount: 1 }
]), async (req, res) => {
    try {
        // Create a new note instance with request body and file paths
        const newNote = await Notes.create({
            email: req.body.email,
            noteTitle: req.body.noteTitle,
            category: req.body.category,
            displayPictureP: req.files['displayPictureP'] ? "http://localhost:5000/uploads/images/"+req.files['displayPictureP'][0].originalname : null,
            notesAttachmentP: req.files['notesAttachmentP'] ? "http://localhost:5000/uploads/pdfs/"+req.files['notesAttachmentP'][0].originalname : null,
            notesType: req.body.notesType,
            numberOfPages: req.body.numberOfPages,
            notesDescription: req.body.notesDescription,
            universityInformation: req.body.universityInformation,
            country: req.body.country,
            courseInformation: req.body.courseInformation,
            courseCode: req.body.courseCode,
            professorLecturer: req.body.professorLecturer,
            sellFor: req.body.sellFor,
            sellPrice: req.body.sellPrice,
            previewUploadP: req.files['previewUploadP'] ? "http://localhost:5000/uploads/pdfs/"+req.files['previewUploadP'][0].originalname : null,
            statusFlag: req.body.statusFlag,
            publishFlag: req.body.publishFlag
        });

        // Send response
        res.status(201).json(newNote);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/updateNotes/:id', upload.fields([
    { name: 'displayPictureP', maxCount: 1 },
    { name: 'notesAttachmentP', maxCount: 1 },
    { name: 'previewUploadP', maxCount: 1 }
]), async (req, res) => {
    try {
        const noteId = req.params.id;
        const {
            email,
            noteTitle,
            category,
            notesType,
            numberOfPages,
            notesDescription,
            universityInformation,
            country,
            courseInformation,
            courseCode,
            professorLecturer,
            sellFor,
            sellPrice,
            statusFlag,
            publishFlag,
            displayPictureP,
            notesAttachmentP,
            previewUploadP
        } = req.body;
        
        // Find the note by ID
        const existingNote = await Notes.findOne({ where: { id: noteId } });
        if (!existingNote) {
            return res.status(404).json({ error: 'Note not found' });
        }

        // Update the note fields
        existingNote.email = email;
        existingNote.noteTitle = noteTitle;
        existingNote.category = category;
        existingNote.notesType = notesType;
        existingNote.numberOfPages = numberOfPages;
        existingNote.notesDescription = notesDescription;
        existingNote.universityInformation = universityInformation;
        existingNote.country = country;
        existingNote.courseInformation = courseInformation;
        existingNote.courseCode = courseCode;
        existingNote.professorLecturer = professorLecturer;
        existingNote.sellFor = sellFor;
        existingNote.sellPrice = sellPrice;
        existingNote.statusFlag = statusFlag;
        existingNote.publishFlag = publishFlag;

        // Update file paths if files are provided in the request
        if (req.files['displayPictureP']) {
            existingNote.displayPictureP = "http://localhost:5000/uploads/images/" + req.files['displayPictureP'][0].originalname;
        }
        if (req.files['notesAttachmentP']) {
            existingNote.notesAttachmentP = "http://localhost:5000/uploads/pdfs/" + req.files['notesAttachmentP'][0].originalname;
        }
        if (req.files['previewUploadP']) {
            existingNote.previewUploadP = "http://localhost:5000/uploads/pdfs/" + req.files['previewUploadP'][0].originalname;
        }

        // Save the updated note
        const updatedNote = await existingNote.save();

        // Send a success response with the updated note
        res.status(200).json(updatedNote);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
