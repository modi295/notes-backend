const { Op, Sequelize } = require('sequelize');  // Add this line
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/Otp');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const transporter = require("../Utility/emailService"); 

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
    updatedUserData.updatedBy =  req.fullName;
   // console.log(updatedUserData.updatedBy);

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
      active: updatedUser.active,
      remark: updatedUser.remark

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

    const user = await User.create({ firstName, lastName, email, password: hashedPassword, active: 'N', addedBy:req.fullName });

    const token = jwt.sign({ userId: user.id }, "your-secret-key", { expiresIn: "24h" });

    // Send verification email
    const verificationLink = `http://192.168.2.39:3000/verify-email/${token}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Note Marketplace - Email Verification",
      html: `<p>Hello ${firstName},</p>
             <p>Thank you for signing up with us. Please click the link below to verify your email address:</p>
             <a href="${verificationLink}">Verify Email</a>
             <p>Regards,<br>Notes Marketplace</p>`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "User registered successfully. Please check your email for verification." });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function verifyEmail(req, res) {
  const token = req.params.token;

  try {
    const decoded = jwt.verify(token, "your-secret-key"); // Verify token

    // Find user and update 'active' status
    await User.update({ active: 'Y' }, { where: { id: decoded.userId } });

    res.status(200).send("Email verified successfully! You can now log in.");
  } catch (error) {
    res.status(400).send("Invalid or expired token.");
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
      profilePicture: user.profilePicture
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

// async function login(req, res) {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ where: { email } });
//     if (!user) {
//       throw new Error('User not found');
//     }
//     if (user.active === 'N') {
//       throw new Error('Your ID has been deactivated. Please contact Admin.');
//     }
//     const passwordMatch = await bcrypt.compare(password, user.password);
//     if (!passwordMatch) {
//       throw new Error('Invalid password');
//     }
//     const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
//     res.json({ token });
//   } catch (error) {
//     res.status(401).json({ error: error.message });
//   }
// }

async function login(req, res) {
  const { email, password } = req.body;
  try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
          return res.status(401).json({ error: 'User not found' });
      }
      if (user.active === 'N') {
          return res.status(401).json({ error: 'Your ID has been deactivated. Please contact Admin.' });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
          return res.status(401).json({ error: 'Invalid password' });
      }

      const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1d' });

      res.json({ token,role: user.role });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
}

async function sendOtpForLogin(req, res) {
  const { email } = req.body;

  try {
    // 1. Check if user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.active === 'N') {
      return res.status(403).json({ error: 'Your ID has been deactivated. Please contact Admin.' });
    }

    // 2. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiredAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now

    // 3. Store OTP in DB
    await OTP.create({ email, otp, expiredAt});

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Login',
      text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ Message: "Mail Sent" });
  } catch (error) {
    console.error('OTP Error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
}

async function verifyOtpLogin(req, res) {
  const { email, otp } = req.body;

  try {
    // 1. Find valid OTP
    const otpRecord = await OTP.findOne({
      where: {
        email,
        otp,
        expiredAt: {
          [Op.gt]: new Date() // Not expired
        }
      },
      order: [['createdAt', 'DESC']]
    });

    if (!otpRecord) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // 2. Find user
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.active === 'N') {
      return res.status(403).json({ error: 'Your ID has been deactivated. Please contact Admin.' });
    }

    // 3. Delete OTP after use (optional but secure)
    await otpRecord.destroy();

    // 4. Generate JWT
    const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1d' });

    res.status(200).json({ token, role: user.role });
  } catch (error) {
    console.error('OTP Verification Error:', error);
    res.status(500).json({ error: 'Failed to verify OTP' });
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
    const randomPassword = Array(14).fill("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[{]}|;:,<.>?").map(function (x) { return x[Math.floor(Math.random() * x.length)] }).join('').replace(/\s+/g, '');

    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    await user.update({ password: hashedPassword });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'New Temporary Password has been created for you',
      text: `Hello,\nWe have generated a new password for you.\nPassword: ${randomPassword}\nVisit us at: www.tatvasoft.com or E-mail us at: business@tatvasoft.com\nRegards,\nNotes Marketplace`,
    
    };

    await transporter.sendMail(mailOptions);
    res.status(201).json({ Message: "Mail Sent" });
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

// async function getAllUsers(req, res) {
//   try {
//     const users = await User.findAll({
//       attributes: ['firstName', 'lastName', 'email', 'dob', 'gender', 'phoneNumberCode', 'phoneNumber',
//                    'address1', 'address2', 'city', 'state', 'zipCode', 'country', 'university', 'college', 'profilePicture','createdAt']
//     });

//     const sanitizedUsers = users.map(user => {
//       let userData = user.get({ plain: true });
//       if (userData.profilePicture) {
//         userData.profilePicture = Buffer.from(userData.profilePicture).toString('base64');
//       }
//       return userData;
//     });

//     res.status(200).json(sanitizedUsers);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }
async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({
      attributes: [
        'firstName', 'lastName', 'email', 'dob', 'gender', 'phoneNumberCode', 'phoneNumber',
        'address1', 'address2', 'city', 'state', 'zipCode', 'country', 'university', 'college','role','active',
        'createdAt',
        [
          Sequelize.literal(`(
            SELECT COUNT(*) 
            FROM "Notes" AS n 
            WHERE n.email = "User".email 
            AND n."statusFlag" = 'P' 
            AND n."publishFlag" NOT IN ('R', 'P')
        )`),
          'underReview'
        ],
        [
          Sequelize.literal(`(
            SELECT COUNT(*) 
            FROM "Notes" AS n 
            WHERE n.email = "User".email AND n."publishFlag" = 'P'
          )`),
          'publishNote'
        ],
        [
          Sequelize.literal(`(
            SELECT COALESCE(SUM(dn."sellPrice"), 0)
            FROM "DownloadNotes" AS dn 
            JOIN "Notes" AS n ON dn."noteId" = n."id"
            WHERE n.email = "User".email
          )`),
          'totalSellPrice'
        ],
        [
          Sequelize.literal(`(
            SELECT COUNT(*) 
            FROM "DownloadNotes" AS dn
            WHERE dn."noteId" IN (
              SELECT n.id FROM "Notes" AS n WHERE n.email = "User".email
            )
          )`),
          'downloadCount'
        ],
      ]
    });

    // Convert profilePicture separately
    const sanitizedUsers = users.map(user => {
      let userData = user.get({ plain: true });

      // Convert profilePicture to base64
      if (user.profilePicture) {
        userData.profilePicture = Buffer.from(user.profilePicture).toString('base64');
      }

      return userData;
    });

    res.status(200).json(sanitizedUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: error.message });
  }
}

async function Admin(req, res) {
  const { firstName, lastName, email, phoneNumberCode, phoneNumber } = req.body;
  try {
    const password = email.split('@')[0]; 
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, email, phoneNumberCode ,phoneNumber, password: hashedPassword, role:'Admin',addedBy : req.fullName});
    res.status(201).json({ userId: user.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { register, login, forgotPassword, getUser, updateUser, uploadProfilePicture, changePassword, getAllUsers,Admin,verifyEmail,sendOtpForLogin,verifyOtpLogin };

