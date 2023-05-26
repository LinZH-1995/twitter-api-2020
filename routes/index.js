const express = require('express')
const router = express.Router()

const admin = require('./modules/admin.js')
const users = require('./modules/users.js')

const userController = require('../controllers/user-controller.js')

const { errorHandler } = require('../middleware/error-handler.js')

const { localStrategyAuth, localStrategyAdminAuth, jwtStrategyAuth } = require('../middleware/auth.js')

router.post('/admin/signin', localStrategyAdminAuth, userController.signIn)

router.post('/signup', userController.signUp)

router.post('/signin', localStrategyAuth, userController.signIn)

router.use('/admin', jwtStrategyAuth, admin)

router.use('/users', jwtStrategyAuth, users)

router.use(errorHandler)

module.exports = router