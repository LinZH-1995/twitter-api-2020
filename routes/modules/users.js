const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller.js')

const upload = require('../../helpers/multer-helper.js')

router.get('/:id/tweets', userController.getUserTweets)

router.get('/:id/replied_tweets', userController.getUserRepliedTweets)

router.get('/:id/likes', userController.getUserLikes)

router.get('/:id/followings', userController.getUserFollowings)

router.get('/:id/followers', userController.getUserFollowers)

router.put('/:id', upload.fields([{ name: 'avatar' }, { name: 'coverImage' }]), userController.editUser)

router.get('/:id', userController.getUser)

module.exports = router