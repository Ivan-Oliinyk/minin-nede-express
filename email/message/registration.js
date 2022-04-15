const { BASE_URL } = require("../../config");

module.exports = function (name) {
  const user = name.slice(0, 1).toUpperCase() + name.slice(1);

  return `
      <html>
        <h1>Добро пожаловать ${user}!</h1>
        <p>Вы успешно создали аккаунт</p>

        <hr />
        <a href=${BASE_URL}>Перейти на сай</a>
        </html>
    `;
};
