const Razorpay = require("razorpay");
const crypto = require("crypto");
const ORDER = require("../models/order.js");
const ADDRESS = require("../models/address.js");

const checkout = async (req, res) => {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });
  const options = {
    amount: Number(req.body.amount * 100),
    currency: "INR",
  };
  const order = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    order,
  });
};

const paymentVerification = async (req, res) => {
  //   const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
  //     req.body;
  const {
    shippingInfo,
    paymentInfo,
    orderItems,
    totalPrice,
    totalPriceAfterDiscount,
  } = req.body;
  const { _id } = req.user;

  const body =
    paymentInfo.razorpay_order_id + "|" + paymentInfo.razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  // console.log("Expected Signature:", expectedSignature);
  // console.log("Received Signature:", razorpay_signature);
  const isAuthentic = expectedSignature === paymentInfo.razorpay_signature;

  if (isAuthentic) {
    // Database comes here
    const address = await ADDRESS.findOne({
      user: _id,
      "details._id": shippingInfo,
    });
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Extract the specific detail from the details array
    const specificDetail = address.details.id(shippingInfo);
    if (!specificDetail) {
      return res.status(404).json({ message: "Address detail not found" });
    }

    const order = await ORDER.create({
      shippingInfo: specificDetail,
      paymentInfo: {
        razaorpayOrderId: paymentInfo.razorpay_order_id,
        razaorpayPaymentId: paymentInfo.razorpay_payment_id,
      },
      orderItems,
      totalPrice,
      totalPriceAfterDiscount,
      user: _id,
    });


    // Populate the necessary fields
    //   const response = await order.populate([
    // 	{ path: 'user', model: 'User' },
    // 	{ path: 'orderItems.product', model: 'Product' },
    // 	{ path: 'orderItems.color', model: 'color' },
    //   ]);

    // console.log("Payment ID before redirect:", paymentInfo.razorpay_payment_id);
    const redirectUrl = `${process.env.PAYMENT_SUCCESS_PAGE}paymentsuccess?reference=${paymentInfo.razorpay_payment_id}`;
    res.json({
      success: true,
      redirectUrl: redirectUrl,
      message: "order placed successfully",
    });
  } else {
    res.status(400).json({
      success: false,
    });
  }
};

module.exports = { checkout, paymentVerification };
