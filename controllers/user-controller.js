const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { User, Sequelize } = require('../models')

const { or } = Sequelize.Op

const userController = {
  signUp: async (req, res, next) => {
    try {
      if (req.body.password !== req.body.checkPassword) throw new Error('密碼與確認密碼不相符！')
      const { account, name, email, password } = req.body
      if (!account.trim() || !name.trim() || !email.trim() || !password.trim()) throw new Error('所有欄位皆為必填！')
      const user = await User.findOne({ where: { [or]: [{ email }, { account }] } })
      if (user) throw new Error('account或email已存在！')
      const hashPassword = await bcrypt.hash(password, 10)
      const createdUser = await User.create({ account, name, email, password: hashPassword, role: 'user' })
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
  }
}

module.exports = userController