const { EMAIL } = require("../config");
const resetMessage = require("./message/reset");

module.exports = function (to, token) {
  const message = resetMessage(token);

  return {
    from: EMAIL,
    to: to,
    subject: "Востановление доступа",
    html: message,
  };
};
