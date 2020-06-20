export const state = () => ({
  user: {},
  avatar: ''
})

export const mutations = {
  getUser(state, user) {
    state.user = user
  },
  changeUserName(state, name) {
    state.user.name = name
  },
  changeAvatar(state, src) {
    state.avatar = src
  }
}

export const actions = {
  setPosition({ commit }, user) {
    commit('getUser', user)
  }
}
