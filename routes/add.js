const { Router } = require("express");
const Course = require("../models/course");
const authMiddleware = require("../middleware/auth");
const router = Router();
const config = require("../config");
const {
  ROUTRES: { BASE, COURESE },
} = config;

router.get(BASE, authMiddleware, (req, res) => {
  res.render("add", {
    title: "Добавить курс",
    isAdd: true,
  });
});

router.post(BASE, authMiddleware, async (req, res) => {
  const course = new Course({
    title: req.body.title,
    price: req.body.price,
    img: req.body.img,
    userId: req.user,
  });

  try {
    await course.save();
    res.redirect(COURESE);
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
