const express = require('express')
const router = express.Router()
// momentjs
const moment = require('moment-timezone')
moment.locale('zh-tw')

// 路由跳轉驗證
const { isAdmin } = require('./utils/auth')

// load db model
const Friend = require('../db/models/Friends')
const User = require('../db/models/User')
const Messages = require('../db/models/Messages')

// 路由跳轉攔截
router.get('/admin', isAdmin, (req, res, next) => {
  next()
})

module.exports = router
