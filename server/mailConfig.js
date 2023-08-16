const nodemailer = require("nodemailer");
// Configuration de transport pour nodemailer
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: "465",
  secure: true,
  auth: {
    user: "mosesziongo@gmail.com",
    pass: "pllnhzhtpuwabadl",
  },
});

module.exports = transporter;
