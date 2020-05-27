export const state = () => ({
  position: {}
})

export const mutations = {
  setPosition(state, location) {
    state.position = location
  }
}

export const actions = {
  setPosition({ commit }, location) {
    commit('setPosition', location)
  }
}
