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
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "category",
      type:String,
      required:true
    },
    brand: {
      type: String,
      requires:true
      // enum: ["Apple", "Lenevo", "Asus", "Samsung", "Motorola"],
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
    images: [
      {
        public_id: String,
        url: String,
      },
    ],

    color: [{type:mongoose.Schema.Types.ObjectId , ref:'color'}],
    tags:[],
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
