const { Tweet, Reply, Like, User, Followship, Sequelize, sequelize } = require('../models')

const adminController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAndCountAll({
        nest: true,
        include: [{ model: User, attributes: ['id', 'name', 'account', 'avatar'] }],
        order: [['createdAt', 'DESC']]
      })
      const tweetsData = tweets.rows.map(tweet => {
        return Object.assign(tweet.toJSON(), { description: tweet.description.slice(0, 50) })
      })
      return res.json({ status: 'success', data: { tweetsCounts: tweets.count, tweets: tweetsData } })
    } catch (err) {
      next(err)
    }
  },

  getUsers: async (req, res, next) => {
    try {
      const users = await User.findAll({
        raw: true,
        nest: true,
        include: [
          { model: Tweet, attributes: [], include: [{ model: User, as: 'LikedUsers', attributes: [], through: { attributes: [] } }]  },
          { model: User, as: 'Followings', attributes: [], through: { attributes: [] } },
          { model: User, as: 'Followers', attributes: [], through: { attributes: [] } }
        ],
        attributes: [
          'id', 'name', 'account', 'avatar', 'coverImage',
          [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Tweets.id'))), 'TweetCounts'],
          [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Tweets.LikedUsers.Like.id'))), 'LikedUsersCounts'],
          [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Followings.id'))), 'FollowingsCounts'],
          [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Followers.id'))), 'FollowersCounts']
          ],
        group: ['id'],
        order: [['TweetCounts', 'DESC']]
      })
      return res.json({ status: 'success', data: { users } })
    } catch (err) {
      next(err)
    }
  },

  deleteTweet: async (req, res, next) => {
    try {
      const tweetId = req.params.id
      const [tweet, replies, likes] = await Promise.all([
        Tweet.findByPk(tweetId),
        Reply.findAll({ where: { tweetId } }),
        Like.findAll({ where: { tweetId } })
      ])
      if (!tweet) throw new Error('tweet不存在！')
      const deletedTweet = await tweet.destroy()
      const deletedReplies = await Promise.all(replies.map(reply => reply.destroy()))
      const deletedLikes = await Promise.all(likes.map(like => like.destroy()))
      return res.json({ status: 'success', data: { deletedTweet, deletedReplies, deletedLikes } })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController