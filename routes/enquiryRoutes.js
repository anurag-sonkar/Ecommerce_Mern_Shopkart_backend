const express = require("express");
const {
  handleCreateEnquiry,
  handleUpdateEnquiry,
  handleDeleteEnquiry,
  handleGetEnquiry,
  handleGetAllEnquiry,
} = require("../controllers/enquiryCtrl");
const authenticate = require("../middleware/authentication");
const checkAdmin = require("../middleware/checkAdmin");
const router = express.Router();

router.post("/", handleCreateEnquiry);
router.put("/:id", authenticate, checkAdmin, handleUpdateEnquiry);
router.delete("/:id", authenticate, checkAdmin, handleDeleteEnquiry);
router.get("/:id", handleGetEnquiry);
router.get("/",authenticate, checkAdmin, handleGetAllEnquiry);

module.exports = router;
