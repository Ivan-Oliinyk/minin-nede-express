const { Router } = require("express");
const router = Router();
const authMiddleware = require("../middleware/auth");
const config = require("../config/index");
const {
  ROUTES: { BASE },
} = config;

router.get("/", async (req, res) => {
  res.render("profile", {
    title: "Профиль",
    isProfile: true,
    user: req.user.toObject(),
  });
});

router.post("/", async (req, res) => {});

module.exports = router;
