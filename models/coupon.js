const mongoose = require("mongoose");

const couponSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    unique: true,
    uppercase:true
  },
  expiry: {
    type: Date,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
});

const COUPON = mongoose.model("coupon", couponSchema);

module.exports = COUPON;
