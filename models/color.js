const mongoose = require("mongoose");

const colorSchema = mongoose.Schema( {
    color: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  })

const COLOR = mongoose.model("color", colorSchema);

module.exports = COLOR;