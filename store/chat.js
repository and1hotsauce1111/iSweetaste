export const state = () => ({
  message: {},
  adminUnreadMsg: 0,
  admin: {}
})

export const mutations = {
  saveMessage(state, msg) {
    state.message = msg
  },
  saveAdmin(state, admin) {
    state.admin = admin
  },
  saveAdminUnreadMsg(state, count) {
    state.adminUnreadMsg = count
  },
  addMsgCount(state) {
    state.adminUnreadMsg++
  },
  substractMsgCount(state, count) {
    state.adminUnreadMsg -= count
    if (state.adminUnreadMsg < 0) state.adminUnreadMsg = 0
  }
}

export const actions = {
  saveMessage({ commit }, msg) {
    commit('saveMessage', msg)
  },
  saveAdmin({ commit }, admin) {
    commit('saveAdmin', admin)
  },
  saveAdminUnreadMsg({ commit }, count) {
    commit('saveAdminUnreadMsg', count)
  }
}
