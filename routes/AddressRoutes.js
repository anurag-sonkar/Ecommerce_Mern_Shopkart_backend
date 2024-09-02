const express = require('express')
const { handleCreateAddress,handleGetUserAddress ,handleDeleteAddress} = require('../controllers/addressCtrl')
const router  = express.Router()


router.get('/' , handleGetUserAddress)
router.post('/' , handleCreateAddress)
router.delete('/:addressId' , handleDeleteAddress)


module.exports  = router