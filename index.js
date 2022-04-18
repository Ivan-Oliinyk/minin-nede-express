const express = require("express");
const path = require("path");
const csrf = require("csurf");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const exphbs = require("express-handlebars");
const helmet = require("helmet");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const config = require("./config");
const homeRoutes = require("./routes/home");
const cardRoutes = require("./routes/card");
const addRoutes = require("./routes/add");
const orderRoutes = require("./routes/order");
const coursesRoutes = require("./routes/courses");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");
const notFoundPage = require("./middleware/notFound404");
const serverRun = require("./helpers/serverRun");
const fileMiddleware = require("./middleware/fileMiddleware");

const {
  ROUTES: { BASE, COURSE_ADD, COURESE, CARD, ORDER, AUTH, PROFILE },
  PORT,
  MONGODB_URI,
  SESSION_SECRET,
} = config;

const app = express();

const hbs = exphbs.create({
  defaultLayout: "main",
  extname: "hbs",
  helpers: require("./helpers/hbs-helpers"),
});

const store = new MongoStore({
  collection: "sessions",
  uri: MONGODB_URI,
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "views");

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    seveUninitialized: false,
    store,
  })
);
app.use(fileMiddleware.single("avatar"));
app.use(csrf());
app.use(flash());
app.use(helmet());
app.use(varMiddleware);
app.use(userMiddleware);

app.use(BASE, homeRoutes);
app.use(COURSE_ADD, addRoutes);
app.use(COURESE, coursesRoutes);
app.use(CARD, cardRoutes);
app.use(ORDER, orderRoutes);
app.use(AUTH, authRouter);
app.use(PROFILE, profileRouter);

app.use(notFoundPage);

async function start() {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
    });

    app.listen(PORT || 3000, () => {
      console.log(serverRun(PORT));
    });
  } catch (e) {
    console.log(e);
  }
}

start();
