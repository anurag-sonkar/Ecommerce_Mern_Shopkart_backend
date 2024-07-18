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
  handleChangePassword

} = require("../controllers/staticCtrl");
const checkAdmin = require("../middleware/checkAdmin");
const router = express.Router();

router.get("/home", handleGetUser);
router.get("/getuser", handleGetUserInfo);
router.put("/updateuser", handleUpdateUser);
router.get('/logout' ,handleLogout )
router.put('/changepassword' , handleChangePassword)

// get all users if admin
router.get("/allusers", checkAdmin, handleGetAllUsersInfo);
router.delete("/deleteuser/:id", checkAdmin, handleDeleteUser);
router.put("/blockuser/:id", checkAdmin, handleBlockUser);
router.put("/unblockuser/:id", checkAdmin, handleUnblockUser);

module.exports = router;
