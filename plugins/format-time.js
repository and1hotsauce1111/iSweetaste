import Vue from 'vue'

Vue.prototype.$formatTime = (moment, time) => {
  return moment(time)
    .fromNow()
    .replace(/\s*/g, '')
}

Vue.filter('formatTime', (value, moment, type) => {
  const parseIntValue = parseInt(value)
  const diffYear = moment().diff(parseIntValue, 'years')
  const diffDay = moment(parseIntValue).diff(parseIntValue, 'days')

  const calendarTime = moment(parseIntValue).calendar({
    sameDay: '[今天]',
    lastDay: '[昨天]',
    sameElse: 'lll'
  })

  if (type === 'calendar') {
    return calendarTime
  }

  if (type === 'title') {
    // 訊息時間距離現在大於等於一年
    if (diffYear >= 1) {
      return moment(parseIntValue).format('L')
    }
    // 訊息時間距離現在大於一週
    if (diffDay > 7) {
      return moment(parseIntValue).format('MMMDo')
    }
    // 訊息時間距離現在一周內
    if (diffDay > 0 && diffDay < 7) {
      return moment(parseIntValue).format('ddd')
    }

    return moment(parseIntValue)
      .fromNow()
      .replace(/\s*/g, '')
  }

  if (type === 'msg') {
    // 昨天
    if (calendarTime === '昨天') {
      return moment(parseIntValue)
        .tz('Asia/Taipei')
        .format('lll')
    }
    // 今天
    if (calendarTime === '今天') {
      const a = moment(parseIntValue).format('a')

      const formatA =
        a === '中午'
          ? '下午'
          : a === '晚上'
          ? '下午'
          : a === '凌晨' || a === '早上'
          ? '上午'
          : a

      const formatTime = formatA + moment(parseIntValue).format('hh:mm')

      return formatTime
    }
  }
})
