const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  port: "25",
  host: "172.16.10.7",
});

module.exports = transporter;