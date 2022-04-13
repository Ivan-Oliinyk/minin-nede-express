const { Router } = require("express");
const router = Router();
const Order = require("../models/order");

router.get("/", async (req, res) => {
  try {
    const order = await Order.find({ "user.userId": req.user._id }).populate(
      "user.userId"
    );

    res.render("order", {
      isOrder: true,
      title: "Заказы",
      order: order.map((o) => ({
        ...o._doc,
        price: o.courses.reduce(
          (total, c) => (total += c.count * c.course.price),
          0
        ),
      })),
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await req.user.populate("card.items.courseId").execPopulate();

    const courses = user.card.items.map(({ count, courseId }) => ({
      count,
      course: { ...courseId._doc },
    }));

    const order = new Order({
      user: {
        name: req.user.name,
        userId: req.user,
      },

      courses,
    });

    await order.save();
    await req.user.clearCard();

    res.redirect("/order");
  } catch (e) {
    console.log(e);
  }
});

module.exports = router;
