module.exports = {
  isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/login')
  },
  isLogin(req, res, next) {
    if (!req.isAuthenticated()) {
      return next()
    }
    res.redirect('/')
  },
  isAdmin(req, res, next) {
    if (req.isAuthenticated() && req.user.name === 'admin') {
      return next()
    }
    res.redirect('/')
  }
}
