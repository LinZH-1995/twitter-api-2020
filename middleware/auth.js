const passport = require('../config/passport.js')

module.exports = {
  localStrategyAuth: (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err)
      if (!user) return res.status(401).json({ status: 'error', message: info.message })
      if (user.role === 'admin') return res.status(401).json({ status: 'error', message: 'admin禁止使用前台！' })
      delete user.password
      req.user = user
      next()
    })(req, res, next)
  },

  localStrategyAdminAuth: (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err)
      if (!user) return res.status(401).json({ status: 'error', message: info.message })
      if (user.role === 'user') return res.status(401).json({ status: 'error', message: '一般使用者禁止使用後台！' })
      delete user.password
      req.user = user
      next()
    })(req, res, next)
  },

  jwtStrategyAuth: (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) return next(err)
      if (!user) return res.status(401).json({ status: 'error', message: info.message })
      req.user = user
      next()
    })(req, res, next)
  }
}