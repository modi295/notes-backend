
const Notes = require('../models/Notes');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })



// const imageFilter = (file, cb) => {
//     if (file.mimetype.startsWith('image/png')) {
//         cb(null, true);
//     } else {
//         cb(new Error('Only images are allowed'));
//     }
// };

// const pdfFilter = (file, cb) => {
//     if (file.mimetype === 'application/pdf') {
//         cb(null, true);
//     } else {
//         cb(new Error('Only PDF files are allowed'));
//     }
// };

// const uploadImage = multer({ storage, fileFilter: imageFilter });

// const uploadPDF = multer({ storage, fileFilter: pdfFilter });

async function uploadDisplayPicture(req, res, next) {
    upload.single('displayPicture')(req, res, err => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(500).json({ error: err.message });
        }
        next();
    });
}

async function uploadNotesAttachment(req, res, next) {
    upload.single('notesAttachment')(req, res, err => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(500).json({ error: err.message });
        }
        next();
    });
}

async function uploadPreviewUpload(req, res, next) {
    upload.single('previewUpload')(req, res, err => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ error: err.message });
        } else if (err) {
            return res.status(500).json({ error: err.message });
        }
        next();
    });
}

async function uploadNotes(req, res) {
    console.log(req);
    try {
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
            displayPicture,
            notesAttachment,
            previewUpload
        } = req.body;
        //       console.log(req.file)
        //   if (!req.file || !req.file.notesAttachment) {
        //     throw new Error("Notes attachment is missing");
        //   }

        //   const displayPicture = req.file.displayPicture ? req.file.displayPicture[0].buffer : null;
        //   const notesAttachment = req.file.notesAttachment ?req.file.notesAttachment[0].buffer: null;;
        //   const previewUpload = req.file.previewUpload ? req.file.previewUpload[0].buffer : null;
        const newNote = await Notes.create({
            email,
            noteTitle,
            category,
            displayPicture,
            notesAttachment,
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
            previewUpload,
            statusFlag,
            publishFlag
        });

        // Send a success response with the created note
        res.status(201).json({ success: true, data: newNote });
    } catch (error) {
        // Send an error response if something goes wrong
        console.error(error);
        res.status(500).json({ success: false, error: error });
    }
}


module.exports = { uploadNotes, uploadDisplayPicture, uploadNotesAttachment, uploadPreviewUpload };


