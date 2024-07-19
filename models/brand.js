const mongoose = require("mongoose");

const brandSchema = mongoose.Schema( {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  })

const BRAND = mongoose.model("brand", brandSchema);

module.exports = BRAND;