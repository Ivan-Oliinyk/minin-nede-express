const { validationResult } = require("express-validator/check");
const { Router } = require("express");
const { courseValidator } = require("../helpers/validators/courseValidator");
const Course = require("../models/course");
const authMiddleware = require("../middleware/auth");
const isOwner = require("../helpers/isOwner");
const router = Router();
const config = require("../config");
const {
  ROUTES: {
    BASE,
    COURSE_EDIT,
    COURESE,
    COURSE_REMOVE,
    COURSE_EDIT_POST,
    COURSE_ONE,
  },
} = config;

router.get(BASE, async (req, res) => {
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

router.get(COURSE_EDIT, authMiddleware, async (req, res) => {
  if (!req.query.allow) {
    return res.redirect(BASE);
  }

  const errors = validationResult(req);

  // if (!errors.isEmpty()) {
  //   return res.status(422).render("add", {
  //     title: `Редактировать ${course.title}`,
  //     isAdd: true,
  //     error: errors.array()[0].msg,
  //     data: {
  //       title: req.body.title,
  //       price: req.body.price,
  //       img: req.body.img,
  //     },
  //   });
  // }

  try {
    const course = await Course.findById(req.params.id);

    if (!isOwner(course.userId, req.user._id)) {
      return res.redirect(COURESE);
    }

    res.render("course-edit", {
      title: `Редактировать ${course.title}`,
      course,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post(COURSE_REMOVE, authMiddleware, async (req, res) => {
  try {
    await Course.findByIdAndRemove({
      _id: req.body.id,
      courseId: req.user._id,
    });
    res.redirect(COURESE);
  } catch (e) {
    console.log(e);
  }
});

router.post(
  COURSE_EDIT_POST,
  authMiddleware,
  courseValidator,
  async (req, res) => {
    const { id } = req.body;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).redirect(`/courses/${id}/edit?allow=true`);
    }

    try {
      delete req.body.id;

      const course = await Course.findById(id);

      if (!isOwner(course.userId, req.user._id)) {
        return res.redirect(COURESE);
      }

      Object.assign(course, req.body);
      await course.save();

      // await Course.findByIdAndUpdate(id, req.body);

      res.redirect(COURESE);
    } catch (e) {
      console.log(e);
    }
  }
);

router.get(COURSE_ONE, async (req, res) => {
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
