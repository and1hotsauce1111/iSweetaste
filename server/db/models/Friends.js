const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Friends = new Schema({
  selfId: {
    type: String,
    ref: 'User'
  },
  friendId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  meta: {
    updateAt: { type: Date, default: Date.now() },
    createAt: { type: Date, default: Date.now() }
  }
})

module.exports = mongoose.model('Friends', Friends)
