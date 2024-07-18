const express = require("express");
const { handleCreateProductCategory ,handleUpdateProductCategory,handleDeleteProductCategory , handleGetProductCategory
    , handleGetAllProductCategory} = require("../controllers/productCategoryCtrl");
const authenticate = require("../middleware/authentication");
const checkAdmin = require("../middleware/checkAdmin");
const router = express.Router();


router.post('/' ,authenticate , checkAdmin, handleCreateProductCategory)
router.put('/:id' ,authenticate , checkAdmin, handleUpdateProductCategory)
router.delete('/:id' ,authenticate , checkAdmin, handleDeleteProductCategory)
router.get('/:id' , handleGetProductCategory)
router.get('/' , handleGetAllProductCategory)

module.exports = router;
