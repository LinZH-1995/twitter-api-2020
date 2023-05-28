const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { imgurFileHelper } = require('../helpers/imagefile-helper.js')

const { User, Sequelize, Tweet, Reply, Like, Followship } = require('../models')

const { or } = Sequelize.Op

const userController = {
  signUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.checkPassword) throw new Error('密碼與確認密碼不相符！')
      const data = {
        account: req.body.account?.trim(),
        name: req.body.name?.trim(),
        email: req.body.email?.trim(),
        password: req.body.password?.trim()
      }
      if (!data.account || !data.name || !data.email || !data.password) throw new Error('所有欄位皆為必填！')
      const user = await User.findOne({ where: { [or]: [{ email: data.email }, { account: data.account }] } })
      if (user) throw new Error('account或email已存在！')
      const hashPassword = await bcrypt.hash(data.password, 10)
      const createdUser = await User.create(Object.assign(data, { password: hashPassword, role: 'user' }))
      return res.json({ status: 'success', data: { createdUser } })
    } catch (err) {
      next(err)
    }
  },

  signIn: async (req, res, next) => {
    try {
      const user = req.user
      const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '30d' })
      return res.json({ status: 'success', data: { token, user } })
    } catch (err) {
      next(err)
    }
  },

  editUser: async (req, res, next) => {
    try {
      const id = req.params.id
      if (req.user.id.toString() !== id) throw new Error('無法編輯他人資料！')
      const { avatar, coverImage } = req.files || {}
      const data = {
        name: req.body.name?.trim(),
        introduction: req.body.introduction?.trim() || null,
        account: req.body.account?.trim(),
        email: req.body.email?.trim(),
        password: req.body.password?.trim(),
        newPassword: req.body.newPassword?.trim(),
        checkNewPassword: req.body.checkNewPassword?.trim()
      }
      const [avatarLink, coverImageLink] = await Promise.all([imgurFileHelper(avatar), imgurFileHelper(coverImage)])
      const [user, editUser] = await Promise.all([
        User.findOne({ where: { [or]: [{ email: data.email || null }, { account: data.account || null }] } }),
        User.findByPk(id)
      ])
      if (user) throw new Error('account或email已存在！')
      if (!editUser) throw new Error("user不存在！")
      let hashPassword = ''
      if (data.password) {
        if (!data.newPassword) throw new Error("請輸入新密碼！")
        if (data.newPassword !== data.checkNewPassword) throw new Error('新密碼與確認密碼不相符！')
        const match = await bcrypt.compare(data.password, editUser.password)
        if (!match) throw new Error("舊密碼錯誤！")
        hashPassword = await bcrypt.hash(data.newPassword, 10)
      }
      const editedUser = await editUser.update(Object.assign(data, {
        password: hashPassword || editUser.password,
        avatar: avatarLink || editUser.avatar,
        coverImage: coverImageLink || editUser.coverImage
      }))
      return res.json({ status: 'success', data: { editedUser } })
    } catch (err) {
      next(err)
    }
  },

  getUser: async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findByPk(id, {
        nest: true,
        include: [
          { model: Tweet, attributes: [] },
          { model: User, as: 'Followings', attributes: [], through: { attributes: [] } },
          { model: User, as: 'Followers', attributes: [], through: { attributes: [] } }
        ],
        attributes: {
          exclude: ['email', 'password'],
          include: [
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Tweets.id'))), 'TweetsCounts'],
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Followings.id'))), 'FollowingsCounts'],
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Followers.id'))), 'FollowersCounts']
          ]
        },
        group: ['id']
      })
      if (!user) throw new Error('user不存在！')
      const isFollowing = req.user.Followings.some(following => following.id === user.id)
      return res.json({ status: 'success', data: { user, isFollowing } })
    } catch (err) {
      next(err)
    }
  },

  getUserTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const [user, userTweets] = await Promise.all([
        User.findByPk(userId, { attributes: ['id', 'name', 'account', 'avatar'] }),
        Tweet.findAll({
          nest: true,
          where: { userId },
          order: [['createdAt', 'DESC']],
          include: [
            { model: Reply, attributes: [] },
            { model: User, as: 'LikedUsers', attributes: [], through: { attributes: [] } }
          ],
          attributes: [
            'id', 'description', 'createdAt', 'updatedAt',
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Replies.id'))), 'RepliesCounts'],
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('LikedUsers.Like.id'))), 'LikedUsersCounts']
          ],
          group: ['id']
        })
      ])
      if (!user) throw new Error('user不存在！')
      const userTweetsData = userTweets.map(tweet => {
        const isLiked = req.user.LikedTweets.some(likedTweet => likedTweet.id === tweet.id)
        return Object.assign(tweet.toJSON(), { description: tweet.description.slice(0, 100), isLiked })
      })
      return res.json({ status: 'success', data: { user, userTweets: userTweetsData } })
    } catch (err) {
      next(err)
    }
  },

  getUserRepliedTweets: async (req, res, next) => {
    try {
      const userId = req.params.id
      const [user, userRepliedTweets] = await Promise.all([
        User.findByPk(userId, { attributes: ['id', 'name', 'account', 'avatar'] }),
        Reply.findAll({
          nest: true,
          where: { userId },
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: Tweet, include: [
                { model: Reply, attributes: [] },
                { model: User, as: 'LikedUsers', attributes: [], through: { attributes: [] } }
              ]
            }
          ],
          attributes: [
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Tweet.Replies.id'))), 'RepliesCounts'],
            [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Tweet.LikedUsers.Like.id'))), 'LikedUsersCounts']
          ],
          group: ['id']
        })
      ])
      if (!user) throw new Error('user不存在！')
      const userRepliedTweetsData = userRepliedTweets.map(repliedTweet => {
        const data = repliedTweet.toJSON()
        const isLiked = req.user.LikedTweets.some(likedTweet => likedTweet.id === data.Tweet.id)
        data.Tweet.description = data.Tweet.description.slice(0, 100)
        return Object.assign(data, { isLiked })
      })
      return res.json({ status: 'success', data: { user, userRepliedTweets: userRepliedTweetsData } })
    } catch (err) {
      next(err)
    }
  },

  getUserLikes: async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findByPk(id, {
        nest: true,
        attributes: ['id', 'name', 'account', 'avatar'],
        include: [{ model: Tweet, as: 'LikedTweets', through: { attributes: ['createdAt'] } }],
        order: [[{ model: Tweet, as: 'LikedTweets' }, Like, 'createdAt', 'DESC']]
      })
      if (!user) throw new Error('user不存在！')
      const userLikesData = user.LikedTweets.map(likedTweet => {
        const isLiked = req.user.LikedTweets.some(myLikedTweet => myLikedTweet.id === likedTweet.id)
        return Object.assign(likedTweet.toJSON(), { description: likedTweet.description.slice(0, 100), isLiked })
      })
      const userData = Object.assign(user.toJSON(), { LikedTweets: userLikesData })
      return res.json({ status: 'success', data: { user: userData } })
    } catch (err) {
      next(err)
    }
  },

  getUserFollowings: async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findByPk(id, {
        nest: true,
        attributes: ['id', 'name', 'account', 'avatar'],
        include: [{ model: User, as: 'Followings', attributes: ['id', 'name', 'account', 'avatar'], through: { attributes: ['createdAt'] } }],
        order: [[{ model: User, as: 'Followings' }, Followship, 'createdAt', 'DESC']]
      })
      if (!user) throw new Error('user不存在！')
      const userFollowingsData = user.Followings.map(following => {
        const isFollowing = req.user.Followings.some(myFollowing => myFollowing.id === following.id)
        return Object.assign(following.toJSON(), { isFollowing })
      })
      const userData = Object.assign(user.toJSON(), { Followings: userFollowingsData })
      return res.json({ status: 'success', data: { user: userData } })
    } catch (err) {
      next(err)
    }
  },

  getUserFollowers: async (req, res, next) => {
    try {
      const id = req.params.id
      const user = await User.findByPk(id, {
        nest: true,
        attributes: ['id', 'name', 'account', 'avatar'],
        include: [{ model: User, as: 'Followers', attributes: ['id', 'name', 'account', 'avatar'], through: { attributes: ['createdAt'] } }],
        order: [[{ model: User, as: 'Followers' }, Followship, 'createdAt', 'DESC']]
      })
      if (!user) throw new Error('user不存在！')
      const userFollowersData = user.Followers.map(follower => {
        const isFollowing = req.user.Followings.some(myFollowing => myFollowing.id === follower.id)
        return Object.assign(follower.toJSON(), { isFollowing })
      })
      const userData = Object.assign(user.toJSON(), { Followers: userFollowersData })
      return res.json({ status: 'success', data: { user: userData } })
    } catch (err) {
      next(err)
    }
  },

  postFollowing: async (req, res, next) => {
    try {
      const followingId = req.params.id
      const followerId = req.user.id
      if (followerId.toString() === followingId) return res.json({ status: 'error', message: '無法追蹤自己！' })
      const [following, followingUser] = await Promise.all([
        Followship.findOne({ where: { followerId, followingId } }),
        User.findByPk(followingId, { attributes: ['id'] })
      ])
      if (following) return res.json({ status: 'error', message: '已追蹤此用戶！' })
      if (!followingUser) throw new Error('欲追蹤用戶不存在！')
      const addFollowingUser = await Followship.create({ followerId, followingId })
      return res.json({ status: 'success', data: { addFollowingUser } })
    } catch (err) {
      next(err)
    }
  },

  deleteFollowing: async (req, res, next) => {
    try {
      const followingId = req.params.id
      const followerId = req.user.id
      const following = await Followship.findOne({ where: { followerId, followingId } })
      if (!following) return res.json({ status: 'error', message: '尚未追蹤此用戶！' })
      const deleteFollowingUser = await following.destroy()
      return res.json({ status: 'success', data: { deleteFollowingUser } })
    } catch (err) {
      next(err)
    }
  },

  getTop10User: async (req, res, next) => {
    try {
      const users = await User.findAll({
        nest: true,
        include: [{ model: User, as: 'Followers', attributes: [], through: { attributes: [] }, duplicating: false }],
        attributes: [
          'id', 'name', 'account', 'avatar',
          [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('Followers.Followship.id'))), 'followersCounts']
        ],
        group: ['id'],
        order: [['followersCounts', 'DESC']],
        limit: 10
      })
      const userData = users.map(user => {
        const isFollowing = req.user.Followings.some(following => following.id === user.id)
        return Object.assign(user.toJSON(), { isFollowing })
      })
      return res.json({ status: 'success', data: { users: userData } })
    } catch (err) {
      next(err)
    }
  }
}

module.exports = userController


// getTop10User:

// without { limit } and { include: [{ duplicating: false }] } = works well but not limit for result
// Executing(default ):
// SELECT`User`.`id`, `User`.`name`, `User`.`account`, `User`.`avatar`, COUNT(DISTINCT(`Followers->Followship`.`id`)) AS `followersCounts`
// FROM `Users` AS `User`
// LEFT OUTER JOIN(`Followships` AS`Followers->Followship` INNER JOIN`Users` AS`Followers` ON`Followers`.`id` = `Followers->Followship`.`follower_id`)
// ON`User`.`id` = `Followers->Followship`.`following_id`
// GROUP BY `id`
// ORDER BY `followersCounts` DESC;

// use { limit } but without { include: [{ duplicating: false }] } = SequelizeDatabaseError: "Unknown column 'Followers->Followship.id' in 'field list'"
// Executing(default ):
// SELECT`User`.*
// FROM(SELECT`User`.`id`, `User`.`name`, `User`.`account`, `User`.`avatar`, COUNT(DISTINCT(`Followers->Followship`.`id`)) AS`followersCounts`
// FROM`Users` AS`User` GROUP BY`id` ORDER BY`User`.`followersCounts` DESC LIMIT 10) AS `User`
// LEFT OUTER JOIN(`Followships` AS`Followers->Followship` INNER JOIN`Users` AS`Followers` ON`Followers`.`id` = `Followers->Followship`.`follower_id`)
// ON`User`.`id` = `Followers->Followship`.`following_id`
// ORDER BY `followersCounts` DESC;

// use { limit } and { include: [{ duplicating: false }] } = work well with limit for result
// Executing(default ):
// SELECT`User`.`id`, `User`.`name`, `User`.`account`, `User`.`avatar`, COUNT(DISTINCT(`Followers->Followship`.`id`)) AS `followersCounts`
// FROM `Users` AS `User` 
// LEFT OUTER JOIN(`Followships` AS`Followers->Followship` INNER JOIN`Users` AS`Followers` ON`Followers`.`id` = `Followers->Followship`.`follower_id`)
// ON`User`.`id` = `Followers->Followship`.`following_id`
// GROUP BY `id`
// ORDER BY `followersCounts` DESC
// LIMIT 10;
