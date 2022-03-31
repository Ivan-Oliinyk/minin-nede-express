const { Router } = require("express");
const router = Router();
const Course = require("../models/course");

router.get("/", (req, res) => {
  res.render("add", { title: "Add", isAdd: true });
});

router.post("/", async (req, res) => {
  const course = new Course(req.body.title, req.body.img, req.body.price);

  await course.save();

  res.redirect("/courses");
});

module.exports = router;
