const CART = require("../models/cart");
const COUPON = require("../models/coupon");
const ORDER = require("../models/order");
const PRODUCT = require("../models/product");
const USER = require("../models/user");
const bcrypt = require("bcryptjs");
const ADDRESS = require('../models/address')
const mongoose = require('mongoose')
var uniqid = require('uniqid'); 
const { response } = require("express");

const handleGetAllUsersInfo = async (req, res) => {
  try {
    const users = await USER.find({role:'user'}); // only user
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


// in one api handleBlock and unBlock user
const  handleUpdateUserStatus = async (req,res)=>{
  const {id} = req.params // user id passes as params - which user to block and unblock
  const {status} = req.body

  // if(typeof status !== "boolean"){
  //   return res.status(400).json({message:'user status cannot be otherthan true/false must be boolean'})
  // }
  try {
    const user = await USER.findByIdAndUpdate({_id:id},{isBlocked:status},{new:true} )

    if(user){
      const users = await USER.find({role:'user'});
      return res.status(201).json({ status: 201,message: "status updated successfully" ,users : users});
      
    }else{
      return res.status(400).json({ message: "status updation failed " });
    }
  } catch (error) {
    return res.status(400).json({ message: error.message });

    
  }

}

// const handleBlockUser = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const response = await USER.findByIdAndUpdate(
//       { _id: id },
//       { isBlocked: true },
//       { new: true } // returns the updated document
//     );

//     if (!response) {
//       return res.status(404).json({ status: 404, message: "User not found" });
//     }

//     res.status(200).json({ status: 200, message: "User blocked successfully" });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };


// const handleUnblockUser = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const response = await USER.findByIdAndUpdate(
//       { _id: id },
//       { isBlocked: false },
//       { new: true } // returns the updated document
//     );

//     if (!response) {
//       return res.status(404).json({ status: 404, message: "User not found" });
//     }

//     res
//       .status(200)
//       .json({ status: 200, message: "User UnBlocked successfully" });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

const handleLogout = async (req, res) => {
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
    const isMatch = await bcrypt.compare(currentPassword, user.password);
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











module.exports = {
  handleGetUser,
  handleGetAllUsersInfo,
  handleGetUserInfo,
  handleDeleteUser,
  handleUpdateUser,
  // handleBlockUser,
  // handleUnblockUser,
  handleUpdateUserStatus,
  handleLogout,
  handleChangePassword,
  handleGetUserWishlist,
  handleAddAddress,
  handleUserCart,
  hanldeGetUserCart,
  handleEmptyUserCart,
  handleApplyCoupon,
  
  handleDeleteUserCartItem
};
