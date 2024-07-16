const express = require('express')
const router = express.Router()
const {handleRegisterNewUser,handleLoginUser} = require('../controllers/userAuthCtrl')
const profileUpload = require('../middleware/profileUpload')


router.post('/register',profileUpload,handleRegisterNewUser)
router.post('/login' , handleLoginUser)


module.exports = router