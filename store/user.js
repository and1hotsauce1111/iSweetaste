export const state = () => ({
  user: {}
})

export const mutations = {
  getUser(state, user) {
    state.user = user
  }
}

export const actions = {
  setPosition({ commit }, user) {
    commit('getUser', user)
  }
}
