const { EMAIL } = require("../config");
const registartionMeassage = require("./message/registration");

module.exports = function (to, name) {
  const message = registartionMeassage(name);

  return {
    from: EMAIL,
    to: to,
    subject: "Магазин курсов | Регистрация",
    html: message,
  };
};
