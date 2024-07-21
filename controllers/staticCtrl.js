const CART = require("../models/cart");
const COUPON = require("../models/coupon");
const ORDER = require("../models/order");
const PRODUCT = require("../models/product");
const USER = require("../models/user");
const bcrypt = require("bcryptjs");
var uniqid = require('uniqid'); 

const handleGetUser = async (req, res) => {
  try {
    const validUserOne = await USER.findOne({ _id: req.userid });
    res.status(201).json({ status: 201, validUserOne });
  } catch (error) {
    res.status(401).json({ status: 401, error: error.message });
  }
};

const handleGetAllUsersInfo = async (req, res) => {
  try {
    const users = await USER.find();
    res.status(200).json({ status: 201, users: users });
  } catch (error) {
    res.status(401).json({ status: 401, error: error.message });
  }
};

const handleGetUserInfo = async (req, res) => {
  const id = req.userid;
  try {
    const user = await USER.findOne({ _id: id });
    res.status(200).json({ status: 200, user: user });
  } catch (error) {
    res.status(401).json({ status: 401, error: error.message });
  }
};

const handleDeleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await USER.deleteOne({ _id: id });
    res.status(200).json({ status: 200, message: response });
  } catch (error) {
    res.status(401).json({ status: 401, error: error.message });
  }
};

const handleUpdateUser = async (req, res) => {
  const id = req.userid;
  const { name, password, cpassword } = req.body;

  try {
    // Check if password and cpassword are provided and match
    if (password && cpassword && password === cpassword) {
      // Hash the new passwords
      const hashedPassword = await bcrypt.hash(password, 10);
      const hashedCpassword = await bcrypt.hash(cpassword, 10);

      // Update the user document with hashed passwords
      const response = await USER.findByIdAndUpdate(
        { _id: id },
        { name, password: hashedPassword, cpassword: hashedCpassword }
      );

      // Check if the user was found and updated
      if (!response) {
        return res.status(404).json({ error: "User not found" });
      }

      res
        .status(200)
        .json({ status: 200, message: "User updated successfully" });
    } else {
      // Handle case where passwords don't match or are not provided
      return res.status(400).json({ error: "Passwords do not match" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const handleBlockUser = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await USER.findByIdAndUpdate(
      { _id: id },
      { isBlocked: true },
      { new: true } // returns the updated document
    );

    if (!response) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    res.status(200).json({ status: 200, message: "User blocked successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const handleUnblockUser = async (req, res) => {
  const id = req.params.id;
  try {
    const response = await USER.findByIdAndUpdate(
      { _id: id },
      { isBlocked: false },
      { new: true } // returns the updated document
    );

    if (!response) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }

    res
      .status(200)
      .json({ status: 200, message: "User UnBlocked successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const handleLogout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((elem) => {
      return elem.token !== req.token;
    });

    req.user.save();
    res.status(200).json({ status: 200, message: "logout successfully" });
  } catch (error) {
    res.status(401).json({ status: 401, error: error.message });
  }
};

const handleChangePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user._id; // for req.user._id

  try {
    // Find the user by ID
    const user = await USER.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validate current password
    console.log("Matching Start");
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log("Matching end");
    console.log("Check Match", isMatch);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    // Hash the new password - no need becoz when save then pre middleware runs which will hash
    // const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(401).json({ status: 401, error: error.message });
  }
};

const handleGetUserWishlist = async (req, res) => {
  const { id } = req.user;
  try {
    const response = await USER.findById(id).populate("wishlist");
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const handleAddAddress = async (req, res) => {
  const { id } = req.user;
  const { address } = req.body;
  console.log(id, address);

  if (!address)
    return res
      .status(400)
      .json({ status: "failed", message: "address not provided" });

  try {
    const response = await USER.findByIdAndUpdate(
      id,
      {
        address: address,
      },
      { new: true }
    );

    return res
      .status(400)
      .json({
        status: "success",
        message: "Address Added",
        response: response,
      });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// cart

const handleUserCart = async (req, res) => {
  const { cart } = req.body;
  const user = req.user;
  try {
    let products = [];
    // const user = await USER.findById(id);
    // check if user already have product in cart
    const alreadyExistCart = await CART.findOne({ orderby: user.id });
    // console.log(alreadyExistCart)
    if (alreadyExistCart) {
      await CART.findByIdAndDelete(alreadyExistCart._id);
      // alreadyExistCart.deleteOne();
    }
    for (let i = 0; i < cart.length; i++) {
      let object = {};
      object.product = cart[i].id;
      object.count = cart[i].count;
      object.color = cart[i].color;
      let getPrice = await PRODUCT.findById(cart[i].id).select("price").exec();
      object.price = getPrice.price;
      products.push(object);
    }
    let cartTotal = 0;
    for (let i = 0; i < products.length; i++) {
      cartTotal = cartTotal + products[i].price * products[i].count;
    }
    let newCart = await new CART({
      products,
      cartTotal,
      orderby: user?.id,
    }).save();

    // Populate the product field in the response
    // newCart = await CART.findById(newCart.id).populate('products.product').lean().exec();

    res.status(201).json(newCart);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const hanldeGetUserCart = async (req, res) => {
  const { id } = req.user;
  try {
    const cart = await CART.findOne({ orderby: id }).populate(
      "products.product"
    );
    res.status(200).json({ response: cart });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const handleEmptyUserCart = async (req, res) => {
  const { id } = req.user;
  try {
    // const user = await USER.findOne({ _id });
    const cart = await CART.findOneAndDelete({ orderby: id });
    res.status(200).json(cart);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

// apply coupon - later will update to toggle coupon
const handleApplyCoupon = async (req, res) => {
  const { coupon } = req.body;
  const { id } = req.user;

  const isValidCoupon = await COUPON.findOne({ name: coupon });
  if (!isValidCoupon) return res.status(400).json("Not a valid coupon");

  try {
    // find products and cartTotal of that user-cart (stored using CART model)
    let { products, cartTotal } = await CART.findOne({ orderby: id });

    let totalCartValueAfterDiscount = Number(
      (cartTotal - (cartTotal * isValidCoupon.discount) / 100).toFixed(2)
    );

    await CART.findOneAndUpdate(
      { orderby: id },
      { totalAfterDiscount: totalCartValueAfterDiscount },
      { new: true }
    );

    return res
      .status(201)
      .json({
        status: "success",
        message: `${isValidCoupon.name} Applied`,
        totalAfterDiscount: totalCartValueAfterDiscount,
      });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};


// orders
const handleCreateOrder = async(req,res)=>{
  const {COD , couponApplied} = req.body
  const {id} = req.user

  if(!COD) return res.status(400).json({message:"COD order failed"})
  try {
    let userCart = await CART.findOne({orderby:id})
    // console.log(userCart)
    let finalAmount = 0

    if (couponApplied && userCart.totalAfterDiscount) {
      finalAmount = userCart.totalAfterDiscount;
    } else {
      finalAmount = userCart.cartTotal;
    }

    let newOrder = await new  ORDER({
      products:userCart.products,
      paymentIntent:{
        id: uniqid(),
        method:"COD",
        amount:finalAmount,
        status:"Cash on Delivery",
        created :Date.now(),
        currency:"usd"
      },
      orderby:req.user.id,
      orderStatus:"Cash on Delivery"
    }).save()

    let update = userCart.products.map((item) => {
      return {
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { quantity: -item.count, sold: +item.count } },
        },
      };
    });
    const updated = await PRODUCT.bulkWrite(update, {});
    res.status(200).json({ message: "success" });

  } catch (error) {
    return res.status(400).json(error.message);

    
  }
}


const handleGetOrder = async (req, res) => {
  const { id } = req.user;
  try {
    const userorders = await ORDER.findOne({ orderby: id })
      .populate("products.product")
      .populate("orderby")
      .exec();
      console.log(userorders)
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
}

const handleGetAllOrders = async (req, res) => {
  try {
    const alluserorders = await ORDER.find()
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(alluserorders);
  } catch (error) {
    throw new Error(error);
  }
}

const handleGetOrderByUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const userorders = await ORDER.findOne({ orderby: id })
      .populate("products.product")
      .populate("orderby")
      .exec();
    res.json(userorders);
  } catch (error) {
    throw new Error(error);
  }
}

const handleUpdateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;
  try {
    const updateOrderStatus = await ORDER.findByIdAndUpdate(
      id,
      {
        orderStatus: status,
        paymentIntent: {
          status: status,
        },
      },
      { new: true }
    );
    res.json(updateOrderStatus);
  } catch (error) {
    throw new Error(error);
  }
}

module.exports = {
  handleGetUser,
  handleGetAllUsersInfo,
  handleGetUserInfo,
  handleDeleteUser,
  handleUpdateUser,
  handleBlockUser,
  handleUnblockUser,
  handleLogout,
  handleChangePassword,
  handleGetUserWishlist,
  handleAddAddress,
  handleUserCart,
  hanldeGetUserCart,
  handleEmptyUserCart,
  handleApplyCoupon,
  handleCreateOrder,
  handleGetOrder,
  handleGetAllOrders,
  handleGetOrderByUserId,
  handleUpdateOrderStatus
};
