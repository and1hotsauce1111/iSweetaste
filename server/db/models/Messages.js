const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Messages = new Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: {
    type: String,
    required: true
  },
  status: String,
  createAt: { type: Number },
  formatTime: { type: String }
})

module.exports = mongoose.model('Messages', Messages)
