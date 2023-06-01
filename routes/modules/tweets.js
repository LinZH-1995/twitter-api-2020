const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller.js')

/**
 * @swagger
 * /api/tweets/{id}/replies:
 *   get:
 *     tags:
 *       - Tweets
 *     summary: Get Tweet's replies
 *     description: Return replies of Tweet include User of reply - ORDER BY "createdAt" column with "DESC"
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
router.get('/:id/replies', tweetController.getTweetReplies)

/**
 * @swagger
 * /api/tweets/{id}/replies:
 *   post:
 *     tags:
 *       - Tweets
 *     summary: post a reply to a Tweet
 *     description: Return a createdReply data
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
 *       description: Comment
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 default: "Hello World"
 *             required:
 *               - comment
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.post('/:id/replies', tweetController.postReply)

/**
 * @swagger
 * /api/tweets/{id}/like:
 *   post:
 *     tags:
 *       - Tweets
 *     summary: add like to a Tweet
 *     description: Return a liked Tweet's data
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
router.post('/:id/like', tweetController.addLike)


/**
 * @swagger
 * /api/tweets/{id}/unlike:
 *   delete:
 *     tags:
 *       - Tweets
 *     summary: Remove like from a Tweet
 *     description: Return a unliked Tweet's data
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
router.delete('/:id/unlike', tweetController.deleteLike)

/**
 * @swagger
 * /api/tweets/{id}:
 *   get:
 *     tags:
 *       - Tweets
 *     summary: Get a Tweet's data
 *     description: Return a Tweet's data include LikedUsersCounts、RepliesCounts and isLiked(me)
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
router.get('/:id', tweetController.getTweet)

/**
 * @swagger
 * /api/tweets:
 *   post:
 *     tags:
 *       - Tweets
 *     summary: post a Tweet
 *     description: Return a createdTweet
 *     consumes:
 *       - application/json
 *     produces:
 *       - application/json
*     requestBody:
 *       description: Description
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 default: "Hello World"
 *             required:
 *               - description
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.post('/', tweetController.postTweet)

/**
 * @swagger
 * /api/tweets:
 *   get:
 *     tags:
 *       - Tweets
 *     summary: Get all Tweets 
 *     description: Return all Tweets and tweetsCount include repliesCounts、LikedUsersCounts and isLiked(me) - ORDER BY "createdAt" column with "DESC"
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
router.get('/', tweetController.getTweets)

module.exports = router