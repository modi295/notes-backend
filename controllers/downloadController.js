const DownloadNotes = require('../models/DownloadNotes');
const SoldNotes = require('../models/SoldNotes');
const BuyerNotes = require('../models/BuyerNotes');
const Sequelize = require('sequelize');  // Add this line


async function getDownloadNotes(req, res) {
    const buyerEmail = req.params.email;
    try {
        const userNotes = await DownloadNotes.findAll({ where: { buyerEmail } });
        if (!userNotes || userNotes.length === 0) {
            return res.status(404).json({ message: 'No download notes found for this user' });
        }
        res.status(200).json(userNotes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function getSoldNotes(req, res) {
    const purchaseEmail = req.params.email;
    try {
        const userNotes = await SoldNotes.findAll({ where: { purchaseEmail } });
        if (!userNotes || userNotes.length === 0) {
            return res.status(404).json({ message: 'No download notes found for this user' });
        }
        res.status(200).json(userNotes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
async function getBuyerNotes(req, res) {
    const purchaseEmail = req.params.email;
    try {
        const userNotes = await BuyerNotes.findAll({ where: { purchaseEmail } });
        if (!userNotes || userNotes.length === 0) {
            return res.status(404).json({ message: 'No download notes found for this user' });
        }
        res.status(200).json(userNotes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function postDownloadNote(req, res) {
    try {
        const {email,noteId,noteTitle,category,sellFor,sellPrice,PurchaseTypeFlag,purchaseEmail,buyerEmail} = req.body; 
        const newNote = await DownloadNotes.create({
            email,
            noteId,
            noteTitle,
            category,
            sellFor,
            sellPrice,
            PurchaseTypeFlag,
            purchaseEmail,
            buyerEmail
        });

        res.status(201).json({ success: true, data: newNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}

async function postSoldNote(req, res) {
    try {
        const {email,noteId,noteTitle,category,sellFor,sellPrice,purchaseEmail,buyerEmail} = req.body; 
        const newNote = await SoldNotes.create({
            email,
            noteId,
            noteTitle,
            category,
            sellFor,
            sellPrice,
            purchaseEmail,
            buyerEmail
        });

        res.status(201).json({ success: true, data: newNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}

async function postBuyerNote(req, res) {
    try {
        const {email,noteId,noteTitle,category,sellFor,sellPrice,purchaseEmail,buyerEmail,approveFlag} = req.body; 
        const newNote = await BuyerNotes.create({
            email,
            noteId,
            noteTitle,
            category,
            sellFor,
            sellPrice,
            purchaseEmail,
            buyerEmail,
            approveFlag
        });
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: buyerEmail,
            subject: 'New Note Purchase Confirmation',
            text: `
            <p>Hey, thank you for purchasing the note.</p>
            <p>As this is a paid note, you need to pay the amount to the seller <strong>Test</strong> offline in order to download the note.</p>
            <p>We will send the seller an email that you want to download this note. The seller may contact you further for payment process completion.</p>
            <p>In case of urgency, please contact us at <strong>9999999999</strong>.</p>
            <p>Once the seller receives the payment and acknowledges us, you will see the selected note available for download under the "My Downloads" tab.</p>
            <p>Have a good day!</p>`
        };
        await transporter.sendMail(mailOptions);
        res.status(201).json({ success: true, data: newNote, message: 'Note created and confirmation email sent.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}
async function updateBuyerNote(req, res) {
    try {
        const { id } = req.params; // Extract the note ID from the request parameters.
        const {
            email,
            noteId,
            noteTitle,
            category,
            sellFor,
            sellPrice,
            purchaseEmail,
            buyerEmail,
            approveFlag
        } = req.body; // Extract fields to be updated from the request body.

        // Check if the BuyerNote with the given ID exists.
        const existingNote = await BuyerNotes.findByPk(id);
        if (!existingNote) {
            return res.status(404).json({ success: false, message: 'Buyer note not found' });
        }

        // Update the BuyerNote with the provided fields.
        const updatedNote = await existingNote.update({
            email,
            noteId,
            noteTitle,
            category,
            sellFor,
            sellPrice,
            purchaseEmail,
            buyerEmail,
            approveFlag
        });

        res.status(200).json({ success: true, data: updatedNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}
async function getDownloadNotesById(req, res) {
    const noteId = req.params.id; // Assuming the ID is passed in the request parameter 'id'
  
    try {
        const note = await DownloadNotes.findAll({ 
            where: { noteId },
            attributes: {
                include: [
                    // Subquery for Buyer Full Name
                    [
                        Sequelize.literal(`(
                            SELECT CONCAT(u."firstName", ' ', u."lastName")
                            FROM "Users" AS u
                            WHERE u."email" = "DownloadNotes"."buyerEmail"
                            LIMIT 1
                        )`),
                        'buyerName'
                    ],
                    // Subquery for Purchaser Full Name
                    [
                        Sequelize.literal(`(
                            SELECT CONCAT(u."firstName", ' ', u."lastName")
                            FROM "Users" AS u
                            WHERE u."email" = "DownloadNotes"."purchaseEmail"
                            LIMIT 1
                        )`),
                        'purchaserName'
                    ]
                ]
            }
        });
  
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
  
      res.status(200).json(note);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  async function getAllDownloadNotesById(req, res) {
  
    try {
        const note = await DownloadNotes.findAll({ 
            where: { },
            attributes: {
                include: [
                    // Subquery for Buyer Full Name
                    [
                        Sequelize.literal(`(
                            SELECT CONCAT(u."firstName", ' ', u."lastName")
                            FROM "Users" AS u
                            WHERE u."email" = "DownloadNotes"."buyerEmail"
                            LIMIT 1
                        )`),
                        'buyerName'
                    ],
                    // Subquery for Purchaser Full Name
                    [
                        Sequelize.literal(`(
                            SELECT CONCAT(u."firstName", ' ', u."lastName")
                            FROM "Users" AS u
                            WHERE u."email" = "DownloadNotes"."purchaseEmail"
                            LIMIT 1
                        )`),
                        'purchaserName'
                    ]
                ]
            }
        });
  
      if (!note) {
        return res.status(404).json({ message: 'Note not found' });
      }
  
      res.status(200).json(note);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }


module.exports = { getDownloadNotes,  postDownloadNote, getSoldNotes, postSoldNote, getBuyerNotes, postBuyerNote,updateBuyerNote,getDownloadNotesById,getAllDownloadNotesById };
