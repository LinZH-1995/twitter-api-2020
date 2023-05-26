const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local')

const { User } = require('../models')

passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, cb) => {
  try {
    const user = await User.findOne({ where: { email }, attributes: { exclude: ['introduction', 'avatar', 'coverImage', 'createdAt', 'updatedAt'] } })
    if (!user) return cb(null, false, { message: '帳號或密碼輸入錯誤！' })
    const match = await bcrypt.compare(password, user.password)
    if (match) return cb(null, user.toJSON())
    return cb(null, false, { message: '帳號或密碼輸入錯誤！' })
  } catch (err) {
    return cb(err, false)
  }
}))

passport.serializeUser((user, cb) => {
  return cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
  try {
    const user = await User.findByPk(id)
    return cb(null, user.toJSON())
  } catch (err) {
    return cb(err, false)
  }
})

module.exports = passport