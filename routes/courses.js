const { Router } = require("express");
const Course = require("../models/course");
const router = Router();

router.get("/", async (req, res) => {
  try {
    const courses = await Course.find();
    //   .populate("userId", "name email")
    //   .select("price title img");
    // console.log("courses ===>", courses);

    res.render("courses", {
      title: "Курсы",
      isCourses: true,
      courses,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json(e);
  }
});

router.get("/:id/edit", async (req, res) => {
  try {
    if (!req.query.allow) {
      return res.redirect("/");
    }

    const course = await Course.findById(req.params.id);

    res.render("course-edit", {
      title: `Редактировать ${course.title}`,
      course,
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/remove", async (req, res) => {
  try {
    await Course.findByIdAndRemove(req.body.id);
    res.redirect("/courses");
  } catch (e) {
    console.log(e);
  }
});

router.post("/edit", async (req, res) => {
  const { id } = req.body;
  delete req.body.id;
  await Course.findByIdAndUpdate(id, req.body);
  res.redirect("/courses");
});

router.get("/:id", async (req, res) => {
  const course = await Course.findById(req.params.id);
  res.render("course", {
    layout: "empty",
    title: `Курс ${course.title}`,
    course,
  });
});

module.exports = router;
