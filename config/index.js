require("dotenv").config();
const routes = require("./routes");

module.exports = {
  MONGODB_URI: process.env.DB_URL,
  PORT: process.env.PORT,

  SESSION_SECRET: process.env.SESSION_SECRET,

  EMAIL: process.env.EMAIL,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_SERVICE: process.env.EMAIL_SERVICE,

  BASE_URL: process.env.BASE_URL + ":" + process.env.PORT,

  ROUTES: routes,
};
