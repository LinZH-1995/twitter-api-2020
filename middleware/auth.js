const passport = require('../config/passport.js')

module.exports = {
  localStrategyAuth: (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err)
      if (!user) return res.status(401).json({ status: 'error', message: info.message })
      delete user.password
      req.user = user
      next()
    })(req, res, next)
  }
}