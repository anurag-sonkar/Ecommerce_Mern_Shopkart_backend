const mongoose = require("mongoose");

const blogCategorySchema = mongoose.Schema( {
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

const BLOG_CATEGORY = mongoose.model("blog_category", blogCategorySchema);

module.exports = BLOG_CATEGORY;