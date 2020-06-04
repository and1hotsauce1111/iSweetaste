const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Messages = new Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: {
    type: String,
    required: true
  },
  unread: { type: String, required: true },
  createAt: { type: Number, required: true },
  formatTime: { type: String, required: true },
  showUnreadTag: { type: Boolean, required: true }
})

module.exports = mongoose.model('Messages', Messages)
