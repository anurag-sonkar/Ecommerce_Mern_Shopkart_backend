const express = require("express");
const {
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
  // handleCreateOrder,
  // handleGetUserOrder,
  // getMonthWiseOrderIncome,
  // getMonthWiseOrderCount,
  // getMonthWiseOrderStats,
  // getYearWiseOrderStats,
  // handleGetOrder,
  // handleGetAllOrders,
  // handleGetOrderByUserId,
  // handleUpdateOrderStatus,
  handleDeleteUserCartItem

} = require("../controllers/staticCtrl");
const checkAdmin = require("../middleware/checkAdmin");
// const { checkout,paymentVerification } = require("../controllers/paymentCtrl");
const router = express.Router();

router.put('/add-address' , handleAddAddress)
router.get('/wishlist', handleGetUserWishlist)
router.get("/home", handleGetUser);
router.get("/getuser", handleGetUserInfo);
router.put('/logout' ,handleLogout )
router.put("/updateuser", handleUpdateUser);
router.put('/changepassword' , handleChangePassword)
// cart
router.post('/cart',handleUserCart)
router.get('/cart',hanldeGetUserCart)
router.delete('/cart/:prodId' , handleDeleteUserCartItem)
router.delete('/cart',handleEmptyUserCart)
// apply coupon
router.post('/cart/coupon' , handleApplyCoupon)

// payment-razorpay
// router.post('/checkout' , checkout)
// router.post('/paymentVerification' , paymentVerification)

// order
/*
router.post('/order' , handleCreateOrder)
router.get('/order' , handleGetUserOrder)
router.get('/getMonthWiseOrderIncome' , checkAdmin, getMonthWiseOrderIncome)
router.get('/getMonthWiseOrderCount' , checkAdmin, getMonthWiseOrderCount)
router.get('/getMonthWiseOrderStats' , checkAdmin, getMonthWiseOrderStats)
router.get('/getYearlyTotalOrders' , checkAdmin, getYearWiseOrderStats)
router.get('/order/get-all' , handleGetAllOrders)
router.put('/order/update-status/:id' ,checkAdmin, handleUpdateOrderStatus)
*/

// router.get('/order' , handleGetOrder)
// router.get('/order/:id' , handleGetOrderByUserId)



//  if admin
router.get("/allusers", checkAdmin, handleGetAllUsersInfo);
router.delete("/deleteuser/:id", checkAdmin, handleDeleteUser);
// router.put("/blockuser/:id", checkAdmin, handleBlockUser);
// router.put("/unblockuser/:id", checkAdmin, handleUnblockUser);
router.put("/user-status/:id", checkAdmin, handleUpdateUserStatus);

module.exports = router;
