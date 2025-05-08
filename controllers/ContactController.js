const Contact = require("../models/Contact");
const transporter = require("../Utility/emailService"); 

async function contact(req, res) {
  const { fullName, email, subject, comment, } = req.body;
  
  try {
    const user = await Contact.create({ fullName, email, subject, comment, addedBy : req.fullName });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `${user.fullName} - Query`,
      text: `Hello Admin,\n\n${user.comment}\n\nRegards,\n${user.fullName}`
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { contact };