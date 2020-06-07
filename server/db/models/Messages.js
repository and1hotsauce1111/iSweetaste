const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Messages = new Schema({
  // from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  from: { type: String, ref: 'User', required: true },
  to: { type: String, ref: 'User', required: true },
  message: {
    type: String,
    required: true
  },
  unread: { type: String, required: true },
  createAt: { type: String, required: true },
  formatTime: { type: String, required: true },
  showUnreadTag: { type: Boolean, required: true },
  // 判斷訊息送出的顯示勾勾
  isSend: { type: Boolean, required: true },
  // 判斷別人送出訊息時顯示的小頭像
  isHeadShot: { type: Boolean, required: true },
  meta: {
    updateAt: { type: Date, default: Date.now() },
    createAt: { type: Date, default: Date.now() }
  }
})

module.exports = mongoose.model('Messages', Messages)
