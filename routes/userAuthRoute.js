const express = require('express')
const router = express.Router()
const {handleRegisterNewUser,handleLoginUser ,handleForgotPassword,handleResetPassword} = require('../controllers/userAuthCtrl')
const profileUpload = require('../middleware/profileUpload')


router.post('/register',profileUpload,handleRegisterNewUser)
router.post('/login' , handleLoginUser)
router.post("/forgot-password", handleForgotPassword);
router.put("/reset-password/:token", handleResetPassword);


module.exports = router