const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller.js')

router.delete('/:id', userController.deleteFollowing)

router.post('/:id', userController.postFollowing)

module.exports = router