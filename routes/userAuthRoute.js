const express = require('express')
const router = express.Router()
const {handleRegisterNewUser,handleLoginUser ,handleForgotPassword,handleResetPassword,handleLoginAdmin,} = require('../controllers/userAuthCtrl')
// const profileUpload = require('../middleware/profileUpload')
const {uploadProfile} = require("../middleware/profileUpload")

// router.post('/register',profileUpload,handleRegisterNewUser)
router.post('/register',uploadProfile.single("photo") ,handleRegisterNewUser)
router.post('/login' , handleLoginUser)
router.post("/forgot-password", handleForgotPassword);
router.put("/reset-password/:token", handleResetPassword);
router.post('/admin-login', handleLoginAdmin)





module.exports = router