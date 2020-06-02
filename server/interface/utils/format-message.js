const moment = require('moment-timezone')
moment.locale('zh-tw')

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment()
      .tz('Asia/Taipei')
      .format('lll'),
    status: '0',
    timestamp: moment()
      .tz('Asia/Taipei')
      .format('x'),
    showTag: false
  }
}

module.exports = formatMessage
