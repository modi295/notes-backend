const { Op, Sequelize } = require('sequelize');  // Add this line
const Notes = require('../models/Notes');
const User = require('../models/User');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


async function uploadDisplayPicture(req, res, next) {
  console.log(req);
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

async function getAllNotes(req, res) {
  try {
    const allNotes = await Notes.findAll();
    if (!allNotes || allNotes.length === 0) {
      return res.status(404).json({ message: 'No notes found' });
    }

    res.status(200).json(allNotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function getNotes(req, res) {
  const email = req.params.email;
  try {
    const userNotes = await Notes.findAll({ where: { email } }); // Find notes by user's email
    if (!userNotes || userNotes.length === 0) {
      return res.status(404).json({ message: 'No notes found for this user' });
    }

    res.status(200).json(userNotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


async function getNotesById(req, res) {
  const noteId = req.params.id;

  try {
    const note = await Notes.findOne({
      where: { id: noteId }, 
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT COUNT(DISTINCT dn."email")
              FROM "DownloadNotes" AS dn
              WHERE dn."noteId" = "Notes".id AND dn."ReportRemark" IS NOT NULL
            )`),
            'reportCount'
          ]
        ]
      }
    });

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error('Error fetching note by ID:', error);
    res.status(500).json({ error: error.message });
  }
}



// async function getNotesById(req, res) {
//   const noteId = req.params.id; // Assuming the ID is passed in the request parameter 'id'

//   try {
//     const note = await Notes.findByPk(noteId); // Find note by its ID (primary key)

//     if (!note) {
//       return res.status(404).json({ message: 'Note not found' });
//     }

//     const sanitizedNote = {
//       noteTitle: note.noteTitle,
//       category: note.category,
//       notesType: note.notesType,
//       numberOfPages: note.numberOfPages,
//       notesDescription: note.notesDescription,
//       universityInformation: note.universityInformation,
//       country: note.country,
//       courseInformation: note.courseInformation,
//       courseCode: note.courseCode,
//       professorLecturer: note.professorLecturer,
//       sellFor: note.sellFor,
//       sellPrice: note.sellPrice,
//       statusFlag: note.statusFlag,
//       publishFlag: note.publishFlag
//     };

//     // Handling image fields
//     if (note.displayPicture) {
//       sanitizedNote.displayPicture = Buffer.from(note.displayPicture).toString('base64');
//     }
//     if (note.previewUpload) {
//       // Assuming previewUpload stores PDF data
//       sanitizedNote.previewUpload = {
//         data: Buffer.from(note.previewUpload).toString('base64'),
//         contentType: 'application/pdf' // Adjust accordingly if it's a different content type
//       };
//     }
//     if (note.notesAttachment) {
//       // Assuming notesAttachment stores PDF data
//       sanitizedNote.notesAttachment = {
//         data: Buffer.from(note.notesAttachment).toString('base64'),
//         contentType: 'application/pdf' // Adjust accordingly if it's a different content type
//       };
//     }

//     res.status(200).json(sanitizedNote);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

async function getPublishNotesByEmail(req, res) {
  const email = req.params.email;
  try {
    const userPublishedNotes = await Notes.findAll({
      where: {
        email,
        publishFlag: 'P'
      },
      attributes: {
        include: [
          [
            // Subquery to count downloads for each noteId
            Sequelize.literal(`(
                SELECT COUNT(*) 
                FROM "DownloadNotes" AS dn 
                WHERE dn."noteId" = "Notes".id
              )`),
            'downloadCount'
          ],
          [
            Sequelize.literal(`(
                SELECT CONCAT(u."firstName", ' ', u."lastName")
                FROM "Users" AS u
                WHERE u.email = "Notes".email
                LIMIT 1
              )`),
            'userFullName'
          ],
          [
            Sequelize.literal(`(
                SELECT ROUND(AVG(CAST(dn."rating" AS FLOAT)))
                FROM "DownloadNotes" AS dn
                WHERE dn."noteId" = "Notes".id
            )`),
            'averageRating'
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(DISTINCT dn."email")
              FROM "DownloadNotes" AS dn
              WHERE dn."noteId" = "Notes".id AND dn."ReportRemark" IS NOT NULL
            )`),
            'reportCount'
          ]
        ]
      }
    });

    if (!userPublishedNotes || userPublishedNotes.length === 0) {
      return res.status(404).json({ message: 'No published notes found for this user' });
    }

    res.status(200).json(userPublishedNotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllPublishedNotes(req, res) {
  try {
    // Fetch all published notes with download count
    const allPublishedNotes = await Notes.findAll({
      where: { publishFlag: 'P' },
      attributes: {
        include: [
          [
            // Subquery to count downloads for each noteId
            Sequelize.literal(`(
                SELECT COUNT(*) 
                FROM "DownloadNotes" AS dn 
                WHERE dn."noteId" = "Notes".id
              )`),
            'downloadCount'
          ],
          [
            Sequelize.literal(`(
                SELECT CONCAT(u."firstName", ' ', u."lastName")
                FROM "Users" AS u
                WHERE u.email = "Notes".email
                LIMIT 1
              )`),
            'userFullName'
          ],
          [
            Sequelize.literal(`(
                SELECT ROUND(AVG(CAST(dn."rating" AS FLOAT)))
                FROM "DownloadNotes" AS dn
                WHERE dn."noteId" = "Notes".id
            )`),
            'averageRating'
          ],
          [
            Sequelize.literal(`(
              SELECT COUNT(DISTINCT dn."email")
              FROM "DownloadNotes" AS dn
              WHERE dn."noteId" = "Notes".id AND dn."ReportRemark" IS NOT NULL
            )`),
            'reportCount'
          ]
        ]
      }
    });

    if (!allPublishedNotes || allPublishedNotes.length === 0) {
      return res.status(404).json({ message: 'No published notes found' });
    }

    res.status(200).json(allPublishedNotes);
  } catch (error) {
    console.error('Error fetching published notes:', error);
    res.status(500).json({ error: error.message });
  }
}
async function getSaveNotes(req, res) {
  const email = req.params.email;
  try {
    const userPublishedNotes = await Notes.findAll({
      where: {
        email,
        statusFlag: 'S'
      }
    });

    if (!userPublishedNotes || userPublishedNotes.length === 0) {
      return res.status(404).json({ message: 'No published notes found for this user' });
    }

    res.status(200).json(userPublishedNotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteNoteById(req, res) {
  const id = req.params.id;
  try {
    const note = await Notes.findByPk(id);
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    await note.destroy();
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateNotes(req, res) {
  try {
    console.log("test API");
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
      previewUploadP,
      remark
    } = req.body;

    // Check if the note exists
    const existingNote = await Notes.findOne({ where: { id: noteId } });
    if (!existingNote) {
      return res.status(404).json({ success: false, error: "Note not found" });
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
    existingNote.remark = remark;
    existingNote.displayPictureP = displayPictureP || existingNote.displayPictureP;
    existingNote.notesAttachmentP = notesAttachmentP || existingNote.notesAttachmentP;
    existingNote.previewUploadP = previewUploadP || existingNote.previewUploadP;
    existingNote.updatedBy=req.fullName;

    // Save the updated note
    const updatedNote = await existingNote.save();

    const seller = await User.findOne({ where: { email: email } });
    const sellerName = seller && seller.firstName && seller.lastName ? `${seller.firstName} ${seller.lastName}` : 'Seller';

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Sorry! We need to remove your notes from our portal.",
      text: `Hello "${sellerName},\n\nWe want to inform you that your note "${noteTitle}" has been removed from the portal.\nPlease find our remarks below:\n\n${remark}\n\nRegards,\nNotes Marketplace`
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully.");
    res.status(200).json({ success: true, data: updatedNote });
  } catch (error) {
    // Send an error response if something goes wrong
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
}

async function getUnderReviewNotes(req, res) {
  try {
    const allPublishedNotes = await Notes.findAll({
      where: { statusFlag: 'P', publishFlag: { [Op.notIn]: ['R', 'P'] } },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT CONCAT(u."firstName", ' ', u."lastName")
              FROM "Users" AS u
              WHERE u.email = "Notes".email
              LIMIT 1
            )`),
            'userFullName'
          ]
        ]
      }
    });

    if (!allPublishedNotes || allPublishedNotes.length === 0) {
      return res.status(404).json({ message: 'No published notes found' });
    }

    res.status(200).json(allPublishedNotes);
  } catch (error) {
    console.error('Error fetching published notes:', error);
    res.status(500).json({ error: error.message });
  }
}
async function getAllRejectedNotes(req, res) {
  try {
    // Fetch all published notes with download count
    const allPublishedNotes = await Notes.findAll({
      where: { publishFlag: 'R' },
      attributes: {
        include: [
          [
            // Subquery to count downloads for each noteId
            Sequelize.literal(`(
              SELECT COUNT(*) 
              FROM "DownloadNotes" AS dn 
              WHERE dn."noteId" = "Notes".id
            )`),
            'downloadCount'
          ],
          [
            Sequelize.literal(`(
              SELECT CONCAT(u."firstName", ' ', u."lastName")
              FROM "Users" AS u
              WHERE u.email = "Notes".email
              LIMIT 1
            )`),
            'userFullName'
          ]
        ]
      }
    });

    if (!allPublishedNotes || allPublishedNotes.length === 0) {
      return res.status(404).json({ message: 'No published notes found' });
    }

    res.status(200).json(allPublishedNotes);
  } catch (error) {
    console.error('Error fetching published notes:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getUnderReviewNotesByEmail(req, res) {
  try {
    const email = req.params.email;

    const allPublishedNotes = await Notes.findAll({
      where: {
        email: email,
        statusFlag: 'P',
        publishFlag: { [Op.notIn]: ['R', 'P'] }
      },
      attributes: {
        include: [
          [
            Sequelize.literal(`(
              SELECT CONCAT(u."firstName", ' ', u."lastName")
              FROM "Users" AS u
              WHERE u."email" = "Notes"."email"
              LIMIT 1
            )`),
            'userFullName'
          ]
        ]
      }
    });

    if (!allPublishedNotes.length) {
      return res.status(404).json({ message: 'No published notes found for the given email' });
    }

    res.status(200).json(allPublishedNotes);
  } catch (error) {
    console.error('Error fetching published notes:', error);
    res.status(500).json({ error: error.message });
  }
}
async function getUserNotesByEmail(req, res) {
  try {
    const email = req.params.email;

    const allPublishedNotes = await Notes.findAll({
      where: {
        email: email,
        statusFlag: 'P',
      },
      attributes: {
        include: [
          [
            // Subquery to count downloads for each noteId
            Sequelize.literal(`(
              SELECT COUNT(*) 
              FROM "DownloadNotes" AS dn 
              WHERE dn."noteId" = "Notes".id
            )`),
            'downloadCount'
          ],
          [
            Sequelize.literal(`(
              SELECT CONCAT(u."firstName", ' ', u."lastName")
              FROM "Users" AS u
              WHERE u."email" = "Notes"."email"
              LIMIT 1
            )`),
            'userFullName'
          ]
        ]
      }
    });

    if (!allPublishedNotes.length) {
      return res.status(404).json({ message: 'No published notes found for the given email' });
    }

    res.status(200).json(allPublishedNotes);
  } catch (error) {
    console.error('Error fetching published notes:', error);
    res.status(500).json({ error: error.message });
  }
}

async function getAllRejectedNotesByEmail(req, res) {
  try {
    const email = req.params.email;
    const allPublishedNotes = await Notes.findAll({
      where: { email: email, publishFlag: 'R' },
      attributes: {
        include: [
          [
            // Subquery to count downloads for each noteId
            Sequelize.literal(`(
              SELECT COUNT(*) 
              FROM "DownloadNotes" AS dn 
              WHERE dn."noteId" = "Notes".id
            )`),
            'downloadCount'
          ],
          [
            Sequelize.literal(`(
              SELECT CONCAT(u."firstName", ' ', u."lastName")
              FROM "Users" AS u
              WHERE u.email = "Notes".email
              LIMIT 1
            )`),
            'userFullName'
          ]
        ]
      }
    });

    if (!allPublishedNotes || allPublishedNotes.length === 0) {
      return res.status(404).json({ message: 'No published notes found' });
    }

    res.status(200).json(allPublishedNotes);
  } catch (error) {
    console.error('Error fetching published notes:', error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getAllPublishedNotes, uploadNotes, uploadDisplayPicture, uploadNotesAttachment, uploadPreviewUpload, getNotes, getPublishNotesByEmail, getSaveNotes, getAllNotes, getNotesById, deleteNoteById, updateNotes, getUnderReviewNotes, getAllRejectedNotes, getUnderReviewNotesByEmail, getUserNotesByEmail, getAllRejectedNotesByEmail };


