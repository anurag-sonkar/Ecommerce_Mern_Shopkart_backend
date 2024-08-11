const express = require('express')
const { handleCreateAddress } = require('../controllers/addressCtrl')
const router  = express.Router()


router.post('/' , handleCreateAddress)


module.exports  = router