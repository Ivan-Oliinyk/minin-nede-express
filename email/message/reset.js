const { BASE_URL } = require("../../config");

module.exports = function (token) {
  return `
      <html>
        <h1>Вы забыли пароль ?</h1>
        <p>Если нет, то проигнорируйте данное письмо !</p>
        <p>Иначе нажмите на ссылуку ниже :</p>
        <p>
          <a href="${BASE_URL}/auth/password/${token}">Востановления доступа</a>
        </p>

        <hr />
        <a href=${BASE_URL}>Перейти на сай</a>
        </html>
    `;
};
