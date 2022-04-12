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
          require: true,
        },
      },
    ],
  },
});

module.exports = model("User", userSchema);
