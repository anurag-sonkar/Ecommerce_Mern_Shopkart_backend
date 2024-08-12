const CART = require("../models/cart");
const COUPON = require("../models/coupon");
const ORDER = require("../models/order");
const PRODUCT = require("../models/product");
const USER = require("../models/user");
const bcrypt = require("bcryptjs");
const ADDRESS = require('../models/address')
const mongoose = require('mongoose')
var uniqid = require('uniqid'); 

const handleGetAllUsersInfo = async (req, res) => {
  try {
    const users = await USER.find({role:'user'});
    res.status(200).json({ status: 201, users: users });
  } catch (error) {
    res.status(401).json({ status: 401, error: error.message });
  }
};
const handleGetUser = async (req, res) => {
  try {
    const validUserOne = await USER.findOne({ _id: req.userid });
    res.status(201).json({ status: 201, validUserOne });
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
  console.log(req.user)
  try {
    req.user.tokens = req.user.tokens.filter((elem) => {
      return elem.token !== req.token;
    });

    req.user.save();
    res.status(200).json({ status: 200 ,message: "logout successfully" });
  } catch (error) {
    res.status(401).json({ status: 401, message: error.message });
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
    res.status(401).json({ status: 401, message: error.message });
  }
};

const handleGetUserWishlist = async (req, res) => {
  const { id } = req.user;
  try {
    const response = await USER.findById(id).populate("wishlist");
    res.status(200).json({response :response , message : "wishlist fetched successfully"});
  } catch (error) {
    return res.status(400).json({ message: error.message });
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

// const handleUserCart = async (req, res) => {
//   const { cart } = req.body;
//   console.log(cart)
//   const user = req.user;
//   try {
//     let products = [];
//     // const user = await USER.findById(id);
//     // check if user already have product in cart
//     const alreadyExistCart = await CART.findOne({ orderby: user.id });
//     // console.log(alreadyExistCart)
//     if (alreadyExistCart) {
//       await CART.findByIdAndDelete(alreadyExistCart._id);
//       // alreadyExistCart.deleteOne();
//     }
//     for (let i = 0; i < cart.length; i++) {
//       let object = {};
//       object.product = cart[i].id;
//       object.count = cart[i].count;
//       object.color = cart[i].color;
//       let getPrice = await PRODUCT.findById(cart[i].id).select("price").exec();
//       object.price = getPrice.price;
//       products.push(object);
//     }
//     let cartTotal = 0;
//     for (let i = 0; i < products.length; i++) {
//       cartTotal = cartTotal + products[i].price * products[i].count;
//     }
//     let newCart = await new CART({
//       products,
//       cartTotal,
//       orderby: user?.id,
//     }).save();

//     // Populate the product field in the response
//     // newCart = await CART.findById(newCart.id).populate('products.product').lean().exec();

//     res.status(201).json({response : newCart , message:"items successfully addded in cart"});
//   } catch (error) {
//     res.status(400).json({message:error.message});
//   }
// };

// issue : s
// const handleUserCart = async (req, res) => {
//   const { productId, count, color } = req.body;
//   const userId = req.user._id;
//   // console.log({ productId, count, color , userId})

//   try {
//     // Find the existing cart for the user
//     const existingCart = await CART.findOne({ orderby: userId });

//     // Get the price of the product
//     const product = await PRODUCT.findById(productId).select('price').exec();
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     if (existingCart) {
//       // Check if the product is already in the cart
//       const existingProductIndex = existingCart.products.findIndex(
//         item => item.product.toString() === productId.toString()
//       );

//       let newCartTotal = existingCart.cartTotal;

//       if (existingProductIndex !== -1) {
//         // Product is already in the cart, update the count
//         const existingProduct = existingCart.products[existingProductIndex];
//         newCartTotal -= existingProduct.price * existingProduct.count; // Remove the old total for this product
//         existingProduct.count += count;
//         existingProduct.price = product.price; // Update price if necessary
//         newCartTotal += existingProduct.price * existingProduct.count; // Add the new total for this product

//         // Save the updated cart
//         existingCart.cartTotal = newCartTotal;
//         await existingCart.save();
//       } else {
//         // Product is not in the cart, add it
//         existingCart.products.push({
//           product: productId,
//           count: count,
//           color: color,
//           price: product.price,
//         });

//         // Update the cart total
//         newCartTotal += product.price * count;
//         existingCart.cartTotal = newCartTotal;

//         // Save the updated cart
//         await existingCart.save();
//       }

//       return res.status(200).json(existingCart);
//     } else {
//       // No existing cart, create a new one
//       const newCart = new CART({
//         products: [
//           {
//             product: productId,
//             count: count,
//             color: color,
//             price: product.price,
//           }
//         ],
//         cartTotal: product.price * count, // Initial cart total
//         orderby: userId,
//       });

//       // Save the new cart
//       const savedCart = await newCart.save();
//       return res.status(201).json(savedCart);
//     }
//   } catch (error) {
//     console.error('Error handling user cart:', error);
//     res.status(400).json({ message: error.message });
//   }
// };

// const handleUserCart = async (req, res) => {
//   const { productId, count, color } = req.body;
//   const userId = req.user._id;

//   try {
//     // Find the existing cart for the user
//     const existingCart = await CART.findOne({ orderby: userId });

//     // Get the price of the product
//     const product = await PRODUCT.findById(productId).select('price').exec();
//     if (!product) {
//       return res.status(404).json({ message: 'Product not found' });
//     }

//     if (existingCart) {
//       // Check if the product with the specific color is already in the cart
//       const existingProductIndex = existingCart.products.findIndex(
//         item => item.product.toString() === productId.toString() && item.color === color
//       );

//       let newCartTotal = existingCart.cartTotal;

//       if (existingProductIndex !== -1) {
//         // Product with the same color is already in the cart, update the count
//         const existingProduct = existingCart.products[existingProductIndex];
//         newCartTotal -= existingProduct.price * existingProduct.count; // Remove the old total for this product
//         existingProduct.count += count;
//         newCartTotal += existingProduct.price * existingProduct.count; // Add the new total for this product

//         // Save the updated cart
//         existingCart.cartTotal = newCartTotal;
//         await existingCart.save();
//       } else {
//         // Product with the specific color is not in the cart, add it
//         existingCart.products.push({
//           product: productId,
//           count: count,
//           color: color,
//           price: product.price,
//         });

//         // Update the cart total
//         newCartTotal += product.price * count;
//         existingCart.cartTotal = newCartTotal;

//         // Save the updated cart
//         await existingCart.save();
//       }

//       return res.status(200).json(existingCart);
//     } else {
//       // No existing cart, create a new one
//       const newCart = new CART({
//         products: [
//           {
//             product: productId,
//             count: count,
//             color: color,
//             price: product.price,
//           }
//         ],
//         cartTotal: product.price * count, // Initial cart total
//         orderby: userId,
//       });

//       // Save the new cart
//       const savedCart = await newCart.save();
//       return res.status(201).json(savedCart);
//     }
//   } catch (error) {
//     console.error('Error handling user cart:', error);
//     res.status(400).json({ message: error.message });
//   }
// };

const handleUserCart = async (req, res) => {
  const { productId, count, color } = req.body;
  const userId = req.user._id;

  try {
    // Find the existing cart for the user
    const existingCart = await CART.findOne({ orderby: userId });

    // Get the price of the product
    const product = await PRODUCT.findById(productId).select('price').exec();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (existingCart) {
      // Check if the product with the specific color is already in the cart
      const existingProductIndex = existingCart.products.findIndex(
        item => item.product.toString() === productId.toString() && item.color === color
      );

      let newCartTotal = existingCart.cartTotal;

      if (existingProductIndex !== -1) {
        const existingProduct = existingCart.products[existingProductIndex];
        
        if (count === 0) {
          // If count is 0, remove the product from the cart
          newCartTotal -= existingProduct.price * existingProduct.count;
          existingCart.products.splice(existingProductIndex, 1);
        } else {
          // Update the count and price
          newCartTotal -= existingProduct.price * existingProduct.count; // Remove the old total for this product
          existingProduct.count = count;
          newCartTotal += existingProduct.price * existingProduct.count; // Add the new total for this product
        }

        // Save the updated cart
        existingCart.cartTotal = newCartTotal;
        await existingCart.save();
      } else if (count > 0) {
        // Product with the specific color is not in the cart, add it
        existingCart.products.push({
          product: productId,
          count: count,
          color: color,
          price: product.price,
        });

        // Update the cart total
        newCartTotal += product.price * count;
        existingCart.cartTotal = newCartTotal;

        // Save the updated cart
        await existingCart.save();
      } else {
        // Product is not in the cart and count is 0, do nothing
        return res.status(404).json({ message: 'Product not found in cart' });
      }

      return res.status(200).json(existingCart);
    } else {
      if (count > 0) {
        // No existing cart, create a new one
        const newCart = new CART({
          products: [
            {
              product: productId,
              count: count,
              color: color,
              price: product.price,
            }
          ],
          cartTotal: product.price * count, // Initial cart total
          orderby: userId,
        });

        // Save the new cart
        const savedCart = await newCart.save();
        return res.status(201).json(savedCart);
      } else {
        // No existing cart and count is 0, do nothing
        return res.status(404).json({ message: 'Product count is 0, nothing to add' });
      }
    }
  } catch (error) {
    console.error('Error handling user cart:', error);
    res.status(400).json({ message: error.message });
  }
};






const hanldeGetUserCart = async (req, res) => {
  const { id } = req.user;
  try {
    const cart = await CART.findOne({ orderby: id }).populate(
      ["products.product" , "orderby"]
    );
    res.status(200).json({ response: cart , message : "cart fetched successfully"});
  } catch (error) {
    res.status(400).json(error.message);
  }
};

{/* delete user cart single item */}
const handleDeleteUserCartItem = async (req, res) => {
  const { prodId } = req.params; // This should be the _id of the product within the products array
  const id = req.user._id; // This is the user's _id

  try {
    // Pull the product from the products array using its _id
    const response = await CART.updateOne(
      { orderby: id },
      { $pull: { products: { _id: prodId } } }
    );

    if (response.modifiedCount > 0) { // Check if any document was modified
      // Fetch the updated cart
      const updatedCart = await CART.findOne({ orderby: id });

      // Recalculate cartTotal
      const newCartTotal = updatedCart.products.reduce((total, item) => total + (item.price * item.count), 0);

      // Update cartTotal in the cart document
      await CART.updateOne(
        { _id: updatedCart._id },
        { $set: { cartTotal: newCartTotal } }
      );

      // Fetch the final updated cart
      const finalCart = await CART.findOne({ orderby: id });

      return res.status(200).json({ message: "Product removed and total updated", response: finalCart });
    } else {
      return res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



const handleEmptyUserCart = async (req, res) => {
  const { id } = req.user;
  try {
    // const user = await USER.findOne({ _id });
    const response = await CART.findOneAndDelete({ orderby: id } , {new:true});
    if(response){
      console.log(response)
      res.status(200).json({message : "cart deleted successfully"});

    }
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

// const handleGetAllOrders = async (req, res) => {
//   try {
//     const alluserorders = await ORDER.find()
//       .populate("products.product")
//       .populate("orderby")
//       .exec();
//     return res.json({status:"success" ,message:"orders fetched successfully" ,response:alluserorders});
//   } catch (error) {
//     return res.status(500).json({message:error.message})
//   }
// }

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

// const handleUpdateOrderStatus = async (req, res) => {
//   const { status } = req.body;
//   const { id } = req.params;

//   try {
//     // Find the order to get the current paymentIntent
//     const order = await ORDER.findById(id);

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     // Update only the status field of the paymentIntent
//     const updatedPaymentIntent = { ...order.paymentIntent, status: status };

//     // Update the order with the new status and the updated paymentIntent
//     const updateOrderStatus = await ORDER.findByIdAndUpdate(
//       {_id:id},
//       {
//         orderStatus: status,
//         paymentIntent: updatedPaymentIntent,
//       },
//       { new: true }
//     );

//     if (updateOrderStatus) {
//       const updatedOrder = await ORDER.find() .populate("products.product")
//       .populate("orderby")
//       .exec();;
//       return res.status(200).json({ response: updatedOrder, message: "Order updated successfully" });
//     } else {
//       return res.status(400).json({ message: "Order update failed" });
//     }
//   } catch (error) {
//     return res.status(500).json({ message: error.message });
//   }
// }

{/* changing */}
const handleCreateOrder = async(req,res)=>{
  try {
    const {shippingInfo,paymentInfo,orderItems,totalPrice,totalPriceAfterDiscount,} = req.body;
    const {_id} = req.user

    const address = await ADDRESS.findOne({
      user: _id,
      "details._id": shippingInfo
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
      shippingInfo:specificDetail,paymentInfo,orderItems,totalPrice,totalPriceAfterDiscount, user:_id
    })

     // Populate the necessary fields
    const response = await order.populate([
      { path: 'user', model: 'User' },
      { path: 'orderItems.product', model: 'Product' },
      { path: 'orderItems.color', model: 'color' },
    ]);
    
    return res.json({message:"order placed successfully" , response:response})
  } catch (error) {
    return res.status(500).json({ message: error.message });
    
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
  // handleGetOrder,
  // handleGetAllOrders,
  // handleGetOrderByUserId,
  // handleUpdateOrderStatus,
  handleDeleteUserCartItem
};
