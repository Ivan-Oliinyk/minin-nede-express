require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const homeRoutes = require("./routes/home");
const coursesRoutes = require("./routes/courses");
const cardRoutes = require("./routes/card");
const homeAdd = require("./routes/add");

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use("/", homeRoutes);
app.use("/add", homeAdd);
app.use("/courses", coursesRoutes);
app.use("/card", cardRoutes);

const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;

async function start() {
  try {
    await mongoose.connect(DB_URL, { useNewUrlParser: true });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT} ... `);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
