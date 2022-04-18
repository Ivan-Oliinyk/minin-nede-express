const { body } = require("express-validator/check");

exports.courseValidator = [
  body("title")
    .isLength({ min: 3, max: 50 })
    .withMessage("Название курса должно быть от 3 до 50 символов ")
    .trim(),
  body("price").isNumeric("Введите корректную цену"),
  body("img").isURL().withMessage("Введите корректный url картинки"),
];
