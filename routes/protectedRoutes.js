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
  handleApplyCoupon

} = require("../controllers/staticCtrl");
const checkAdmin = require("../middleware/checkAdmin");
const router = express.Router();

router.put('/add-address' , handleAddAddress)
router.get('/wishlist', handleGetUserWishlist)
router.get("/home", handleGetUser);
router.get("/getuser", handleGetUserInfo);
router.put("/updateuser", handleUpdateUser);
router.get('/logout' ,handleLogout )
router.put('/changepassword' , handleChangePassword)
// cart
router.post('/cart',handleUserCart)
router.get('/cart',hanldeGetUserCart)
router.delete('/cart',handleEmptyUserCart)
// apply coupon
router.post('/cart/coupon' , handleApplyCoupon)


//  if admin
router.get("/allusers", checkAdmin, handleGetAllUsersInfo);
router.delete("/deleteuser/:id", checkAdmin, handleDeleteUser);
router.put("/blockuser/:id", checkAdmin, handleBlockUser);
router.put("/unblockuser/:id", checkAdmin, handleUnblockUser);

module.exports = router;
