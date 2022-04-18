const { Router } = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { validationResult } = require("express-validator/check");
const User = require("../models/user");
const router = Router();
const { sendEmail } = require("../mailler");
const registrationOptions = require("../email/registrationOptions");
const resetEmail = require("../email/resetEmail");
const config = require("../config");
const { registorValidator } = require("../helpers/validators/validators");

const {
  ROUTES: {
    BASE,
    AUTH_LOGIN,
    AUTH_LOGOUT,
    AUTH_LOGIN_REDIRECT,
    AUTH_REGISTER,
    AUTH_REGISTER_REDIRECT,
    AUTH_RESET_PASSWORD,
    AUTH_RESET_PASSWORD_TOKEN,
    AUTH_RESET_PASSWORD_REDIRECT,
    AUTH_PASSWORD_REDIRECT,
    AUTH_PASSWORD,
  },
} = config;

router.get(AUTH_LOGIN, async (req, res) => {
  res.render("auth/login", {
    title: "Авторизация",
    isLogin: true,
    loginError: req.flash("loginError"),
    registerError: req.flash("registerError"),
  });
});

router.get(AUTH_LOGOUT, async (req, res) => {
  try {
    req.session.destroy(() => {
      res.redirect(AUTH_LOGIN_REDIRECT);
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.post(AUTH_LOGIN, async (req, res) => {
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
          res.redirect(BASE);
        });
      } else {
        req.flash("loginError", "Неверный пароль !");
        res.redirect(AUTH_LOGIN_REDIRECT);
      }
    } else {
      req.flash("loginError", "Такого пользователя не существует !");
      res.redirect(AUTH_LOGIN_REDIRECT);
    }
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

router.post(AUTH_REGISTER, registorValidator, async (req, res) => {
  try {
    let { email, password, name, repeat } = req.body;
    email = email.toLowerCase();
    name = name.toLowerCase();

    const candidateName = await User.findOne({ name });
    const candidateEmail = await User.findOne({ email });
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash("registerError", errors.array()[0].msg);
      return res.status(422).redirect(AUTH_REGISTER_REDIRECT);
    }

    if (candidateEmail) {
      req.flash("registerError", "Пользователь с таким email уже существует !");

      return res.redirect(AUTH_REGISTER_REDIRECT);
    } else if (candidateName) {
      req.flash(
        "registerError",
        "Пользователь с таким именем уже существует !"
      );

      return res.redirect(AUTH_REGISTER);
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

        res.redirect(AUTH_LOGIN_REDIRECT);
        await sendEmail(registrationOptions(email, name));
      } else {
        req.flash("registerError", "Пароли должны совпадать !");
        res.redirect(AUTH_REGISTER_REDIRECT);
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.get(AUTH_RESET_PASSWORD, (req, res) => {
  res.render("auth/reset", {
    title: "Востановление пароля",
    error: req.flash("error"),
  });
});

router.get(AUTH_RESET_PASSWORD_TOKEN, async (req, res) => {
  const token = req.params.token;

  if (!token) {
    return res.redirect(AUTH_LOGIN);
  }

  try {
    const user = await User.findOne({
      resetToken: token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (!user) {
      res.redirect(AUTH + AUTH_LOGIN);
    } else {
      res.render("auth/password", {
        title: "Востановить доступ !",
        error: req.flash("confirmError"),
        userId: user._id.toString(),
        token,
      });
    }
  } catch (e) {
    console.log(e);
  }
});

router.post(AUTH_RESET_PASSWORD, (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash("error", "Что-то пошло не так повторите попытку позже !");
        return res.redirect(AUTH_RESET_REDIRECT);
      }

      const token = buffer.toString("hex");
      const candidate = await User.findOne({ email: req.body.email });

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;

        await candidate.save();
        await sendEmail(resetEmail(candidate.email, token));

        res.redirect(AUTH_LOGIN_REDIRECT);
      } else {
        req.flash("error", "Такого email нету !");
        res.redirect(AUTH_RESET_PASSWORD_REDIRECT);
      }
    });
  } catch (e) {
    console.log(e);
  }
});

router.post(AUTH_PASSWORD, async (req, res) => {
  try {
    const { userId, token, password, confirmPassword } = req.body;
    const user = await User.findOne({
      _id: userId,
      resetToken: token,
      resetTokenExp: { $gt: Date.now() },
    });

    if (confirmPassword !== password) {
      req.flash("confirmError", "Пароли должны совпадать !");
      return res.redirect(AUTH_PASSWORD_REDIRECT + token);
    }

    if (user) {
      user.password = await bcrypt.hash(password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;

      await user.save();

      res.redirect("/auth/login");
    } else {
      req.flash("error", "Время жизни токена истекло");
      res.redirect("auth/login");
    }
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
