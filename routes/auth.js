const { Router } = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/user");
const router = Router();
const { sendEmail } = require("../mailler");
const registrationOptions = require("../email/registrationOptions");
const resetEmail = require("../email/resetEmail");

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
        await sendEmail(registrationOptions(email, name));
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

router.get("/reset", (req, res) => {
  res.render("auth/reset", {
    title: "Востановление пароля",
    error: req.flash("error"),
  });
});

router.post("/reset", (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash("error", "Что-то пошло не так повторите попытку позже !");
        return res.redirect("/auth/reset");
      }

      const token = buffer.toString("hex");
      const candidate = await User.findOne({ email: req.body.email });

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;

        await candidate.save();
        await sendEmail(resetEmail(candidate.email, token));

        res.redirect("/auth/login");
      } else {
        req.flash("error", "Такого email нету !");
        res.redirect("/auth/reset");
      }
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
