if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const url = require('url')
const router = require('express').Router()
const Redis = require('redis')
const nodeMailer = require('nodemailer')
const passport = require('passport')
const Email = require('../db/config')
const bcrypt = require('bcryptjs')

// load user model
const User = require('../db/models/User')

// load Auth
const { isLogin } = require('./utils/auth')

// 建立redis
// sesseion config
let RedisStore
if (process.env.REDIS_URL) {
  // 部署至線上用
  let rtg = url.parse(process.env.REDIS_URL)
  RedisStore = Redis.createClient(rtg.port, rtg.hostname, {
    no_ready_check: true
  })
  RedisStore.auth(rtg.auth.split(':')[1])
} else {
  RedisStore = Redis.createClient()
}

// register router
router.post('/users/register', (req, res) => {
  // 取得前端傳過來的值
  const { username, email, password, code } = req.body

  // 取得redis中的value
  RedisStore.hgetall('nodemail', async (err, value) => {
    if (err) return console.log(err)
    // 資料驗證
    if (code) {
      const saveCode = value.code
      const saveExpire = value.expire

      if (code === saveCode) {
        //  比對code碼是否逾期
        if (new Date().getTime() - saveExpire > 0) {
          return res.send({ msg: '驗證碼已逾期，請重新註冊！', retCode: -1 })
        }
      } else {
        return res.send({ msg: '驗證碼錯誤！', retCode: -1 })
      }
    } else {
      return res.send({ msg: '請輸入驗證碼', retCode: -1 })
    }

    // username和email關聯
    const exist_user_by_name = await User.find({ name: username })
    const exist_user_by_email = await User.find({ email })

    if (exist_user_by_name.length) return res.send({ msg: '該暱稱已被使用', retCode: -1 })
    if (exist_user_by_email.length)
      return res.send({ msg: '該信箱已被註冊', retCode: -1 })

    if (!exist_user_by_name.length && !exist_user_by_email.length) {
      // 寫入DB
      // password加密
      const salt = bcrypt.genSaltSync(10)
      const hashPwd = bcrypt.hashSync(password, salt)
      const new_user = new User({
        name: username,
        email,
        password: hashPwd
      })

      try {
        new_user.save()
        return res.send({ msg: '註冊成功！', retCode: 0 })
      } catch (e) {
        return res.send({ msg: '發生意外的錯誤，請稍後再嘗試', retCode: -1 })
      }
    }
  })
})

// email verify
router.post('/users/verify', (req, res, next) => {
  // 驗證碼是否逾期
  RedisStore.hget('nodemail', 'expire', async (err, value) => {
    if (err) return console.log(err)
    if (value && new Date().getTime() - value < 0) {
      return res.send({ msg: '驗證請求過於頻繁，限五分鐘內一次', code: -1 })
    }
    // 發送郵件setting
    let transporter = nodeMailer.createTransport({
      host: Email.smtp.host,
      port: 587,
      secure: false,
      auth: {
        user: Email.smtp.user,
        pass: Email.smtp.pass
      }
    })

    // 發送內容setting
    let mailSetting = {
      code: Email.smtp.code(),
      expire: Email.smtp.expire(),
      email: req.body.email,
      user: req.body.username
    }

    // 信件主體 內容
    let mailOptions = {
      from: `"Sweetaste認證郵件" <${Email.smtp.user}>`,
      to: mailSetting.email,
      subject: '<< Sweetaste >> 驗證碼',
      html: `您在<< Sweetaste >> 註冊，您的驗證碼是 ${mailSetting.code}`
    }

    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) return console.log('err', error)
      // 存到redis
      RedisStore.hmset(
        `nodemail`,
        'code',
        mailSetting.code,
        'expire',
        mailSetting.expire,
        'email',
        mailSetting.email
      )
      return res.send({ msg: '驗證碼已成功發送', code: 0 })
    })
  })
})

// user login
router.post('/users/login', (req, res, next) => {
  return passport.authenticate('local', (err, user, info) => {
    if (err) return res.send({ msg: '發生非預期錯誤，請稍後再嘗試登入', retCode: -1 })
    if (!user) return res.send({ msg: info.message, retCode: -1 })

    // 重新設置session expire time
    if (req.body.rememberMe) {
      req.session.cookie.maxAge = 86400 * 7
    }

    // req.login() express 原生的方法
    req.login(user, err => {
      if (err) return next(err)
      return res.send({ msg: '成功登入', retCode: 0 })
    })
  })(req, res, next)
})

// 取得已登入使用者
router.get('/users/getUser', (req, res, next) => {
  // req.isAuthenticated() express 原生的方法
  if (req.isAuthenticated()) {
    const { id, name, email } = req.user
    return res.send({ id, user: name, email, retCode: 0 })
  }
  return res.send({ id: '', user: '', email: '', retCode: -1 })
})

// 取得管理者
router.get('/users/getAdmin', async (req, res) => {
  const admin = await User.find({ name: 'admin' })
  if (admin.length !== 0) {
    return res.send({ admin: admin[0], msg: '獲得管理者', retCode: 0 })
  }
})

// logout
router.get('/users/logout', (req, res, next) => {
  // req.logout() express 原生的方法
  req.logout()
  req.session.destroy()
  return res.send({ msg: '已成功登出', retCode: 0 })
})

// 已登入的攔截 防止登入後訪問登入頁面
router.get('/login', isLogin)

module.exports = router
