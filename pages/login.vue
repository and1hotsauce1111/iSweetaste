<template>
  <div class="login__section">
    <div class="login__section_wrap">
      <div class="login__section_memberLogin">
        <form class="login__section_memberLogin_form">
          <div class="login__section_memberLogin_form_container">
            <h1 class="login__section_memberLogin_title">會員登入</h1>
            <div ref="loginMsg" class="login__section_errorMsg">{{ loginMsg }}</div>
            <div class="mobile__socialMedia">
              <ul class="mobile__socialMedia_list">
                <li>
                  <a href="#">
                    <img src="~assets/img/icons/ic-facebook-logotype.svg" alt />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src="~assets/img/icons/ic-google.svg" alt />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src="~assets/img/icons/ic-yahoo.svg" alt />
                  </a>
                </li>
              </ul>
            </div>
            <div class="login__section_memberLogin_input">
              <div class="login__section_memberLogin_input_account">
                <div class="login__section_memberLogin_input_container">
                  <fa :icon="['fas', 'user']" />
                  <input
                    v-model="loginInfo.email"
                    type="email"
                    placeholder="請輸入電子信箱"
                    @blur="validateEmail"
                  />
                </div>
                <div
                  ref="errorEmail"
                  class="login__section_memberLogin_input_error"
                >{{ errorMsg.email }}</div>
              </div>
              <div class="login__section_memberLogin_input_password">
                <div class="login__section_memberLogin_input_container">
                  <fa :icon="['fas', 'key']" />
                  <input
                    ref="enterPwd"
                    v-model="loginInfo.pwd"
                    type="password"
                    placeholder="請輸入使用者密碼"
                    @blur="validatePwd"
                    @keyup.enter="login"
                  />
                </div>
                <div
                  ref="errorPwd"
                  class="login__section_memberLogin_input_error"
                >{{ errorMsg.pwd }}</div>
              </div>
            </div>
            <div class="login__section_memberLogin_remember">
              <label class="checkbox__container">
                記住我
                <input v-model="rememberMe" type="checkbox" />
                <span class="checkbox__custom"></span>
              </label>
            </div>
          </div>

          <a
            href="javascript:;"
            class="login__section_memberLogin_form_submit"
            @click.prevent="login"
          >登入帳號</a>
        </form>
      </div>
      <div class="login__section_socialMedia">
        <h2 class="login__section_socialMedia_title">⸺連結社群帳號⸺</h2>
        <ul class="login__section_socialMedia_list">
          <li>
            <a href="#">
              <img src="~assets/img/icons/ic-facebook-logotype.svg" alt width="108" height="20" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src="~assets/img/icons/ic-google.svg" alt width="108" height="20" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src="~assets/img/icons/ic-yahoo.svg" alt width="108" height="20" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginMsg: '',
      clearMsgTimer: null,
      changeRouterTimer: null,
      loginInfo: {
        email: '',
        pwd: ''
      },
      validation: {
        email: false,
        pwd: false
      },
      errorMsg: {
        email: '',
        pwd: ''
      },
      rememberMe: false
    }
  },
  beforeDestroy() {
    clearTimeout(this.clearMsgTimer)
    clearTimeout(this.changeRouterTimer)
    this.clearMsgTimer = null
    this.changeRouterTimer = null
  },
  methods: {
    validateEmail() {
      if (this.loginInfo.email.trim() === '') {
        this.$refs.errorEmail.innerHTML =
          '<span style="color:#e84a5f">請輸入註冊信箱!</span>'
        this.$refs.errorEmail.classList.add('show')
        return false
      } else {
        const emailRule = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
        if (this.loginInfo.email.search(emailRule) === -1) {
          this.$refs.errorEmail.innerHTML =
            '<span style="color:#e84a5f">信箱格式錯誤!</span>'
          this.$refs.errorEmail.classList.add('show')
          return false
        }
      }
      this.validation.email = true
      this.$refs.errorEmail.classList.remove('show')
    },
    validatePwd() {
      if (this.loginInfo.pwd.trim() === '') {
        this.$refs.errorPwd.innerHTML = '<span style="color:#e84a5f">請輸入密碼!</span>'
        this.$refs.errorPwd.classList.add('show')
        return false
      }
      this.validation.pwd = true
      this.$refs.errorPwd.classList.remove('show')
    },
    async login() {
      if (this.loginInfo.email && this.loginInfo.pwd) {
        const self = this
        const {
          status,
          data: { msg, retCode }
        } = await self.$axios.post('/users/login', {
          email: self.loginInfo.email,
          password: self.loginInfo.pwd,
          rememberMe: self.rememberMe
        })

        if (status === 200 && retCode === 0) {
          // 成功登入
          self.loginMsg = msg
          self.$refs.loginMsg.classList.add('show')
          window.scrollTo(0, 0)
          self.routerChange()
          return false
        }

        self.loginMsg = msg
        self.$refs.loginMsg.classList.add('show')
        self.clearMsg()
      }
      return false
    },
    clearMsg() {
      const self = this
      self.clearMsgTimer = setTimeout(() => {
        self.loginMsg = ''
        self.$refs.loginMsg.classList.remove('show')
      }, 3000)
    },
    routerChange() {
      const self = this
      this.changeRouterTimer = setTimeout(() => {
        self.loginMsg = ''
        self.$refs.loginMsg.classList.remove('show')
        // 清空計時器
        clearTimeout(self.clearMsgTimer)
        clearTimeout(self.changeRouterTimer)
        this.clearMsgTimer = null
        // 清空input
        this.loginInfo.email = ''
        this.loginInfo.pwd = ''
        this.errorMsg.email = ''
        this.errorMsg.pwd = ''
        this.loginMsg = ''
        location.replace('/')
      }, 1500)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/public/_checkbox.scss';
@import '@/assets/scss/public/member/_member.scss';
</style>
