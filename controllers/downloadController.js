const DownloadNotes = require('../models/DownloadNotes');
const SoldNotes = require('../models/SoldNotes');
const BuyerNotes = require('../models/BuyerNotes');
const User = require('../models/User');
const Notes = require('../models/Notes');
const { Op, Sequelize } = require('sequelize');
const transporter = require("../Utility/emailService");

async function getDownloadNotes(req, res) {
    const buyerEmail = String(req.params.email); // Ensure string comparison

    try {
        const userNotes = await DownloadNotes.findAll({
            where: { buyerEmail },
            attributes: {
                include: [
                    [
                        Sequelize.literal(`(
                            SELECT u."firstName" || ' ' || u."lastName"
                            FROM "Users" AS u
                            WHERE u."email" = "DownloadNotes"."buyerEmail"
                            LIMIT 1
                        )`),
                        'buyerFullName'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT u."phoneNumberCode" || u."phoneNumber"
                            FROM "Users" AS u
                            WHERE u."email" = "DownloadNotes"."buyerEmail"
                            LIMIT 1
                        )`),
                        'buyerPhone'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT u."address1" || ', ' || u."city" || ', ' || u."state" || ', ' || u."country" || ' - ' || u."zipCode"
                            FROM "Users" AS u
                            WHERE u."email" = "DownloadNotes"."buyerEmail"
                            LIMIT 1
                        )`),
                        'buyerAddress'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT u."firstName" || ' ' || u."lastName"
                            FROM "Users" AS u
                            WHERE u."email" = "DownloadNotes"."email"
                            LIMIT 1
                        )`),
                        'sellerFullName'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT u."phoneNumberCode" || u."phoneNumber"
                            FROM "Users" AS u
                            WHERE u."email" = "DownloadNotes"."email"
                            LIMIT 1
                        )`),
                        'sellerPhone'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT u."address1" || ', ' || u."city" || ', ' || u."state" || ', ' || u."country" || ' - ' || u."zipCode"
                            FROM "Users" AS u
                            WHERE u."email" = "DownloadNotes"."email"
                            LIMIT 1
                        )`),
                        'sellerAddress'
                    ]
                ]
            },
            include: [
                {
                    model: Notes,
                    attributes: ['notesAttachmentP']
                }
            ]
        });

        if (!userNotes || userNotes.length === 0) {
            return res.status(404).json({ message: 'No download notes found for this user' });
        }

        res.status(200).json(userNotes);
    } catch (error) {
        console.error('Error fetching notes:', error);
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
        const { email, noteId, noteTitle, category, sellFor, sellPrice, PurchaseTypeFlag, purchaseEmail, buyerEmail } = req.body;
        const newNote = await DownloadNotes.create({
            email,
            noteId,
            noteTitle,
            category,
            sellFor,
            sellPrice,
            PurchaseTypeFlag,
            purchaseEmail,
            buyerEmail,
            addedBy : req.fullName
        });

        res.status(201).json({ success: true, data: newNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}

async function postSoldNote(req, res) {
    try {
        const { email, noteId, noteTitle, category, sellFor, sellPrice, purchaseEmail, buyerEmail } = req.body;
        const newNote = await SoldNotes.create({
            email,
            noteId,
            noteTitle,
            category,
            sellFor,
            sellPrice,
            purchaseEmail,
            buyerEmail,
            addedBy:req.fullName
        });

        res.status(201).json({ success: true, data: newNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}

async function postBuyerNote(req, res) {
    try {
        const { email, noteId, noteTitle, category, sellFor, sellPrice, purchaseEmail, buyerEmail, approveFlag } = req.body;
        const newNote = await BuyerNotes.create({
            email,
            noteId,
            noteTitle,
            category,
            sellFor,
            sellPrice,
            purchaseEmail,
            buyerEmail,
            approveFlag,
            addedBy : req.fullName
        });

        const seller = await User.findOne({ where: { email: purchaseEmail } });
        const buyer = await User.findOne({ where: { email: buyerEmail } });

        const sellerName = seller && seller.firstName && seller.lastName ? `${seller.firstName} ${seller.lastName}` : 'Seller';
        const buyerName = buyer && buyer.firstName && buyer.lastName ? `${buyer.firstName} ${buyer.lastName}` : 'Buyer';

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: purchaseEmail,
            subject: `${buyerName} wants to purchase your notes`,
            text: `Hello ${sellerName},\n\nWe would like to inform you that ${buyerName} wants to purchase your notes.\nPlease check the "Buyer Requests" tab and allow download access to the buyer if you have received the payment from them.\n\nRegards,\nNotes Marketplace`
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
        const seller = await User.findOne({ where: { email: purchaseEmail } });
        const buyer = await User.findOne({ where: { email: buyerEmail } });

        const sellerName = seller && seller.firstName && seller.lastName ? `${seller.firstName} ${seller.lastName}` : 'Seller';
        const buyerName = buyer && buyer.firstName && buyer.lastName ? `${buyer.firstName} ${buyer.lastName}` : 'Buyer';

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
            approveFlag,
            updatedBy:req.fullName
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: buyerEmail,
            subject: `${sellerName} Allows you to download a note`,
            text: `Hello ${buyerName},\n\nWe would like to inform you that ${sellerName} allows you to download a note.\nPlease login and check the "My Downloads" tab to download the particular note.\n\nRegards,\nNotes Marketplace`
        };

        await transporter.sendMail(mailOptions);
        console.log('Approval email sent successfully');
        res.status(200).json({ success: true, data: updatedNote });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
}
async function getDownloadNotesById(req, res) {
    const noteId = req.params.id;

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
            where: {},
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
async function getDownloadNotesByEmail(req, res) {
    const email = req.params.email;
    try {
        const note = await DownloadNotes.findAll({
            where: { email },
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

async function updateDownloadNote(req, res) {
    try {
        const { id } = req.params;
        const {
            email,
            noteId,
            noteTitle,
            category,
            sellFor,
            sellPrice,
            purchaseEmail,
            buyerEmail,
            approveFlag,
            rating,
            comment,
            ReportRemark
        } = req.body;

        const existingNote = await DownloadNotes.findByPk(id);
        if (!existingNote) {
            return res.status(404).json({ success: false, message: 'Download note not found' });
        }

        const updatedNote = await existingNote.update({
            email,
            noteId,
            noteTitle,
            category,
            sellFor,
            sellPrice,
            purchaseEmail,
            buyerEmail,
            approveFlag,
            rating,
            comment,
            ReportRemark,
            updatedBy:req.fullName
        });

        if (ReportRemark && ReportRemark.trim() !== '') {
            // Get member and seller details
            const member = await User.findOne({ where: { email: buyerEmail } });
            const seller = await User.findOne({ where: { email: purchaseEmail } });

            const memberName = member && member.firstName && member.lastName ? `${member.firstName} ${member.lastName}` : 'Member';
            const sellerName = seller && seller.firstName && seller.lastName ? `${seller.firstName} ${seller.lastName}` : 'Seller';

            // Fetch Admin email from config — replace with actual logic
            const adminEmails = process.env.ADMIN_EMAILS || 'admin@example.com'; // comma-separated if multiple

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: 'chaman.modi@internal.mail',
                subject: `${memberName} Reported an issue for ${noteTitle}`,
                text: `Hello Admins,\n\nWe want to inform you that, ${memberName} Reported an issue for ${sellerName}’s Note with title "${noteTitle}".\nPlease look at the notes and take required actions.\n\nRegards,\nNotes Marketplace`
            };

            await transporter.sendMail(mailOptions);
        }
        res.status(200).json({ success: true, data: updatedNote });
    } catch (error) {
        console.error('Error updating download note:', error);
        res.status(500).json({ success: false, error: error.message });
    }
}

async function getReviewFromDownloadNotesByNoteId(req, res) {
    const noteId = req.params.id;

    try {
        const notes = await DownloadNotes.findAll({
            where: {
                noteId,
                rating: { [Sequelize.Op.ne]: null },
                comment: { [Sequelize.Op.ne]: null }
            },
            attributes: {
                include: [
                    [
                        Sequelize.literal(`(
                            SELECT CONCAT(u."firstName", ' ', u."lastName")
                            FROM "Users" AS u
                            WHERE u."email" = "DownloadNotes"."buyerEmail"
                            LIMIT 1
                        )`),
                        'buyerName'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT u."profilePicture"
                            FROM "Users" AS u
                            WHERE u."email" = "DownloadNotes"."buyerEmail"
                            LIMIT 1
                        )`),
                        'profilePicture'
                    ],
                    [
                        Sequelize.literal(`(
                            SELECT ROUND(AVG(CAST(dn."rating" AS FLOAT)))
                            FROM "DownloadNotes" AS dn
                            WHERE dn."noteId" = "DownloadNotes"."noteId"
                        )`),
                        'averageRating'
                    ]
                ]
            }
        });

        if (!notes || notes.length === 0) {
            return res.status(404).json({ message: 'No matching notes found' });
        }

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

async function getAllReportedDownloadNotes(req, res) {
    try {
        const reportedNotes = await DownloadNotes.findAll({
            where: {
                ReportRemark: { [Op.ne]: null } // ReportRemark is not null
            },
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

        if (!reportedNotes || reportedNotes.length === 0) {
            return res.status(404).json({ message: 'No reported notes found' });
        }

        res.status(200).json(reportedNotes);
    } catch (error) {
        console.error('Error fetching reported notes:', error);
        res.status(500).json({ error: error.message });
    }
}


module.exports = { getDownloadNotes, postDownloadNote, getSoldNotes, postSoldNote, getBuyerNotes, postBuyerNote, updateBuyerNote, getDownloadNotesById, getAllDownloadNotesById, getDownloadNotesByEmail, updateDownloadNote, getReviewFromDownloadNotesByNoteId,getAllReportedDownloadNotes };
