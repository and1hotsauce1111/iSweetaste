export const state = () => ({})

export const mutations = {}

export const actions = {
  async nuxtServerInit({ commit }, { req, app }) {
    // 取得登入使用者訊息
    const {
      status: loginStatus,
      data: { id, user, email, retCode }
    } = await app.$axios.get('/users/getuser')
    commit(
      'user/getUser',
      loginStatus === 200 && retCode === 0
        ? { id, name: user, email }
        : { id: '', name: '', email: '' }
    )
  }
}
