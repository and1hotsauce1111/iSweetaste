import Vue from 'vue'

Vue.prototype.$formatTime = (moment, time) => {
  return moment(time)
    .fromNow()
    .replace(/\s*/g, '')
}
