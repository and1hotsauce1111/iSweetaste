import Vue from 'vue'

Vue.prototype.$formatTime = (moment, time) => {
  return moment(time)
    .fromNow()
    .replace(/\s*/g, '')
}

Vue.filter('formatTime', (value, moment, type) => {
  if (type === 'title') {
    return moment(value)
      .fromNow()
      .replace(/\s*/g, '')
  }

  if (type === 'msg') {
    return moment(value)
      .tz('Asia/Taipei')
      .format('lll')
  }
})
