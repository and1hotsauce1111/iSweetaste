const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')

// load User model
const User = require('../../dbs/models/User')

module.exports = passport => {
  passport.use(
    'local',
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const user = await User.findOne({ email })
        if (!user) return done(null, false, { message: '該用戶未註冊！' })
        const matchedPwd = bcrypt.compareSync(password, user.password)
        if (matchedPwd) return done(null, user)

        return done(null, false, { message: '密碼不正確！' })
      } catch (e) {
        console.log(e)
      }
    })
  )

  // 序列化與反序列化
  // 儲存及讀取session
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
