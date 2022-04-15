const { EMAIL_SERVICE, EMAIL, EMAIL_PASSWORD } = require("../config");
const nodemailler = require("nodemailer");

const transporter = nodemailler.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

const mailOptions = (
  to = "lorf1991@gmail.com",
  message = "some text ..... ",
  theme = "Магазин курсов",
  from = EMAIL
) => ({ from, to, subject: theme, html: message });

const sendEmail = (options) => transporter.sendMail(options);

module.exports = {
  mailOptions,
  sendEmail,
};
