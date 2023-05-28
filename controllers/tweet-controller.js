const { Tweet, Reply, User, Sequelize } = require('../models')

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
        const isLiked = req.user.LikedTweets.some(likedTweet => likedTweet.id === tweet.id)
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
      const [tweet, replies] = await Promise.all([
        Tweet.findOne({
          nest: true,
          where: { id },
          include: [
            { model: User, attributes: ['id', 'name', 'account', 'avatar'] },
            { model: User, as: 'LikedUsers', attributes: [], through: { attributes: [] } }
          ],
          attributes: { include: [[Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('LikedUsers.Like.id'))), 'LikedUsersCounts']] },
          group: ['id']
        }),
        Reply.findAndCountAll({
          nest: true,
          distinct: true,
          where: { tweetId: id },
          include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
          order: [['createdAt', 'DESC']]
        })
      ])
      const isLiked = req.user.LikedTweets.some(likedTweet => likedTweet.id === tweet.id)
      return res.json({ status: 'success', data: { tweet, replies, isLiked } })
    } catch (err) {
      next(err)
    }
  },

  postTweet: async (req, res, next) => {
    try {
      const description = req.body.description?.trim()
      const userId = req.user.id
      if (!description || description.length > 140) {
        res.redirect('back')
        return res.json({ status: 'error', message: '推文字數限制在 140 以內，且不能為空白！' })
      }
      const createdTweet = await Tweet.create({ description, userId })
      return res.json({ status: 'success', data: { createdTweet } })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController