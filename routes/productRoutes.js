const express = require("express");
const {createProduct,getProduct,updateProduct,deleteProduct,getAllProducts,addToWishlist,rating} = require('../controllers/productCtrl');
const checkAdmin = require("../middleware/checkAdmin");
const router = express.Router();

router.put('/rating' , rating)
router.put('/addtowishlist' , addToWishlist)
router.post('/' ,checkAdmin, createProduct)
router.get('/:id' , getProduct)
router.get('/' , getAllProducts)
router.put('/:id' ,checkAdmin, updateProduct)
router.delete('/:id' ,checkAdmin, deleteProduct)

module.exports = router