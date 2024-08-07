const express = require("express");
const router = express.Router();

const {createProduct,getProduct,updateProduct,deleteProduct,getAllProducts,addToWishlist,rating, uploadImages,deleteImages} = require('../controllers/productCtrl');

const checkAdmin = require("../middleware/checkAdmin");
const authenticate = require("../middleware/authentication");
const { uploadPhoto, productImgResize } = require("../middleware/uploadImages");

router.put('/upload',authenticate,checkAdmin,uploadPhoto.array('images',10),productImgResize,uploadImages)
router.delete('/delete-image/:id' ,authenticate,checkAdmin, deleteImages)


router.put('/rating' ,authenticate, rating)
router.put('/addtowishlist' ,authenticate, addToWishlist)
router.post('/' ,authenticate ,checkAdmin, createProduct)
router.get('/:id' , getProduct)
router.get('/' , getAllProducts)
router.put('/:id' ,authenticate,checkAdmin, updateProduct)
router.delete('/:id' ,authenticate,checkAdmin, deleteProduct)


module.exports = router