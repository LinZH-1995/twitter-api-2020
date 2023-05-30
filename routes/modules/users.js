const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller.js')

const upload = require('../../helpers/multer-helper.js')

/**
 * @swagger
 * /api/users/getTop10User:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get Top 10 User with most FollowersCounts
 *     description: Return 10 Users Data include TweetsCounts、FollowingsCounts、FollowersCounts and isFollowing(me) - ORDER BY "followersCounts" column with "DESC"
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/getTop10User', userController.getTop10User)

/**
 * @swagger
 * /api/users/{id}/tweets:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get User's Tweets
 *     description: Return User and User's Tweets include RepliesCounts、LikedUsersCounts and isLiked(me) - ORDER BY "createdAt" column with "DESC"
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id/tweets', userController.getUserTweets)

/**
 * @swagger
 * /api/users/{id}/replied_tweets:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get Tweets of User replied
 *     description: Return User and Tweets of User replied include RepliesCounts、LikedUsersCounts and isLiked(me) - ORDER BY "createdAt" column with "DESC"
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id/replied_tweets', userController.getUserRepliedTweets)

/**
 * @swagger
 * /api/users/{id}/likes:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get Tweets of User liked
 *     description: Return User and Tweets of User liked include isLiked(me) - ORDER BY "createdAt" column with "DESC" of table "Like"
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id/likes', userController.getUserLikes)

/**
 * @swagger
 * /api/users/{id}/followings:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get Users of User followings
 *     description: Return User and Users of User followings include isFollowing(me) - ORDER BY "createdAt" column with "DESC" of table "Followship"
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id/followings', userController.getUserFollowings)

/**
 * @swagger
 * /api/users/{id}/followers:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get Users of User followers
 *     description: Return User and Users of User followers include isFollowing(me) - ORDER BY "createdAt" column with "DESC" of table "Followship"
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id/followers', userController.getUserFollowers)

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Get editedUser
 *     description: Return User with edited data
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     requestBody:
 *       description: Name or Account or Email or Password (newPassword / checkNewPassword)
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               account:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               newPassword:
 *                 type: string
 *               checkNewPassword:
 *                 type: string
 *               avatar:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               coverImage:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.put('/:id', upload.fields([{ name: 'avatar' }, { name: 'coverImage' }]), userController.editUser)

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get User
 *     description: Return User include TweetsCounts、FollowingsCounts、FollowersCounts and isFollowing(me)
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: integer
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal Server Error
 */
router.get('/:id', userController.getUser)

module.exports = router