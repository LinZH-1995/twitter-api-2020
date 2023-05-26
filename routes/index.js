const express = require('express')
const router = express.Router()

const userController = require('../controllers/user-controller.js')

const { errorHandler } = require('../middleware/error-handler.js')

const { localStrategyAuth } = require('../middleware/auth.js')

router.post('/signup', userController.signUp)

router.post('/signin', localStrategyAuth, userController.signIn)

router.get('/', (req, res) => res.redirect('/api/signin'))

router.use(errorHandler)

module.exports = router