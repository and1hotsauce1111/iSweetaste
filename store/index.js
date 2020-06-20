export const state = () => ({})

export const mutations = {}

export const actions = {
  async nuxtServerInit({ commit }, { req, app }) {
    // 取得登入使用者訊息
    const {
      status: loginStatus,
      data: { id, loginUser, email, haveAvatar, retCode }
    } = await app.$axios.get('/users/getUser')
    commit(
      'user/getUser',
      loginStatus === 200 && retCode === 0
        ? { id, name: loginUser, email, haveAvatar }
        : { id: '', name: '', email: '', haveAvatar }
    )

    // 取得使用者所在城市
    const {
      status: geoStatus,
      data: { data, geoRetCode }
    } = await app.$axios.get('/geo/getPosition')
    commit('geo/setPosition', geoStatus === 200 && geoRetCode === 0 ? data : {})

    // 取得當前連線聊天室管理者
    const {
      status: adminStatus,
      data: { admin, haveAvatar: adminHaveAvatar }
    } = await app.$axios.get('/users/getAdmin')
    commit(
      'chat/saveAdmin',
      adminStatus === 200
        ? { id: admin._id, name: admin.name, adminHaveAvatar }
        : { id: '', name: '', adminHaveAvatar: '' }
    )

    // 取得管理者未讀訊息數
    const {
      status: adminUnreadMsgStatus,
      data: { unreadMsgCount }
    } = await this.$axios.post('/getUnreadMsgCount', { to: admin._id })

    commit('chat/saveAdminUnreadMsg', adminUnreadMsgStatus === 200 ? unreadMsgCount : 0)
  }
}
