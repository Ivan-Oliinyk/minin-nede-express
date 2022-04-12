const User = require("../models/user");

const createBaseUser = async () => {
  try {
    const candidate = await User.findOne();

    if (!candidate) {
      const user = new User({
        email: "root@gmail.com",
        password: "root",
        name: "user",
        card: { items: [] },
      });

      await user.save();
    }
  } catch (e) {
    console.log(e);
  }
};

module.exports = createBaseUser;
