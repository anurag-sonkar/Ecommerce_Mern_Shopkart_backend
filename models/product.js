const mongoose = require("mongoose");
var productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
    //   lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    brand: {
      type: String,
      enum: ["Apple", "Lenevo", "Asus", "Samsung", "Motorola"],
    },
    quantity: {
        type:Number,
        required:true
    },
    sold: {
      type: Number,
      default: 0,
      select:false // to hide it from user
    },
    images: {
      type: Array,
    },

    color: {
      type: String,
      enum: ["Black", "Brown", "Red"],
    },
    ratings: [
      {
        star: Number,
        comment: String,
        postedby: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],

    totalrating: {
      type: String,
      default: 0,
    },
  },
  { timestamps: true }
);

const PRODUCT = mongoose.model("Product", productSchema);

module.exports = PRODUCT;
