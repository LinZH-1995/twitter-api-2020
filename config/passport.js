const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local')

passport.use(new LocalStrategy({ usernameField: 'email', passReqToCallback: true }, async (req, email, password, cb) => {
  try {
  } catch (err) {
    return cb(err, false)
  }
}))

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser(async (id, cb) => {
  try {
  } catch (err) {
    cb(err, false)
  }
})

module.exports = passport