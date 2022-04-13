require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const session = require("express-session");

const homeRoutes = require("./routes/home");
const cardRoutes = require("./routes/card");
const addRoutes = require("./routes/add");
const orderRoutes = require("./routes/order");
const coursesRoutes = require("./routes/courses");
const authRouter = require("./routes/auth");

const User = require("./models/user");
const createBaseUser = require("./helpers/createBaseUser");
const varMiddleware = require("./middleware/variables");

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(async (req, res, next) => {
  try {
    const user = await User.findById("62558c73ef610b536b984cb2");
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
  }
});

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "some secret value",
    resave: false,
    seveUninitialized: false,
  })
);
app.use(varMiddleware);

app.use("/", homeRoutes);
app.use("/add", addRoutes);
app.use("/courses", coursesRoutes);
app.use("/card", cardRoutes);
app.use("/order", orderRoutes);
app.use("/auth", authRouter);

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    const url = process.env.DB_URL;
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useFindAndModify: false,
    });

    createBaseUser();

    app.listen(PORT, () => {
      console.log(`\n Server is running on port ${PORT}... \n`);
    });
  } catch (e) {
    console.log(e);
  }
}

start();
