const express = require('express')
const router = express.Router()

const tweetController = require('../../controllers/tweet-controller.js')

router.get('/:id/replies', tweetController.getTweetReplies)

router.post('/:id/replies', tweetController.postReply)

router.post('/:id/like', tweetController.addLike)

router.delete('/:id/unlike', tweetController.deleteLike)

router.get('/:id', tweetController.getTweet)

router.post('/', tweetController.postTweet)

router.get('/', tweetController.getTweets)

module.exports = router