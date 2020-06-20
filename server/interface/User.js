if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const fs = require('fs')
const url = require('url')
const router = require('express').Router()
const Redis = require('redis')
const nodeMailer = require('nodemailer')
const passport = require('passport')
const Email = require('../db/config')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const sharp = require('sharp')

// load user model
const User = require('../db/models/User')

// load Auth
const { isLogin } = require('./utils/auth')
const mongoose = require('mongoose')

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

// init multer
const MAX_FILE_SIZE = 1000000
const upload = multer({
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpeg|png|jpg|svg)$/)) {
      cb(new Error('請上傳正確格式的圖片！'))
    }
    cb(null, true)
  }
})

// register router
router.post('/users/register', (req, res) => {
  // 取得前端傳過來的值
  const { username, email, password } = req.body

  if (username && email && password) {
    // 寫入DB
    // password加密
    const salt = bcrypt.genSaltSync(10)
    const hashPwd = bcrypt.hashSync(password, salt)
    const new_user = new User({
      name: username,
      email,
      password: hashPwd,
      avatar: null
    })

    try {
      new_user.save()
      return res.send({ msg: '註冊成功！', retCode: 0 })
    } catch (e) {
      return res.send({ msg: '發生意外的錯誤，請稍後再嘗試', retCode: -1 })
    }
  } else {
    return res.send({ msg: '資料不齊全，請重新輸入', retCode: -1 })
  }
})

// register username verify
router.post('/users/verifyName', async (req, res) => {
  const userName = req.body.username
  try {
    const existUserName = await User.find({ name: userName })
    if (existUserName.length !== 0)
      return res.send({ msg: '該暱稱已被使用', retCode: -1 })
    return res.send({ msg: '該暱稱可以使用', retCode: 0 })
  } catch (e) {
    console.log(e)
  }
})

// register email verify
router.post('/users/verifyEmail', async (req, res) => {
  const userEmail = req.body.email
  try {
    const existUserEmail = await User.find({ email: userEmail })

    if (existUserEmail.length !== 0)
      return res.send({ msg: '該信箱已被使用', retCode: -1 })
    return res.send({ msg: '該信箱可以使用', retCode: 0 })
  } catch (e) {
    console.log(e)
  }
})

// register verifyCode check
router.post('/users/checkVerifyCode', (req, res) => {
  const verifyCode = req.body.code
  try {
    RedisStore.hgetall('nodemail', (err, value) => {
      if (err) return console.log(err)

      if (verifyCode) {
        console.log('in')

        const saveCode = value.code
        const saveExpire = value.expire

        if (verifyCode === saveCode) {
          //  比對code碼是否逾期
          if (new Date().getTime() - saveExpire > 0) {
            return res.send({ msg: '驗證碼已逾期，請重新註冊！', retCode: -1 })
          }
          return res.send({ msg: '驗證碼成功！', retCode: 0 })
        } else {
          return res.send({ msg: '驗證碼錯誤！', retCode: -1 })
        }
      } else {
        return res.send({ msg: '請輸入驗證碼', retCode: -1 })
      }
    })
  } catch (e) {
    console.log(e)
  }
})

// 發送email認證碼
router.post('/users/verify', (req, res, next) => {
  try {
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
  } catch (e) {
    console.log(e)
  }
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
  let haveAvatar = false
  if (req.isAuthenticated()) {
    const { id, name, email } = req.user
    if (req.user.avatar !== null) {
      haveAvatar = true
    }
    return res.send({ id, loginUser: name, email, haveAvatar, retCode: 0 })
  }
  return res.send({ id: '', user: '', email: '', haveAvatar, retCode: -1 })
})

// 取得管理者
router.get('/users/getAdmin', async (req, res) => {
  try {
    const admin = await User.find({ name: 'admin' })
    if (admin.length !== 0) {
      return res.send({ admin: admin[0], msg: '獲得管理者', retCode: 0 })
    }
    return res.send({ admin: '', msg: '尚未建立管理者', retCode: -1 })
  } catch (e) {
    console.log(e)
  }
})

// logout
router.get('/users/logout', (req, res, next) => {
  // req.logout() express 原生的方法
  req.logout()
  req.session.destroy()
  return res.send({ msg: '已成功登出', retCode: 0 })
})

// upload avatar
router.post(
  '/users/:id/avatar',
  upload.single('avatar'),
  async (req, res) => {
    const id = req.params.id
    const user = await User.find({ _id: mongoose.Types.ObjectId(id) })
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 100, height: 100 })
      .png()
      .toBuffer()

    try {
      if (user.length !== 0) {
        // update avatar
        const updatedUser = await User.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(id) },
          { avatar: buffer }
        )
        return res.send({ updatedUser, msg: '成功更新大頭貼', ret_code: 0 })
      } else {
        // no user find
        return res.send({ msg: '找不到使用者', ret_code: -1 })
      }
    } catch (e) {
      console.log(e)
      return res.send({ msg: '上傳大頭貼失敗！', ret_code: -1 })
    }
  },
  (err, req, res, next) => {
    console.log(err)
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.send({ msg: '檔案超過大小限制！' })
    }
    return res.send({ msg: err.message })
  }
)

// 取得大頭貼
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const id = req.params.id
    const user = await User.findById(id)

    if (!user || !user.avatar) {
      return res.send({ msg: '找不到使用者或大頭貼未上傳', ret_code: -1 })
    }

    res.set('Content-Type', 'image/png')
    return res.send(user.avatar)
  } catch (e) {
    console.log(e)
    return res.send({ msg: '獲取大頭貼失敗！', ret_code: -1 })
  }
})

// 更新使用者名稱
router.post('/users/:id/changeUserName', async (req, res) => {
  const id = req.params.id
  const { changeName } = req.body
  const user = await User.findById(id)
  if (!user) return res.send({ msg: '找不到使用者！', ret_code: -1 })
  const existName = await User.find({ name: decodeURIComponent(changeName) })
  if (existName.length !== 0) return res.send({ msg: '該暱稱已被使用！', ret_code: -1 })
  try {
    user.name = changeName
    user.save()
    return res.send({ msg: '成功更新使用者名稱！', ret_code: 0 })
  } catch (e) {
    console.log(e)
  }
})

// 已登入的攔截 防止登入後訪問登入頁面
router.get('/login', isLogin)

module.exports = router
