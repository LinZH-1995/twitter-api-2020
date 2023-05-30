const express = require('express')
const router = express.Router()

const admin = require('./modules/admin.js')
const users = require('./modules/users.js')
const tweets = require('./modules/tweets.js')
const followships = require('./modules/followships.js')

const userController = require('../controllers/user-controller.js')

const { errorHandler } = require('../middleware/error-handler.js')

const { localStrategyAuth, localStrategyAdminAuth, jwtStrategyAuth, jwtStrategyAdminAuth } = require('../middleware/auth.js')

/**
 * @swagger
 * /api/admin/signin:
 *   post:
 *     tags:
 *       - Admin
 *     summary: Admin SignIn
 *     description: Return a JWT token for admin
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: Email and Password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: 'root@example.com'
 *               password:
 *                 type: string
 *                 default: '123456789'
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.post('/admin/signin', localStrategyAdminAuth, userController.signIn)

/**
 * @swagger
 * /api/signup:
 *   post:
 *     tags:
 *       - SignIn/SignUp
 *     summary: SignUp
 *     description: Return a createdUser data
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: Name、Account、Eamil and Password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 default: 'user10'
 *               account:
 *                 type: string
 *                 default: '@user10'
 *               email:
 *                 type: string
 *                 default: 'user10@example.com'
 *               password:
 *                 type: string
 *                 default: '123456789'
 *               checkPassword:
 *                 type: string
 *                 default: '123456789'
 *             required:
 *               - name
 *               - account
 *               - email
 *               - password
 *               - checkPassword
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Internal Server Error
 */
router.post('/signup', userController.signUp)

/**
 * @swagger
 * /api/signin:
 *   post:
 *     tags:
 *       - SignIn/SignUp
 *     summary: SignIn
 *     description: Return a JWT token for user
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     requestBody:
 *       description: Email and Password
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 default: user1@example.com
 *               password:
 *                 type: string
 *                 default: 123456789
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.post('/signin', localStrategyAuth, userController.signIn)

router.use('/admin', jwtStrategyAuth, jwtStrategyAdminAuth, admin)

router.use('/users', jwtStrategyAuth, users)

router.use('/tweets', jwtStrategyAuth, tweets)

router.use('/followships', jwtStrategyAuth, followships)

router.use(errorHandler)

module.exports = router