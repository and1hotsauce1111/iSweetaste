import Vue from 'vue'

Vue.prototype.$formatTime = (moment, time) => {
  return moment(time)
    .fromNow()
    .replace(/\s*/g, '')
}

Vue.filter('formatTime', (value, moment, type) => {
  const parseIntValue = parseInt(value)

  if (type === 'title') {
    return moment(parseIntValue)
      .fromNow()
      .replace(/\s*/g, '')
  }

  if (type === 'msg') {
    return moment(parseIntValue)
      .tz('Asia/Taipei')
      .format('lll')
  }
})
