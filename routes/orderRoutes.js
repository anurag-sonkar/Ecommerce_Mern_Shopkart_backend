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

// router.post('/' , handleCreateOrder)
router.get("/get-all", handleGetAllOrders);
router.put("/update-status/:id", handleUpdateOrderStatus);
router.get("/getMonthWiseOrderIncome", getMonthWiseOrderIncome);
router.get("/getMonthWiseOrderCount", getMonthWiseOrderCount);
router.get("/getMonthWiseOrderStats", getMonthWiseOrderStats); {/* in single get both income + count */}
router.get("/getYearlyTotalOrders", getYearWiseOrderStats);

router.get("/",authenticate , handleGetUserOrder);

// router.get('/order' , handleGetOrder)
// router.get('/order/:id' , handleGetOrderByUserId)


module.exports = router;
