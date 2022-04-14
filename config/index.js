require("dotenv").config();

module.exports = {
  MONGODB_URI: process.env.DB_URL,
  PORT: process.env.PORT,
  SESSION_SECRET: "some secret value",
};
