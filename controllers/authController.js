// controllers/authController.js
const bcrypt = require('bcrypt');
//const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

async function register(req, res) {
  const { firstName, lastName, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, password: hashedPassword });
    res.status(201).json({ userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('Invalid password');
    }
    const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    //const randomPassword = crypto.randomBytes(16).toString('hex');
    const randomPassword = Array(14).fill("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[{]}|;:,<.>?").map(function(x) { return x[Math.floor(Math.random() * x.length)] }).join('').replace(/\s+/g, '');

    const hashedPassword = await bcrypt.hash(randomPassword, 10);
  
    await user.update({ password: hashedPassword });
  
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'chamanmodi911@gmail.com',
        pass: 'bggw xgwy vhor irob'
      }
    });
  
    await transporter.sendMail({
      from: 'chamanmodi911@gmail.com',
      to: user.email,
      subject: 'Your New Password for Note Application',
      text: `Your new password is: ${randomPassword}`,
    });
    res.status(201).json({ Message: "Mail Sent"  });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
module.exports = { register, login, forgotPassword };
