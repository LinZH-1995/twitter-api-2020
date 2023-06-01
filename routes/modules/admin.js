const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller.js')

/**
 * @swagger
 * /api/admin/tweets/{id}:
 *   delete:
 *     tags:
 *       - Admin
 *     summary: Delete Tweet and it's own Replies/Likes
 *     description: Return DeletedTweet、DeletedReplies and DeletedLikes
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
 */
router.delete('/tweets/:id', adminController.deleteTweet)

/**
 * @swagger
 * /api/admin/tweets:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all Tweets
 *     description: Return Tweets and TweetsCounts - ORDER BY "createdAt" column with "DESC"
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
 */
router.get('/tweets', adminController.getTweets)

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get all Users
 *     description: Return Users include TweetCounts、LikedUsersCounts、FollowingsCounts and FollowersCounts - ORDER BY "TweetCounts" column with "DESC"
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
 */
router.get('/users', adminController.getUsers)

module.exports = router