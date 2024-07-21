const express = require("express");
const {
  handleCreateColor,
  handleUpdateColor,
  handleDeleteColor,
  handleGetColor,
  handleGetAllColor,
} = require("../controllers/colorCtrl");
const authenticate = require("../middleware/authentication");
const checkAdmin = require("../middleware/checkAdmin");
const router = express.Router();

router.post("/", authenticate, checkAdmin, handleCreateColor);
router.put("/:id", authenticate, checkAdmin, handleUpdateColor);
router.delete("/:id", authenticate, checkAdmin, handleDeleteColor);
router.get("/:id", handleGetColor);
router.get("/", handleGetAllColor);

module.exports = router;
