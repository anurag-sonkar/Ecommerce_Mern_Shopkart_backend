const express = require("express");
const router = express.Router();
const {
  handleCreateNewBlog,
  handleUpdateBlog,
  handleGetBlog,
  handleGetAllBlog,
  handleDeleteBlog,
  handleLikeBlog,
  handleDislikeBlog,
  uploadImages
} = require("../controllers/blobCtrl");
const checkAdmin = require("../middleware/checkAdmin");
const authenticate = require("../middleware/authentication");
const { uploadPhoto, blogImgResize } = require("../middleware/uploadImages");

router.put("/like", authenticate, handleLikeBlog);
router.put('/dislike',authenticate, handleDislikeBlog)
router.post("/", authenticate, checkAdmin, handleCreateNewBlog); // file upload pending
router.put("/:id", authenticate, checkAdmin, handleUpdateBlog);
router.get("/:id", handleGetBlog);
router.get("/", handleGetAllBlog);
router.delete("/:id", authenticate, checkAdmin, handleDeleteBlog);

router.put('/upload/:id',authenticate,checkAdmin,uploadPhoto.array('images',10),blogImgResize,uploadImages)

module.exports = router;
