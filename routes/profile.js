const { Router } = require("express");
const router = Router();
const authMiddleware = require("../middleware/auth");
const config = require("../config/index");
const User = require("../models/user");
const {
  ROUTES: { BASE, PROFILE },
} = config;

router.get(BASE, authMiddleware, async (req, res) => {
  res.render("profile", {
    title: "Профиль",
    isProfile: true,
    user: req.user.toObject(),
  });
});

router.post(BASE, authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const toChange = {
      name: req.body.name,
    };

    if (req.file) {
      toChange.avatar = req.file.path;
    }

    Object.assign(user, toChange);

    await user.save();

    res.redirect(PROFILE);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
