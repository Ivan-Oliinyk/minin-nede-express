const { Router } = require("express");
const Course = require("../models/course");
const router = Router();

router.post("/add", async (req, res) => {
  try {
    const course = await Course.findById(req.body.id);
    console.log("req.user", req.user);

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
  // const card = await Card.fetch();
  // res.render("card", {
  //   title: "Корзина",
  //   isCard: true,
  //   courses: card.courses,
  //   price: card.price,
  // });

  res.json({ test: true });
});

module.exports = router;
