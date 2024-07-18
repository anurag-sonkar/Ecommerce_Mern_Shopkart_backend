const mongoose = require("mongoose");

const productCategorySchema = mongoose.Schema( {
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

const PRODUCT_CATEGORY = mongoose.model("product_category", productCategorySchema);

module.exports = PRODUCT_CATEGORY;