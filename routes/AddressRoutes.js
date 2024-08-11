const express = require('express')
const { handleCreateAddress,handleGetUserAddress ,handleDeleteAddress} = require('../controllers/addressCtrl')
const router  = express.Router()


router.post('/' , handleCreateAddress)
router.get('/' , handleGetUserAddress)
router.delete('/:addressId' , handleDeleteAddress)


module.exports  = router