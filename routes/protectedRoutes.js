const express = require("express");
const {
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

} = require("../controllers/staticCtrl");
const checkAdmin = require("../middleware/checkAdmin");
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
router.delete('/cart',handleEmptyUserCart)
// apply coupon
router.post('/cart/coupon' , handleApplyCoupon)

// order
router.get('/order/get-all' , handleGetAllOrders)
router.post('/order/cod' , handleCreateOrder)
router.get('/order' , handleGetOrder)
router.get('/order/:id' , handleGetOrderByUserId)
router.put('/order/update-status/:id' ,checkAdmin, handleUpdateOrderStatus)



//  if admin
router.get("/allusers", checkAdmin, handleGetAllUsersInfo);
router.delete("/deleteuser/:id", checkAdmin, handleDeleteUser);
router.put("/blockuser/:id", checkAdmin, handleBlockUser);
router.put("/unblockuser/:id", checkAdmin, handleUnblockUser);

module.exports = router;
