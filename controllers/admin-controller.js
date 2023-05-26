const { Tweet } = require('../models')

const adminController = {
  getTweets: async (req, res, next) => {
    try {
      const tweets = await Tweet.findAndCountAll({
        nest: true,
        order: [['createdAt', 'DESC']]
      })
      const tweetsData = tweets.rows.map(tweet => {
        return Object.assign(tweet.toJSON(), { description: tweet.description.slice(0, 50) })
      })
      return res.json({ status: 'success', data: { tweetsCounts: tweets.count, tweets: tweetsData } })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = adminController