const { Router } = require("express");
const Course = require("../models/course");
const Card = require("../models/card");
const router = Router();

router.post("/add", async (req, res) => {
  const course = await Course.getById(req.body.id);
  await Card.add(course);
  res.redirect("/card");
});

router.get("/", async (req, res) => {
  const card = await Card.fetch();
  res.render("card", {
    title: "Course | Card",
    isCard: true,
    courses: card.courses,
    price: card.price,
  });
});

router.delete("/remove/:id", async (req, res) => {
  const card = await Card.remove(req.params.id);
  res.status(200).json(card);
});

module.exports = router;
