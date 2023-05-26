const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller.js')

router.get('/tweets', adminController.getTweets)

module.exports = router