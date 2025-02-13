const { Tweet, Reply, User, Sequelize, Like } = require('../models')
const helpers = require('../_helpers')

const tweetController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAndCountAll({
        nest: true,
        distinct: true,
        order: [['createdAt', 'DESC']],
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Reply, attributes: [] },
          { model: User, as: 'LikedUsers', attributes: [], through: { attributes: [] } }
        ],
        attributes: [
          'id', 'description', 'createdAt', 'updatedAt',
          [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Replies.id'))), 'repliesCounts'],
          [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('LikedUsers.Like.id'))), 'LikedUsersCounts']
        ],
        group: ['id']
      })
      const tweetsData = tweets.rows.map(tweet => {
        const isLiked = helpers.getUser(req).LikedTweets.some(likedTweet => likedTweet.id === tweet.id)
        return Object.assign(tweet.toJSON(), { description: tweet.description.slice(0, 140), isLiked })
      })
      return res.json({ status: 'success', data: { tweetsCount: tweets.count.length, tweets: tweetsData } })
    } catch (err) {
      next(err)
    }
  },

  getTweet: async (req, res, next) => {
    try {
      const id = req.params.id
      const tweet = await Tweet.findOne({
        nest: true,
        where: { id },
        include: [
          { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
          { model: Reply, attributes: [] },
          { model: User, as: 'LikedUsers', attributes: [], through: { attributes: [] } }
        ],
        attributes: {
          include: [
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('LikedUsers.Like.id'))), 'LikedUsersCounts'],
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Replies.id'))), 'RepliesCounts']
          ]
        },
        group: ['id']
      })
      const isLiked = helpers.getUser(req).LikedTweets.some(likedTweet => likedTweet.id === tweet.id)
      return res.json({ status: 'success', data: { tweet, isLiked } })
    } catch (err) {
      next(err)
    }
  },

  postTweet: async (req, res, next) => {
    try {
      const description = req.body.description?.trim()
      const userId = helpers.getUser(req).id
      if (!description || description.length > 140) {
        res.redirect('back')
        return res.json({ status: 'error', message: '推文字數限制在 140 以內，且不能為空白！' })
      }
      const createdTweet = await Tweet.create({ description, userId })
      return res.json({ status: 'success', data: { createdTweet } })
    } catch (err) {
      next(err)
    }
  },

  postReply: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id
      const comment = req.body.comment?.trim()
      if (!comment) {
        res.redirect('back')
        return res.json({ status: 'error', message: '回覆文字不能為空白！' })
      }
      const createdReply = await Reply.create({ userId, tweetId, comment })
      return res.json({ status: 'success', data: { createdReply } })
    } catch (err) {
      next(err)
    }
  },

  getTweetReplies: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const replies = await Reply.findAll({
        nest: true,
        where: { tweetId },
        attributes: ['id', 'comment', 'createdAt', 'updatedAt'],
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        order: [['createdAt', 'DESC']]
      })
      return res.json({ status: 'success', data: { replies } })
    } catch (err) {
      next(err)
    }
  },

  addLike: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id
      const [like, tweet] = await Promise.all([
        Like.findOne({ where: { userId, tweetId } }),
        Tweet.findByPk(tweetId, { attributes: ['id'] })
      ])
      if (like) return res.json({ status: 'error', message: '已對此推文按過讚！' })
      if (!tweet) throw new Error('此貼文不存在！')
      const likedTweet = await Like.create({ userId, tweetId })
      return res.json({ status: 'success', data: { likedTweet } })
    } catch (err) {
      next(err)
    }
  },

  deleteLike: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const userId = helpers.getUser(req).id
      const like = await Like.findOne({ where: { userId, tweetId } })
      if (!like) return res.json({ status: 'error', message: '尚未對此推文按過讚！' })
      const unlikedTweet = await like.destroy()
      return res.json({ status: 'success', data: { unlikedTweet } })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController