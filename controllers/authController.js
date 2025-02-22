// controllers/authController.js
const bcrypt = require('bcrypt');
//const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

async function uploadProfilePicture(req, res, next) {
  upload.single('profilePicture')(req, res, err => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message });
    } else if (err) {
      return res.status(500).json({ error: err.message });
    }
    next();
  });
}

async function updateUser(req, res) {
  const email = req.params.email;
  const updatedUserData = req.body;
  try {
    if (req.file) {
      updatedUserData.profilePicture = req.file.buffer;
    }
    const [updatedRowsCount, [updatedUser]] = await User.update(updatedUserData, {
      where: { email },
      returning: true
    });
    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const sanitizedUser = {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      dob: updatedUser.dob,
      gender: updatedUser.gender,
      phoneNumberCode: updatedUser.phoneNumberCode,
      phoneNumber: updatedUser.phoneNumber,
      address1: updatedUser.address1,
      address2: updatedUser.address2,
      city: updatedUser.city,
      state: updatedUser.state,
      zipCode: updatedUser.zipCode,
      country: updatedUser.country,
      university: updatedUser.university,
      college: updatedUser.college,
    };
    res.status(200).json({ message: 'User updated successfully', user: sanitizedUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

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
async function getUser(req, res) {
  const email = req.params.email; 
  try {
    const user = await User.findOne({ where: { email } }); // Find user by email
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const sanitizedUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    const sanitizedAllUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dob: user.dob,
      gender: user.gender,
      phoneNumberCode: user.phoneNumberCode,
      phoneNumber: user.phoneNumber,
      address1: user.address1,
      address2: user.address2,
      city: user.city,
      state: user.state,
      zipCode: user.zipCode,
      country: user.country,
      university: user.university,
      college: user.college,
      profilePicture:user.profilePicture
    };
    // if (user.profilePicture) {
    //   sanitizedAllUser.profilePicture = Buffer.from(user.profilePicture).toString('base64');
    // }
    res.status(200).json(sanitizedAllUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
// async function updateUser(req, res) {
//   const email = req.params.email;
//   const updatedUserData = req.body; // Assuming the request body contains updated user data
  
//   try {
//     const [updatedRowsCount, updatedUser] = await User.update(updatedUserData, {
//       where: { email },
//       returning: true // Return the updated user data
//     });

//     if (updatedRowsCount === 0) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     const sanitizedUser = {
//       firstName: updatedUser[0].firstName,
//       lastName: updatedUser[0].lastName,
//       email: updatedUser[0].email,
//       dob: updatedUser[0].dob,
//       gender: updatedUser[0].gender,
//       phoneNumberCode: updatedUser[0].phoneNumberCode,
//       phoneNumber: updatedUser[0].phoneNumber,
//       address1: updatedUser[0].address1,
//       address2: updatedUser[0].address2,
//       city: updatedUser[0].city,
//       state: updatedUser[0].state,
//       zipCode: updatedUser[0].zipCode,
//       country: updatedUser[0].country,
//       university: updatedUser[0].university,
//       college: updatedUser[0].college,
//       // Add other fields as needed
//     };

//     res.status(200).json({ message: 'User updated successfully', user: sanitizedUser });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

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
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // Use TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  
    await transporter.sendMail({
      from: 'chamanmodi911@gmail.com',
      to: user.email,
      subject: 'New Temporary Password has been created for you',
      text: `Hello,\nWe have generated a new password for you.\nPassword: ${randomPassword}\nVisit us at: www.tatvasoft.com or E-mail us at: business@tatvasoft.com\nRegards,\nNotes Marketplace`,
    });
    res.status(201).json({ Message: "Mail Sent"  });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function changePassword(req, res) {
  const { email, oldPassword, newPassword } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new Error('Old password is incorrect');
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedNewPassword });
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = { register, login, forgotPassword, getUser, updateUser, uploadProfilePicture, changePassword };

