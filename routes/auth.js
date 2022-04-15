const { Router } = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { route } = require("./home");
const router = Router();
const { mailOptions, sendEmail } = require("../mailler");
const { BASE_URL } = require("../config");

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Авторизация",
    isLogin: true,
    loginError: req.flash("loginError"),
    registerError: req.flash("registerError"),
  });
});

router.get("/logout", async (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect("/auth/login#login");
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.post("/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email.toLowerCase();

    const candidate = await User.findOne({ email });

    if (candidate) {
      const areSame = await bcrypt.compare(password, candidate.password);

      if (areSame) {
        const user = candidate;
        req.session.user = user;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) {
            throw err;
          }
          res.redirect("/");
        });
      } else {
        req.flash("loginError", "Неверный пароль !");
        res.redirect("/auth/login#login");
      }
    } else {
      req.flash("loginError", "Такого пользователя не существует !");
      res.redirect("/auth/login#login");
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

router.post("/register", async (req, res) => {
  try {
    let { email, password, name, repeat } = req.body;
    email = email.toLowerCase();
    name = name.toLowerCase();

    const candidateName = await User.findOne({ name });
    const candidateEmail = await User.findOne({ email });

    if (candidateEmail) {
      req.flash("registerError", "Пользователь с таким email уже существует !");

      return res.redirect("/auth/login#register");
    } else if (candidateName) {
      req.flash(
        "registerError",
        "Пользователь с таким именем уже существует !"
      );

      return res.redirect("/auth/login#register");
    } else {
      const confirmPassword = repeat === password;

      if (confirmPassword) {
        const hashPassword = await bcrypt.hash(password, 10);

        const user = new User({
          name: name.toLowerCase(),
          email: email.toLowerCase(),
          password: hashPassword,
          card: { items: [] },
        });

        await user.save();

        res.redirect("/auth/login#login");

        const message = `
        <html>
          <h1>Добро пожаловать ${name} !</h1>
          <p>Вы успешно создали аккаунт</p>

          <hr />
          <a href=${BASE_URL}>Перейти на сай</a>
          </html>
        `;

        await sendEmail(mailOptions(email, message));
      } else {
        req.flash("registerError", "Пароли должны совпадать !");
        res.redirect("/auth/login#register");
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

module.exports = router;
