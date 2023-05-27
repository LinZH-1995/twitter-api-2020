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
          { model: User, as: 'LikedUsers', attributes:[], through: { attributes: [] } }
        ],
        attributes: [
          'id', 'description', 'createdAt', 'updatedAt',
          [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Replies.id'))), 'repliesCounts'],
          [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('LikedUsers.Like.id'))), 'LikedUsersCounts']
        ],
        group: ['id']
      })
      const tweetsData = tweets.rows.map(tweet => Object.assign(tweet.toJSON(), { description: tweet.description.slice(0, 140) }))
      return res.json({ status: 'success', data: { tweetsCount: tweets.count.length, tweets: tweetsData } })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = tweetController