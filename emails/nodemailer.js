require("dotenv").config();
const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASS,
  },
});

module.exports = transporter;
