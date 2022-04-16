const { body, validationResult } = require("express-validator/check");

module.exports = [
  body("email").isEmail().withMessage("Ведите коррекстный email !"),
  body("password")
    .isLength({ min: 6, max: 20 })
    .withMessage("Пароль должен быть от 6 до 20 символов !")
    .isAlphanumeric()
    .withMessage(
      "Пароль доложен состоять из латинских символов, цифр или символов"
    ),
  body("name")
    .isLength({
      min: 2,
      max: 20,
    })
    .withMessage("Имя должно быть от 2 до 20 символов !"),
];
