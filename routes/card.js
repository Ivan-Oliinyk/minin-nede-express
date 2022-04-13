const { Router } = require("express");
const Course = require("../models/course");
const router = Router();

router.post("/add", async (req, res) => {
  try {
    const course = await Course.findById(req.body.id);

    await req.user.addToCard(course);
    res.redirect("/card");
  } catch (e) {
    console.log(e);
  }
});

router.delete("/remove/:id", async (req, res) => {
  const card = await Card.remove(req.params.id);
  res.status(200).json(card);
});

router.get("/", async (req, res) => {
  const mapCartItems = (card) => {
    return card.items.map((course) => ({
      ...course.courseId._doc,
      count: course.count,
    }));
  };

  const getPrice = (courses) =>
    courses.reduce((total, { price, count }) => (total += price * count), 0);

  try {
    const user = await req.user.populate("card.items.courseId").execPopulate();
    const courses = mapCartItems(user.card);
    const price = getPrice(courses);

    res.render("card", {
      title: "Корзина",
      isCard: true,
      courses,
      price,
    });
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
