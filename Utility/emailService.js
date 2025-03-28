const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    // user: process.env.EMAIL_USER,
    // pass: process.env.EMAIL_PASS,
    user: "chamanmodi911@gmail.com",
    pass: "xflr ikdn perr mfjw",
  },
});

module.exports = transporter;