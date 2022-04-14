const { Router } = require("express");
const User = require("../models/user");
const router = Router();

router.get("/login", async (req, res) => {
  res.render("auth/login", {
    title: "Авторизация",
    isLogin: true,
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
    const user = await User.findById("62558c73ef610b536b984cb2");
    req.session.user = user;
    req.session.isAuthenticated = true;
    req.session.save((err) => {
      if (err) {
        throw err;
      }
      res.redirect("/");
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
