const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const { User } = require('../models')

const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

passport.use(new JwtStrategy(jwtOpts, async (jwt_payload, cb) => {
  try {
    const user = await User.findByPk(jwt_payload.id, {
      attributes: { exclude: ['password'] }
    })
    if (!user) return cb(null, false, { message: 'JWT驗證失敗！' })
    return cb(null, user.toJSON())
  } catch (err) {
    return cb(err, false)
  }
}))

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
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] }
    })
    return cb(null, user.toJSON())
  } catch (err) {
    return cb(err, false)
  }
})

module.exports = passport