const moment = require('moment-timezone')
moment.locale('zh-tw')
export default ({ app }, inject) => {
  // Inject into context, Due instances, and Vuex store
  inject('moment', moment)
}
