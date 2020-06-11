const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
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
  const existFriend = await Friend.find({ friendId: mongoose.Types.ObjectId(friendId) })
  if (existFriend.length !== 0)
    return res.send({ friend: existFriend, msg: '使用者已存在', retCode: -1 })
  const new_friend = new Friend({
    selfId,
    friendId,
    loginTime
  })
  try {
    new_friend.save().then(async () => {
      const newFriend = await Friend.find({ friendId: mongoose.Types.ObjectId(friendId) })
      return res.send({ friend: newFriend, msg: '成功添加使用者列表', retCode: 0 })
    })
  } catch (e) {
    return res.send({ msg: '發生意外的錯誤，請稍後再嘗試', retCode: -1 })
  }
})

// 取得使用者列表
router.get('/allFriends', async (req, res) => {
  // populate填充欄位friendId
  try {
    const friends = await Friend.find({ selfId: 'admin' }).populate('friendId')
    if (friends.length !== 0) {
      return res.send({ friends, msg: '成功獲取使用者列表', retCode: 0 })
    }
    return res.send({ friends, msg: '獲取使用者列表失敗', retCode: -1 })
  } catch (e) {
    console.log(e)
  }
})

// 取得單一使用者 / 管理者
router.post('/oneFriend', async (req, res) => {
  const friendId = req.body.friendId
  try {
    const friend = await Friend.find({ friendId: mongoose.Types.ObjectId(friendId) })
    const admin = await User.find({ name: 'admin' })
    if (friend.length === 0)
      return res.send({ friend, admin, msg: '查無使用者', retCode: -1 })
    return res.send({ friend, admin, msg: '成功獲取使用者', retCode: 0 })
  } catch (e) {
    console.log(e)
  }
})

// 記錄聊天訊息
router.post('/addChatMessage', async (req, res) => {
  const { tempMsg } = req.body
  const addMsg = []
  tempMsg.forEach(msg => {
    addMsg.push(new Messages(msg))
  })

  try {
    // 批次添加
    Messages.insertMany(addMsg, function(err, docs) {
      if (err) return res.send({ msg: '紀錄聊天訊息失敗', retCode: -1 })
      return res.send({ msg: '成功添加聊天訊息', retCode: 0 })
    })
  } catch (e) {
    console.log(e)
  }
})

// 獲取個別聊天訊息
router.post('/historyMessage', async (req, res) => {
  const { from, to } = req.body
  try {
    if (from && to) {
      const allMessages = await Messages.find()
        .or([
          {
            $and: [
              { from: mongoose.Types.ObjectId(from) },
              { to: mongoose.Types.ObjectId(to) }
            ]
          },
          {
            $and: [
              { from: mongoose.Types.ObjectId(to) },
              { to: mongoose.Types.ObjectId(from) }
            ]
          }
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
  } catch (e) {
    console.log(e)
  }
})

// 獲取所有聊天訊息
router.post('/allHistoryMessage', async (req, res) => {
  const allUsers = await Friend.find()
  const allMsg = []
  const adminId = req.body.adminId
  if (allUsers.length === 0) return res.send({ msg: '尚未添加使用者', retCode: -1 })

  try {
    for await (user of allUsers) {
      const messages = await Messages.find()
        .or([
          {
            $and: [
              { from: mongoose.Types.ObjectId(user.friendId) },
              { to: mongoose.Types.ObjectId(adminId) }
            ]
          },
          {
            $and: [
              { from: mongoose.Types.ObjectId(adminId) },
              { to: mongoose.Types.ObjectId(user.friendId) }
            ]
          }
        ])
        .populate('from to')
        .sort([['createAt', 1]])

      // console.log('messages', messages)

      if (messages) {
        allMsg.push({
          userId: user.friendId,
          msg: messages
        })
      }
    }
    // console.log('allMsg', allMsg[0].msg[0])

    if (allMsg.length !== 0)
      return res.send({ allMsg, msg: '成功獲取所有歷史訊息', retCode: 0 })
    return res.send({ allMsg, msg: '查無歷史訊息', retCode: -1 })
  } catch (e) {
    console.log(e)
  }
})

// 獲取最新一則訊息
router.post('/getLastestMsg', async (req, res) => {
  try {
    const lastestMsg = await Messages.findOne().sort({ createAt: -1 })
    if (lastestMsg) return res.send({ lastestMsg, retCode: 0 })
    return res.send({ msg: '查無最後一則訊息', retCode: -1 })
  } catch (e) {
    console.log(e)
  }
})

// 更新使用者登入時間
router.post('/upadatLoginTime', async (req, res) => {
  const { userId, loginTime } = req.body

  try {
    if (userId) {
      await Friend.updateOne({ friendId: userId }, { loginTime })
      return res.send({ msg: '成功更新登入時間', retCode: 0 })
    }
  } catch (e) {
    console.log(e)
    return res.send({ msg: '更新登入時間失敗', retCode: -1 })
  }
})

// 更新聊天訊息為已讀
router.post('/readMessage', async (req, res) => {
  console.log('update read msg')

  const { from, to } = req.body

  try {
    const allMessages = await Messages.find({ from: mongoose.Types.ObjectId(from) })

    // console.log('messages', messages)

    console.log('allMessages', allMessages)

    if (allMessages) {
      for (let i = 0; i < allMessages.length; i++) {
        allMessages[i].unread = '1'
        allMessages[i].save()
      }
      return res.send({ msg: '成功更改為已讀訊息', retCode: 0 })
    }

    return res.send({ msg: '更改已讀訊息失敗', retCode: -1 })
  } catch (e) {
    console.log(e)
  }
})

// 更新發送訊息狀態
router.post('/sendMsgStatus', async (req, res) => {
  const { to, from } = req.body
  try {
    const updateSendMsg = await Messages.updateMany(
      { from: mongoose.Types.ObjectId(from), to: mongoose.Types.ObjectId(to) },
      { isSend: true },
      { multi: true }
    )
    const updateSendMsgNum = updateSendMsg.n
    if (updateSendMsgNum > 0)
      return res.send({ updateSendMsgNum, msg: '成功更改發送訊息狀態', retCode: 0 })
    return res.send({ updateSendMsgNum, msg: '更改發送訊息失敗', retCode: -1 })
  } catch (e) {
    console.log(e)
  }
})

// 更新已讀頭像(自己訊息)
router.post('/updateReadMsgImg', async (req, res) => {
  const { from, to, createAt, status } = req.body

  try {
    const updateReadMsgImg = await Messages.findOneAndUpdate(
      { from: mongoose.Types.ObjectId(from), to: mongoose.Types.ObjectId(to), createAt },
      { isRead: status },
      { new: true }
    )
    // console.log('updateReadMsgImg', updateReadMsgImg)

    if (updateReadMsgImg)
      return res.send({ updateReadMsgImg, msg: '成功更改已讀頭像', retCode: 0 })
    return res.send({ updateReadMsgImg, msg: '更改已讀頭像失敗', retCode: -1 })
  } catch (e) {
    console.log(e)
  }
})

// 更新對方訊息已送出img icon
router.post('/updateOtherMsgSendImg', async (req, res) => {
  const { from, to, createAt, status } = req.body

  try {
    const updateReadMsgImg = await Messages.findOneAndUpdate(
      { from: mongoose.Types.ObjectId(from), to: mongoose.Types.ObjectId(to), createAt },
      { isSend: status },
      { new: true }
    )
    // console.log('updateOtherMsgSendImg', updateReadMsgImg)

    if (updateReadMsgImg)
      return res.send({ updateReadMsgImg, msg: '成功更改已讀頭像', retCode: 0 })
    return res.send({ updateReadMsgImg, msg: '更改已讀頭像失敗', retCode: -1 })
  } catch (e) {
    console.log(e)
  }
})

// 更新對方訊息headshot
router.post('/updateHeadShot', async (req, res) => {
  const { from, to, createAt, status } = req.body
  try {
    const allMessages = await Messages.findOneAndUpdate(
      { from: mongoose.Types.ObjectId(from), to: mongoose.Types.ObjectId(to), createAt },
      { isHeadShot: status },
      { new: true }
    )

    if (allMessages) {
      return res.send({ msg: '成功隱藏發送訊息勾勾', retCode: 0 })
    }

    return res.send({ msg: '隱藏發送訊息勾勾失敗', retCode: -1 })
  } catch (e) {
    console.log(e)
  }
})

// 隱藏發送訊息勾勾
router.post('/hideMsgCheck', async (req, res) => {
  const { from, to } = req.body
  try {
    const allMessages = await Messages.find(
      { from: mongoose.Types.ObjectId(from) },
      { to: mongoose.Types.ObjectId(to) }
    )

    if (allMessages) {
      allMessages.forEach(msg => {
        msg.isHide = true
        msg.save()
      })
      return res.send({ msg: '成功隱藏發送訊息勾勾', retCode: 0 })
    }

    return res.send({ msg: '隱藏發送訊息勾勾失敗', retCode: -1 })
  } catch (e) {
    console.log(e)
  }
})

// 獲取未讀訊息小紅點
router.post('/getUnreadMsgCount', async (req, res) => {
  const { from, to } = req.body

  if (from && to) {
    try {
      // const allMessages = await Messages.find()
      //   .or([
      //     { $and: [{ from: from }, { to: to }, { unread: '0' }] },
      //     { $and: [{ from: to }, { to: from }, { unread: '0' }] }
      //   ])
      //   .populate('from to')
      //   .sort([['createAt', 1]])

      const allMessages = await Messages.find({
        from: mongoose.Types.ObjectId(from),
        to: mongoose.Types.ObjectId(to),
        unread: '0'
      })
        .populate('from to')
        .sort([['createAt', 1]])

      // console.log(allMessages)

      if (allMessages.length !== 0) {
        const unreadAdminMessageCount = allMessages.length

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
