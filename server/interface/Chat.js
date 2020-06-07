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
// 非管理者導回首頁
router.get('/admin', isAdmin, (req, res, next) => {
  next()
})

// 使用者加入
router.post('/addFriend', async (req, res) => {
  const { selfId, friendId, loginTime } = req.body
  // 判斷是否重複添加
  const existFriend = await Friend.find({ friendId })
  if (existFriend.length !== 0)
    return res.send({ friend: existFriend, msg: '使用者已存在', retCode: -1 })
  const new_friend = new Friend({
    selfId,
    friendId,
    loginTime
  })
  try {
    new_friend.save().then(async () => {
      const newFriend = await Friend.find({ friendId })
      return res.send({ friend: newFriend, msg: '成功添加使用者列表', retCode: 0 })
    })
  } catch (e) {
    return res.send({ msg: '發生意外的錯誤，請稍後再嘗試', retCode: -1 })
  }
})

// 取得使用者列表
router.get('/allFriends', async (req, res) => {
  // populate填充欄位friendId
  const friends = await Friend.find({ selfId: 'admin' }).populate('friendId')
  if (friends.length !== 0) {
    return res.send({ friends, msg: '成功獲取使用者列表', retCode: 0 })
  }
  return res.send({ friends, msg: '獲取使用者列表失敗', retCode: -1 })
})

// 取得單一使用者 / 管理者
router.post('/oneFriend', async (req, res) => {
  const friendId = req.body.friendId
  const friend = await Friend.find({ friendId })
  const admin = await User.find({ name: 'admin' })
  if (friend.length === 0)
    return res.send({ friend, admin, msg: '查無使用者', retCode: -1 })
  return res.send({ friend, admin, msg: '成功獲取使用者', retCode: 0 })
})

// 記錄聊天訊息
router.post('/addChatMessage', async (req, res) => {
  const { tempMsg } = req.body
  const addMsg = []
  tempMsg.forEach(msg => {
    addMsg.push(new Messages(msg))
  })

  // 批次添加
  Messages.insertMany(addMsg, function(err, docs) {
    if (err) return res.send({ msg: '紀錄聊天訊息失敗', retCode: -1 })
    return res.send({ msg: '成功添加聊天訊息', retCode: 0 })
  })
})

// 獲取個別聊天訊息
router.post('/historyMessage', async (req, res) => {
  const { from, to } = req.body
  if (from && to) {
    const allMessages = await Messages.find()
      .or([
        { $and: [{ from: from }, { to: to }] },
        { $and: [{ from: to }, { to: from }] }
      ])
      .populate('from to')
      .sort([['createAt', 1]])

    const allMsg = [
      {
        userId: to,
        msg: allMessages
      }
    ]

    if (allMessages.length !== 0)
      return res.send({ allMsg, msg: '成功獲取歷史訊息', retCode: 0 })

    return res.send({ allMsg, msg: '尚無歷史訊息', retCode: -1 })
  }
  return res.send({ allMsg, msg: '查詢資料不完整', retCode: -1 })
})

// 獲取所有聊天訊息
router.post('/allHistoryMessage', async (req, res) => {
  const allUsers = await Friend.find()
  const adminId = req.body.adminId
  const allMsg = []
  if (allUsers.length === 0) return res.send({ msg: '尚未添加使用者', retCode: -1 })

  for await (user of allUsers) {
    const messages = await Messages.find()
      .or([
        { $and: [{ from: user.friendId }, { to: adminId }] },
        { $and: [{ from: adminId }, { to: user.friendId }] }
      ])
      .populate('from to')
      .sort([['createAt', 1]])

    if (messages) {
      allMsg.push({
        userId: user.friendId,
        msg: messages
      })
    }
  }
  if (allMsg.length !== 0)
    return res.send({ allMsg, msg: '成功獲取所有歷史訊息', retCode: 0 })
  return res.send({ allMsg, msg: '查無歷史訊息', retCode: -1 })
})

// 獲取最新一則訊息
router.post('/getLastestMsg', async (req, res) => {
  const lastestMsg = await Messages.findOne().sort({ createAt: -1 })
  if (lastestMsg) return res.send({ lastestMsg, retCode: 0 })
  return res.send({ msg: '查無最後一則訊息', retCode: -1 })
})

// 更新使用者登入時間
router.post('/upadatLoginTime', async (req, res) => {
  const { userId, loginTime } = req.body

  try {
    if (userId) {
      await Friend.update({ friendId: userId }, { loginTime })
      return res.send({ msg: '成功更新登入時間', retCode: 0 })
    }
  } catch (e) {
    console.log(e)
    return res.send({ msg: '更新登入時間失敗', retCode: -1 })
  }
})

// 更新聊天訊息為已讀
router.post('/readMessage', async (req, res) => {
  console.log('updat unread')
  const { to, from } = req.body
  const allMessages = await Messages.find().or([
    { $and: [{ from: from }, { to: to }] },
    { $and: [{ from: to }, { to: from }] }
  ])

  if (allMessages) {
    allMessages.forEach(msg => {
      msg.unread = '1'
      msg.save()
    })
    return res.send({ msg: '成功更改為已讀訊息', retCode: 0 })
  }

  return res.send({ msg: '更改已讀訊息失敗', retCode: -1 })

  // const updateReadMsg = await Messages.updateMany(
  //   [{ $or: [{ from: from }, { to: to }] }, { $or: [{ from: to }, { to: from }] }],
  //   { unread: '1' }
  // )
  // const updateSucceedNum = updateReadMsg.n
  // if (updateSucceedNum > 0)
  //   return res.send({ updateSucceedNum, msg: '成功更改為已讀訊息', retCode: 0 })
  // return res.send({ updateSucceedNum, msg: '更改已讀訊息失敗', retCode: -1 })
})

// 更新發送訊息狀態
router.post('/sendMsgSucceed', async (req, res) => {
  const { to, from } = req.body
  const updateSendMsg = await Messages.updateMany(
    { to: to, from: from },
    { isSend: true }
  )
  const updateSendMsgNum = updateSendMsg.n
  if (updateSendMsgNum > 0)
    return res.send({ updateSendMsgNum, msg: '成功更改發送訊息狀態', retCode: 0 })
  return res.send({ updateSendMsgNum, msg: '更改發送訊息失敗', retCode: -1 })
})

// 獲取未讀訊息小紅點
router.post('/getUnreadMsgCount', async (req, res) => {
  const { from, to } = req.body
  if (from && to) {
    try {
      const allMessages = await Messages.find()
        .or([
          { $and: [{ from: from }, { to: to }] },
          { $and: [{ from: to }, { to: from }] }
        ])
        .populate('from to')
        .sort([['createAt', 1]])

      if (allMessages.length !== 0) {
        const unreadAdminMessage = allMessages.filter(msg => {
          return msg.username === 'admin' && msg.unread === '0'
        })

        const unreadAdminMessageCount = unreadAdminMessage.length

        if (unreadAdminMessageCount === 0)
          return res.send({ msg: '查無未讀訊息', retCode: -1 })

        return res.send({
          unreadMsgCount: unreadAdminMessageCount,
          msg: '成功獲取',
          retCode: 0
        })
      }
      return res.send({
        msg: '查無歷史訊息',
        retCode: -1
      })
    } catch (e) {
      console.log(e)
    }
  }
  return res.send({ msg: '查詢訊息不完整', retCode: -1 })
})

module.exports = router
