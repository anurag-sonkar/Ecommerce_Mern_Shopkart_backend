const express = require('express')
const router = express.Router()
const {handleCouponGenerate,handleGetAllCoupons,
    handleUpdateCoupon,
    handleDeleteCoupon,
    handleGetCoupon} = require('../controllers/couponCtrl')
const authenticate = require('../middleware/authentication')
const checkAdmin = require('../middleware/checkAdmin')

router.post('/' ,authenticate , checkAdmin, handleCouponGenerate)
router.delete('/:id' ,authenticate , checkAdmin, handleDeleteCoupon)
router.get('/:id' ,authenticate , checkAdmin, handleGetCoupon)
router.put('/:id' ,authenticate , checkAdmin, handleUpdateCoupon)
router.get('/' ,authenticate , checkAdmin, handleGetAllCoupons)

module.exports = router