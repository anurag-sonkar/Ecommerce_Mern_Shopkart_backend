const express = require('express')
const router = express.Router()
const {handleRegisterNewUser} = require('../controllers/userAuthCtrl')
const profileUpload = require('../middleware/profileUpload')


router.post('/register',profileUpload,handleRegisterNewUser)

module.exports = router