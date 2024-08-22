const ADDRESS = require('../models/address')
const mongoose = require('mongoose')
var uniqid = require('uniqid'); 
const { response } = require("express");
const ORDER = require("../models/order");

// orders
// const handleCreateOrder = async(req,res)=>{
//   const {COD , couponApplied} = req.body
//   const {id} = req.user

//   if(!COD) return res.status(400).json({message:"COD order failed"})
//   try {
//     let userCart = await CART.findOne({orderby:id})
//     // console.log(userCart)
//     let finalAmount = 0

//     if (couponApplied && userCart.totalAfterDiscount) {
//       finalAmount = userCart.totalAfterDiscount;
//     } else {
//       finalAmount = userCart.cartTotal;
//     }

//     let newOrder = await new  ORDER({
//       products:userCart.products,
//       paymentIntent:{
//         id: uniqid(),
//         method:"COD",
//         amount:finalAmount,
//         status:"Cash on Delivery",
//         created :Date.now(),
//         currency:"usd"
//       },
//       orderby:req.user.id,
//       orderStatus:"Cash on Delivery"
//     }).save()

//     let update = userCart.products.map((item) => {
//       return {
//         updateOne: {
//           filter: { _id: item.product._id },
//           update: { $inc: { quantity: -item.count, sold: +item.count } },
//         },
//       };
//     });
//     const updated = await PRODUCT.bulkWrite(update, {});
//     res.status(200).json({ message: "success" });

//   } catch (error) {
//     return res.status(400).json(error.message);

//   }
// }

// const handleGetOrder = async (req, res) => {
//   const { id } = req.user;
//   try {
//     const userorders = await ORDER.findOne({ orderby: id })
//       .populate("products.product")
//       .populate("orderby")
//       .exec();
//       console.log(userorders)
//     res.json(userorders);
//   } catch (error) {
//     return res.status(500).json({message:error.message})

//   }
// }

const handleGetAllOrders = async (req, res) => {
  try {
    const alluserorders = await ORDER.find().populate("user", [
      "name",
      "email",
      "imgpath",
    ]);
    // .populate("products.product")
    // .populate("orderby")
    // .exec();
    return res.json({
      status: "success",
      message: "orders fetched successfully",
      response: alluserorders,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// const handleGetOrderByUserId = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const userorders = await ORDER.findOne({ orderby: id })
//       .populate("products.product")
//       .populate("orderby")
//       .exec();
//     res.json(userorders);
//   } catch (error) {
//     return res.status(500).json({message:error.message})

//   }
// }

const handleUpdateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    // Find the order to get the current paymentIntent
    const order = await ORDER.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update only the status field of the paymentIntent
    const updatedPaymentIntent = { ...order.paymentIntent, status: status };

    // Update the order with the new status and the updated paymentIntent
    const updateOrderStatus = await ORDER.findByIdAndUpdate(
      { _id: id },
      {
        orderStatus: status,
        paymentIntent: updatedPaymentIntent,
      },
      { new: true }
    );

    if (updateOrderStatus) {
      const updatedOrder = await ORDER.find();
      // .populate("products.product")
      // .populate("orderby")
      // .exec();;
      return res
        .status(200)
        .json({
          response: updatedOrder,
          message: "Order updated successfully",
        });
    } else {
      return res.status(400).json({ message: "Order update failed" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

{
  /* changing */
}
const handleCreateOrder = async (req, res) => {
  try {
    const {
      shippingInfo,
      paymentInfo,
      orderItems,
      totalPrice,
      totalPriceAfterDiscount,
    } = req.body;
    const { _id } = req.user;

    const address = await ADDRESS.findOne({
      user: _id,
      "details._id": shippingInfo,
    });
    // console.log(address)
    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    // Extract the specific detail from the details array
    const specificDetail = address.details.id(shippingInfo);
    // console.log(specificDetail)
    if (!specificDetail) {
      return res.status(404).json({ message: "Address detail not found" });
    }

    const order = await ORDER.create({
      shippingInfo: specificDetail,
      paymentInfo,
      orderItems,
      totalPrice,
      totalPriceAfterDiscount,
      user: _id,
    });

    // Populate the necessary fields
    const response = await order.populate([
      { path: "user", model: "User" },
      { path: "orderItems.product", model: "Product" },
      { path: "orderItems.color", model: "color" },
    ]);

    return res.json({
      message: "order placed successfully",
      response: response,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

{
  /* user specific order using its id */
}
const handleGetUserOrder = async (req, res) => {
  const { _id } = req.user;
  if (!_id) return res.status(400).json({ message: "login required" });
  try {
    const userOrders = await ORDER.find({ user: _id });
    if (userOrders) {
      return res
        .status(200)
        .json({ message: "orders fetched successfully", response: userOrders });
    } else {
      return res.status(400).json({ message: "no order" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMonthWiseOrderIncome = async (req, res) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let d = new Date();
  d.setDate(1);

  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
  }

  const endDate = monthNames[d.getMonth()] + " " + d.getFullYear();

  try {
    const data = await ORDER.aggregate([
      {
        $match: {
          createdAt: {
            $lte: new Date(),
            $gte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          amount: { $sum: "$totalPriceAfterDiscount" },
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $arrayElemAt: [monthNames, { $subtract: ["$_id.month", 1] }],
          },
          year: "$_id.year",
          amount: 1,
        },
      },
      {
        $sort: { year: 1, month: 1 },
      },
    ]);

    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

const getMonthWiseOrderCount = async (req, res) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let d = new Date();
  d.setDate(1);

  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
  }

  const endDate = monthNames[d.getMonth()] + " " + d.getFullYear();

  try {
    const data = await ORDER.aggregate([
      {
        $match: {
          createdAt: {
            $lte: new Date(),
            $gte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          orderCount: { $sum: 1 }, // Counting the number of orders
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $arrayElemAt: [monthNames, { $subtract: ["$_id.month", 1] }],
          },
          year: "$_id.year",
          orderCount: 1,
        },
      },
      {
        $sort: { year: 1, month: 1 },
      },
    ]);

    console.log(data);
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
};

// combining getMonthWiseOrderIncome and getMonthWiseOrderCount in one
const getMonthWiseOrderStats = async (req, res) => {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let d = new Date();
  d.setDate(1);

  for (let index = 0; index < 11; index++) {
    d.setMonth(d.getMonth() - 1);
  }

  const endDate = monthNames[d.getMonth()] + " " + d.getFullYear();

  try {
    const data = await ORDER.aggregate([
      {
        $match: {
          createdAt: {
            $lte: new Date(),
            $gte: new Date(endDate),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
          },
          amount: { $sum: "$totalPriceAfterDiscount" }, // Summing the total amount for each month
          orderCount: { $sum: 1 }, // Counting the number of orders for each month
        },
      },
      {
        $project: {
          _id: 0,
          month: {
            $arrayElemAt: [monthNames, { $subtract: ["$_id.month", 1] }],
          },
          year: "$_id.year",
          amount: 1,
          orderCount: 1,
        },
      },
      {
        $sort: { year: 1, month: 1 },
      },
    ]);

    console.log(data);
    res.status(200).json({ message: "success", response: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const getYearWiseOrderStats = async (req, res) => {
  try {
    const data = await ORDER.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
          },
          totalOrders: { $sum: 1 }, // Counting the number of orders for each year
          totalAmount: { $sum: "$totalPriceAfterDiscount" }, // Summing the total amount for each year
        },
      },
      {
        $project: {
          _id: 0,
          year: "$_id.year",
          totalOrders: 1,
          totalAmount: 1,
        },
      },
      {
        $sort: { year: 1 }, // Sorting the result by year in ascending order
      },
    ]);

    res.status(200).json({ message: "success", response: data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  handleCreateOrder,
  handleGetUserOrder,
  getMonthWiseOrderIncome,
  getMonthWiseOrderCount,
  getMonthWiseOrderStats,
  getYearWiseOrderStats,
  // handleGetOrder,
  handleGetAllOrders,
  // handleGetOrderByUserId,
  handleUpdateOrderStatus,
};
