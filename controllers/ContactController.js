const nodemailer = require('nodemailer');
const Contact = require('../models/Contact');

async function contact(req, res) {
    const { fullName, email, subject, comment } = req.body;
    try {
      const user = await Contact.create({ fullName, email, subject, comment });
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'chamanmodi@gmail.com',
          pass: 'bggw xgwy vhor irob'
        }
      });
    
      await transporter.sendMail({
        from: 'chamanmodi911@gmail.com',
        to: user.email,
        subject: `${user.fullName} - Query`,
        text: `Hello,\n${user.comment}\nRegards,\n${user.fullName}`,
        });
      res.status(201).json({ userId: user.id });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
  module.exports = { contact };