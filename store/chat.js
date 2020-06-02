export const state = () => ({
  message: {},
  admin: {}
})

export const mutations = {
  saveMessage(state, msg) {
    state.message = msg
  },
  saveAdmin(state, admin) {
    state.admin = admin
  }
}

export const actions = {
  saveMessage({ commit }, msg) {
    commit('saveMessage', msg)
  },
  saveAdmin({ commit }, admin) {
    commit('saveAdmin', admin)
  }
}
