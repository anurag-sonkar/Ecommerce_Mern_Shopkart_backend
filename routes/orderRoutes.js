const express = require("express");
const router = express.Router();
const {
  // handleCreateOrder,
  handleGetUserOrder,
  getMonthWiseOrderIncome,
  getMonthWiseOrderCount,
  getMonthWiseOrderStats,
  getYearWiseOrderStats,
  handleGetOrder,
  handleGetAllOrders,
  handleGetOrderByUserId,
  handleUpdateOrderStatus,
} = require("../controllers/orderCtrl");
const authenticate = require("../middleware/authentication");
const checkAdmin = require("../middleware/checkAdmin");

// router.post('/' , handleCreateOrder)
router.get("/get-all",checkAdmin, handleGetAllOrders);
router.put("/update-status/:id",checkAdmin, handleUpdateOrderStatus);
router.get("/getMonthWiseOrderIncome", checkAdmin,getMonthWiseOrderIncome);
router.get("/getMonthWiseOrderCount", checkAdmin, getMonthWiseOrderCount);
router.get("/getMonthWiseOrderStats", checkAdmin, getMonthWiseOrderStats); {/* in single get both income + count */}
router.get("/getYearlyTotalOrders", checkAdmin, getYearWiseOrderStats);

router.get("/",authenticate , handleGetUserOrder);

// router.get('/order' , handleGetOrder)
// router.get('/order/:id' , handleGetOrderByUserId)


module.exports = router;
