const { EMAIL_SERVICE, EMAIL, EMAIL_PASSWORD } = require("../config");
const nodemailler = require("nodemailer");

const transporter = nodemailler.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD,
  },
});

const sendEmail = (options) => transporter.sendMail(options);

module.exports = {
  sendEmail,
};
