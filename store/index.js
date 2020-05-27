export const state = () => ({})

export const mutations = {}

export const actions = {
  async nuxtServerInit({ commit }, { req, app }) {
    // 取得登入使用者訊息
    const {
      status: loginStatus,
      data: { id, loginUser, email, retCode }
    } = await app.$axios.get('/users/getuser')
    commit(
      'user/getUser',
      loginStatus === 200 && retCode === 0
        ? { id, name: loginUser, email }
        : { id: '', name: '', email: '' }
    )

    // 取得使用者所在城市
    const {
      status: geoStatus,
      data: { data, geoRetCode }
    } = await app.$axios.get('/geo/getPosition')
    commit('geo/setPosition', geoStatus === 200 && geoRetCode === 0 ? data : {})
  }
}
