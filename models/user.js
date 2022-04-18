const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },

  password: {
    type: String,
    require: true,
  },

  name: {
    type: String,
    require: true,
    unique: true,
  },

  resetToken: String,
  resetTokenExp: Date,

  card: {
    items: [
      {
        count: {
          type: Number,
          require: true,
          default: 1,
        },

        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          require: true,
        },
      },
    ],
  },

  avatar: {
    type: String,
  },
});

userSchema.methods.addToCard = function (course) {
  const items = [...this.card.items];
  const idx = items.findIndex((item) => {
    return item.courseId.toString() === course._id.toString();
  });

  if (idx >= 0) {
    items[idx].count = items[idx].count + 1;
  } else {
    items.push({
      courseId: course._id,
      count: 1,
    });
  }

  this.card = { items };

  return this.save();
};

userSchema.methods.removeFromCard = function (id) {
  let items = [...this.card.items];
  const idx = items.findIndex(
    (item) => item.courseId.toString() === id.toString()
  );

  if (items[idx].count === 1) {
    items = items.filter(
      ({ courseId }) => courseId.toString() !== id.toString()
    );
  } else {
    items[idx].count--;
  }

  this.card = { items };

  return this.save();
};

userSchema.methods.clearCard = function () {
  this.card = { items: [] };

  return this.save();
};

module.exports = model("User", userSchema);
