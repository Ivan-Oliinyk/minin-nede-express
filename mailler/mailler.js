require("dotenv").config();

console.log("start");

const nodemailler = require("nodemailler");

const transporter = nodemailler.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const mailOptions = (
  from = process.env.EMAIL,
  to = "lorf1991@gmail.com",
  subject = "some text from Node.js",
  text = "some text ..... "
) => ({ from, to, subject, text });

transporter.sendMail(mailOptions());

console.log("done");
