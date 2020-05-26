module.exports = {
  // email驗證setting
  smtp: {
    get host() {
      return 'smtp.gmail.com'
    },
    get user() {
      return 'ab19880531@gmail.com'
    },
    get pass() {
      return 'luingifvswtyydde'
    },
    // 註冊/登入驗證碼 隨機生成驗證碼
    get code() {
      return () => {
        return Math.random()
          .toString(16)
          .slice(2, 6)
          .toUpperCase()
      }
    },
    get expire() {
      return () => {
        // 驗證碼有效時間五分鐘
        return new Date().getTime() + 60 * 1000 * 5
      }
    }
  }
}
