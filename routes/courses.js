const { Router } = require("express");
const Course = require("../models/course");
const authMiddleware = require("../middleware/auth");
const isOwner = require("../helpers/isOwner");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("userId", "email name")
      .select("price title img");

    res.render("courses", {
      title: "Курсы",
      isCourses: true,
      userId: req.user ? req.user._id.toString() : null,
      courses,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.get("/:id/edit", authMiddleware, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect("/");
  }

  try {
    const course = await Course.findById(req.params.id);

    if (isOwner(course.userId, req.user._id)) {
      return res.redirect("/courses");
    }

    res.render("course-edit", {
      title: `Редактировать ${course.title}`,
      course,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/remove", authMiddleware, async (req, res) => {
  try {
    await Course.findByIdAndRemove(req.body.id);
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

router.post("/edit", authMiddleware, async (req, res) => {
  try {
    const { id } = req.body;
    delete req.body.id;

    await Course.findByIdAndUpdate(id, req.body);
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    res.render("course", {
      layout: "empty",
      title: `Курс ${course.title}`,
      course,
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
