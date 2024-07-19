const express = require("express");
const {
  handleCreateBrand,
  handleUpdateBrand,
  handleDeleteBrand,
  handleGetBrand,
  handleGetAllBrand,
} = require("../controllers/brandCtrl");
const authenticate = require("../middleware/authentication");
const checkAdmin = require("../middleware/checkAdmin");
const router = express.Router();

router.post("/", authenticate, checkAdmin, handleCreateBrand);
router.put("/:id", authenticate, checkAdmin, handleUpdateBrand);
router.delete("/:id", authenticate, checkAdmin, handleDeleteBrand);
router.get("/:id", handleGetBrand);
router.get("/", handleGetAllBrand);

module.exports = router;
