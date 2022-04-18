const { Router } = require("express");
const Course = require("../models/course");
const authMiddleware = require("../middleware/auth");
const router = Router();
const config = require("../config");
const {
  ROUTES: { COURSE_ADD, CARD, CARD_REMOVE },
} = config;

const mapCartItems = (card) => {
  return card.items.map((course) => ({
    ...course.courseId._doc,
    id: course.courseId.id,
    count: course.count,
  }));
};

const getPrice = (courses) =>
  courses.reduce((total, { price, count }) => (total += price * count), 0);

router.post(COURSE_ADD, authMiddleware, async (req, res) => {
  try {
    const course = await Course.findById(req.body.id);
    await req.user.addToCard(course);
    res.redirect(CARD);
  } catch (e) {
    console.log(e);
  }
});

router.delete(CARD_REMOVE, authMiddleware, async (req, res) => {
  try {
    await req.user.removeFromCard(req.params.id);
    const user = await req.user.populate("card.items.courseId").execPopulate();

    const courses = mapCartItems(user.card);
    const card = {
      courses,
      price: getPrice(courses),
    };

    res.status(200).json(card);
  } catch (e) {
    console.log(e);
  }
});

router.get("/", authMiddleware, async (req, res) => {
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
