const express = require("express");
const { handleCreateBlogCategory ,handleUpdateBlogCategory,handleDeleteBlogCategory,handleGetBlogCategory
    , handleGetAllBlogCategory} = require("../controllers/blogCategoryCtrl");
const authenticate = require("../middleware/authentication");
const checkAdmin = require("../middleware/checkAdmin");
const router = express.Router();


router.post('/' ,authenticate , checkAdmin, handleCreateBlogCategory)
router.put('/:id' ,authenticate , checkAdmin, handleUpdateBlogCategory)
router.delete('/:id' ,authenticate , checkAdmin, handleDeleteBlogCategory)
router.get('/:id' , handleGetBlogCategory)
router.get('/' , handleGetAllBlogCategory)

module.exports = router;
