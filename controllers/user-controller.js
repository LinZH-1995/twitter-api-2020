const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { imgurFileHelper } = require('../helpers/imagefile-helper.js')

const { User, Sequelize } = require('../models')

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
      const { avatar, coverImage } = req.files
      const data = {
        name: req.body.name?.trim(),
        introduction: req.body.introduction?.trim() || null,
        account: req.body.account?.trim(),
        email: req.body.email?.trim(),
        password: req.body.password?.trim(),
        newPassword: req.body.newPassword?.trim(),
        checkNewPassword: req.body.checkNewPassword?.trim()
      }
      const [avatarLink, coverImageLink] = await Promise.all([imgurFileHelper(avatar),imgurFileHelper(coverImage)])
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
  }
}

module.exports = userController