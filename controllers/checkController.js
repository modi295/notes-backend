const express = require('express');
const multer = require('multer');
const Notes = require('../models/Notes');
const User = require('../models/User');
const Support = require('../models/Support');
const router = express.Router();
const transporter = require("../Utility/emailService");
const authMiddleware = require('../middleware/auth');

// Multer disk storage configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'displayPictureP'||file.fieldname === 'noteImage'||file.fieldname === 'profilePicture') {
            cb(null, 'uploads/images');
        } else {
            cb(null, 'uploads/pdfs');
        }
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original filename
    }
});

// Multer upload instance
const upload = multer({ storage: storage });
  
router.post('/upload',authMiddleware, upload.fields([
    { name: 'displayPictureP', maxCount: 1 },
    { name: 'notesAttachmentP', maxCount: 10 },//maxCount as 1 if you take signal attachment
    { name: 'previewUploadP', maxCount: 1 }
]), async (req, res) => {
    try {
        // Create a new note instance with request body and file paths
        console.log(req.body);
        const newNote = await Notes.create({
            email: req.body.email,
            noteTitle: req.body.noteTitle,
            category: req.body.category,
            displayPictureP: req.files['displayPictureP'] ? "http://localhost:5000/uploads/images/" + req.files['displayPictureP'][0].originalname : null,
            //notesAttachmentP: req.files['notesAttachmentP'] ? "http://localhost:5000/uploads/pdfs/" + req.files['notesAttachmentP'][0].originalname : null, //for singal attachment
            notesAttachmentP: req.files['notesAttachmentP']  ? req.files['notesAttachmentP'].map(file => "http://localhost:5000/uploads/pdfs/" + file.originalname).join(','): null,
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
            previewUploadP: req.files['previewUploadP'] ? "http://localhost:5000/uploads/pdfs/" + req.files['previewUploadP'][0].originalname : null,
            statusFlag: req.body.statusFlag,
            publishFlag: req.body.publishFlag,
            addedBy:req.fullName
        });

        if ( req.body.statusFlag === 'P') {
    
        const user = await User.findOne({ where: { email: req.body.email } });

        const userName = user && user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'User';
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER, 
                subject: `${userName} sent his note for review`,
                text: `Hello Admins,\n\nWe want to inform you that ${userName} sent his note "${req.body.noteTitle}" for review. Please look at the notes and take required actions.\n\nRegards,\nNotes Marketplace`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error sending approval email:', error);
                } else {
                    console.log('Approval email sent:', info.response);
                }
            });
        }
        res.status(201).json(newNote);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/updateNotes/:id', authMiddleware, upload.fields([
    { name: 'displayPictureP', maxCount: 1 },
    { name: 'notesAttachmentP', maxCount: 10 }, // allow multiple PDFs
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
            remark,
            displayPictureP,
            notesAttachmentP,
            previewUploadP
        } = req.body;

        const existingNote = await Notes.findOne({ where: { id: noteId } });
        if (!existingNote) return res.status(404).json({ error: 'Note not found' });

        // Update fields
        existingNote.email = email;
        existingNote.noteTitle = noteTitle;
        existingNote.category = category;
        existingNote.notesType = notesType;
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
        existingNote.remark = remark;
        existingNote.updatedBy = req.fullName;

        let numberOfPagesToUpdate = req.body.numberOfPages;
        if (numberOfPagesToUpdate === 'undefined' || numberOfPagesToUpdate === undefined) {
            numberOfPagesToUpdate = existingNote.numberOfPages;
        }
        existingNote.numberOfPages = numberOfPagesToUpdate;

        // Display Picture
        if (req.files?.['displayPictureP']) {
            existingNote.displayPictureP = "http://localhost:5000/uploads/images/" + req.files['displayPictureP'][0].originalname;
        } else if (displayPictureP && displayPictureP !== 'undefined'&& displayPictureP !== '[object FileList]') {
            existingNote.displayPictureP = displayPictureP;
        }

        // Notes Attachment (Multiple PDFs)
        if (req.files?.['notesAttachmentP']) {
            existingNote.notesAttachmentP = req.files['notesAttachmentP']
                .map(file => "http://localhost:5000/uploads/pdfs/" + file.originalname)
                .join(',');
        } else if (notesAttachmentP && notesAttachmentP !== 'undefined') {
            existingNote.notesAttachmentP = notesAttachmentP;
        }

        // Preview Upload
        if (req.files?.['previewUploadP']) {
            existingNote.previewUploadP = "http://localhost:5000/uploads/pdfs/" + req.files['previewUploadP'][0].originalname;
        } else if (previewUploadP && previewUploadP !== 'undefined'&& previewUploadP !== '[object FileList]') {
            existingNote.previewUploadP = previewUploadP;
        }
        

        const updatedNote = await existingNote.save();

        const user = await User.findOne({ where: { email } });
        const userName = user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 'User';

        if (statusFlag === 'P') {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: process.env.EMAIL_USER,
                subject: `${userName} sent his note for review`,
                text: `Hello Admins,\n\nWe want to inform you that ${userName} sent his note "${noteTitle}" for review. Please look at the notes and take required actions.\n\nRegards,\nNotes Marketplace`
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) console.error('Error sending approval email:', error);
                else console.log('Approval email sent:', info.response);
            });
        }

        res.status(200).json(updatedNote);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


// router.put('/updateNotes/:id',authMiddleware, upload.fields([
//     { name: 'displayPictureP', maxCount: 1 },
//     { name: 'notesAttachmentP', maxCount: 1 },
//     { name: 'previewUploadP', maxCount: 1 }
// ]), async (req, res) => {
//     try {
//         const noteId = req.params.id;
//         const {
//             email,
//             noteTitle,
//             category,
//             notesType,
//             numberOfPages,
//             notesDescription,
//             universityInformation,
//             country,
//             courseInformation,
//             courseCode,
//             professorLecturer,
//             sellFor,
//             sellPrice,
//             statusFlag,
//             publishFlag,
//             remark,
//             displayPictureP,
//             notesAttachmentP,
//             previewUploadP
//         } = req.body;
//         console.log(req.body);
//         // Find the note by ID
//         const existingNote = await Notes.findOne({ where: { id: noteId } });
//         if (!existingNote) {
//             return res.status(404).json({ error: 'Note not found' });
//         }

//         // Update the note fields
//         existingNote.email = email;
//         existingNote.noteTitle = noteTitle;
//         existingNote.category = category;
//         existingNote.notesType = notesType;
//         existingNote.notesDescription = notesDescription;
//         existingNote.universityInformation = universityInformation;
//         existingNote.country = country;
//         existingNote.courseInformation = courseInformation;
//         existingNote.courseCode = courseCode;
//         existingNote.professorLecturer = professorLecturer;
//         existingNote.sellFor = sellFor;
//         existingNote.sellPrice = sellPrice;
//         existingNote.statusFlag = statusFlag;
//         existingNote.publishFlag = publishFlag;
//         existingNote.remark = remark;
//         existingNote.updatedBy = req.fullName;

//         let numberOfPagesToUpdate = req.body.numberOfPages;

//         if (numberOfPagesToUpdate === 'undefined' || numberOfPagesToUpdate === undefined) {
//             numberOfPagesToUpdate = existingNote.numberOfPages;
//         }
//         if (req.files && req.files['displayPictureP']) {
//             existingNote.displayPictureP = "http://localhost:5000/uploads/images/" + req.files['displayPictureP'][0].originalname;
//         } else if (displayPictureP && displayPictureP !== 'undefined') {
//             existingNote.displayPictureP = displayPictureP;
//         }

//         if (req.files && req.files['notesAttachmentP']) {
//             existingNote.notesAttachmentP = "http://localhost:5000/uploads/pdfs/" + req.files['notesAttachmentP'][0].originalname;
//         } else if (notesAttachmentP && notesAttachmentP !== 'undefined') {
//             existingNote.notesAttachmentP = notesAttachmentP;
//         }

//         if (req.files && req.files['previewUploadP']) {
//             existingNote.previewUploadP = "http://localhost:5000/uploads/pdfs/" + req.files['previewUploadP'][0].originalname;
//         } else if (previewUploadP && previewUploadP !== 'undefined') {
//             existingNote.previewUploadP = previewUploadP;
//         }

//         // Save the updated note
//         const updatedNote = await existingNote.save();
//         const user = await User.findOne({ where: { email: email } });

//         const userName = user && user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : 'User';

//         if (statusFlag === 'P') {
//             const mailOptions = {
//                 from: process.env.EMAIL_USER,
//                 to: process.env.EMAIL_USER, 
//                 subject: `${userName} sent his note for review`,
//                 text: `Hello Admins,\n\nWe want to inform you that ${userName} sent his note "${noteTitle}" for review. Please look at the notes and take required actions.\n\nRegards,\nNotes Marketplace`
//             };

//             transporter.sendMail(mailOptions, (error, info) => {
//                 if (error) {
//                     console.error('Error sending approval email:', error);
//                 } else {
//                     console.log('Approval email sent:', info.response);
//                 }
//             });
//         }

//         // Send a success response with the updated note
//         res.status(200).json(updatedNote);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

router.get('/support', async (req, res) => {
    try {
        const supportData = await Support.findOne();
        if (!supportData) {
            return res.status(404).json({ error: 'Support info not found' });
        }
        res.status(200).json(supportData);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

router.put('/support', authMiddleware, upload.fields([
    { name: 'noteImage', maxCount: 1 },
    { name: 'profilePicture', maxCount: 1 }
]), async (req, res) => {
    try {
        let supportRecord = await Support.findOne();

        if (!supportRecord) {
            supportRecord = await Support.create({});
        }

        const {
            supportEmail,
            supportPhone,
            emailAddress,
            facebookUrl,
            twitterUrl,
            linkedinUrl
        } = req.body;

        supportRecord.supportEmail = supportEmail;
        supportRecord.supportPhone = supportPhone;
        supportRecord.emailAddress = emailAddress;
        supportRecord.facebookUrl = facebookUrl;
        supportRecord.twitterUrl = twitterUrl;
        supportRecord.linkedinUrl = linkedinUrl;
        supportRecord.updatedBy = req.fullName;

        if (req.files && req.files['noteImage']) {
            supportRecord.noteImage = `http://localhost:5000/uploads/images/${req.files['noteImage'][0].originalname}`;
        } else if (req.body.noteImage && req.body.noteImage !== 'undefined') {
            supportRecord.noteImage = req.body.noteImage;
        }

        if (req.files && req.files['profilePicture']) {
            supportRecord.profilePicture = `http://localhost:5000/uploads/images/${req.files['profilePicture'][0].originalname}`;
        } else if (req.body.profilePicture && req.body.profilePicture !== 'undefined') {
            supportRecord.profilePicture = req.body.profilePicture;
        }

        await supportRecord.save();
        res.status(200).json(supportRecord); 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' }); 
    }
});


module.exports = router;
