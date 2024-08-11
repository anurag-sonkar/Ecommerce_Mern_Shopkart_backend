const mongoose = require("mongoose"); // Erase if already required

// Declare the Schema of the Mongo model
// var orderSchema = new mongoose.Schema(
//   {
//     products: [
//       {
//         product: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Product",
//         },
//         count: Number,
//         color: String,
//       },
//     ],
//     paymentIntent: {},
//     orderStatus: {
//       type: String,
//       default: "Not Processed",
//       enum: [
//         "Not Processed",
//         "Cash on Delivery",
//         "Processing",
//         "Dispatched",
//         "Cancelled",
//         "Delivered",
//       ],
//     },
//     orderby: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

var orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shippingInfo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    paymentInfo: {
      razaorpayOrderId: {
        type: String,
        required: true,
      },
      razaorpayPaymentId: {
        type: String,
        required: true,
      },
    },

    orderItems:[
      {
        product:{
          type:mongoose.Schema.Types.ObjectId,
          ref:"Product",
          required:true
        }
      }
    ]
  },

  {
    timestamps: true,
  }
);

const ORDER = mongoose.model("Order", orderSchema);

//Export the model
module.exports = ORDER;
