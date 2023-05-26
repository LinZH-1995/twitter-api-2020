module.exports = {
  errorHandler: (err, req, res, next) => {
    if (err instanceof Error) {
      res.status(err.status || 500).json({ status: 'error', errorName: `${err.name}`, message: `${err.message}` })
    } else {
      res.status(500).json({ status: 'error', message: `${err}` })
    }
    next(err)
  }
}