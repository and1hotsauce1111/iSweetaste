<template>
  <div class="register__section">
    <div class="register__section_wrap">
      <div class="register__section_memberRegister">
        <form class="register__section_memberRegister_form">
          <div class="register__section_memberRegister_form_container">
            <h1 class="register__section_memberRegister_title">會員註冊</h1>
            <div ref="registerMsg" class="register__section_errorMsg">{{ registerMsg }}</div>
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
            <div class="register__section_memberRegister_input">
              <div class="register__section_memberRegister_input_name">
                <div class="register__section_memberRegister_input_container">
                  <fa :icon="['fas', 'user']" />
                  <input
                    v-model="registerInfo.name"
                    type="text"
                    placeholder="請輸入暱稱"
                    @blur="validateName"
                  />
                </div>
                <div
                  ref="errorName"
                  class="register__section_memberRegister_input_error"
                >{{ errorMsg.name }}</div>
              </div>
              <div class="register__section_memberRegister_input_email">
                <div class="register__section_memberRegister_input_container">
                  <fa :icon="['fas', 'envelope']" />
                  <input
                    v-model="registerInfo.email"
                    type="email"
                    placeholder="請輸入註冊信箱"
                    @blur="validateEmail"
                  />
                </div>
                <div
                  ref="errorEmail"
                  class="register__section_memberRegister_input_error"
                >{{ errorMsg.email }}</div>
              </div>
              <div class="register__section_memberRegister_input_btn">
                <button @click.prevent="verifyCode">發送驗證碼</button>
                <p ref="verifyCodeMsg">{{ countDownMsg }}</p>
              </div>
              <div class="register__section_memberRegister_input_verifyCode">
                <div class="register__section_memberRegister_input_container">
                  <input
                    v-model="registerInfo.verifyCode"
                    type="text"
                    placeholder="請輸入驗證碼"
                    style="padding:0 20px"
                    @blur="validateVerifyCode"
                  />
                  <div
                    ref="errorVerifyCode"
                    class="register__section_memberRegister_input_error"
                  >{{ errorMsg.verifyCode }}</div>
                </div>
              </div>
              <div class="register__section_memberRegister_input_password">
                <div class="register__section_memberRegister_input_container">
                  <fa :icon="['fas', 'key']" />
                  <input
                    v-model="registerInfo.pwd"
                    type="password"
                    placeholder="請輸入密碼"
                    @blur="validtePwd"
                  />
                </div>
                <div
                  ref="errorPwd"
                  class="register__section_memberRegister_input_error"
                >{{ errorMsg.pwd }}</div>
              </div>
              <div class="register__section_memberRegister_input_confirmPwd">
                <div class="register__section_memberRegister_input_container">
                  <input
                    v-model="registerInfo.confirmPwd"
                    type="password"
                    placeholder="確認密碼"
                    style="padding:0 20px"
                    @blur="validteConfirmPwd"
                    @keyup.enter="register"
                  />
                  <div
                    ref="errorConfirmPwd"
                    class="register__section_memberRegister_input_error"
                  >{{ errorMsg.confirmPwd }}</div>
                </div>
              </div>
            </div>
          </div>

          <input
            type="button"
            value="註冊帳號"
            href="#"
            class="register__section_memberRegister_form_submit"
            @click.prevent="register"
          />
        </form>
      </div>
      <div class="register__section_socialMedia">
        <h2 class="register__section_socialMedia_title">⸺連結社群帳號⸺</h2>
        <ul class="register__section_socialMedia_list">
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
      // 錯誤訊息
      errorMsg: {
        name: '',
        email: '',
        verifyCode: '',
        pwd: '',
        confirmPwd: ''
      },
      // input data
      registerInfo: {
        name: '',
        email: '',
        verifyCode: '',
        pwd: '',
        confirmPwd: ''
      },
      // validation output
      validation: {
        name: false,
        email: false,
        verifyCode: false,
        pwd: false
      },
      countDownMsg: '',
      registerMsg: '',
      verifyCodeTimer: null, // 獲得驗證碼計時器
      clearErrorTimer: null, // 定時清除錯誤訊息
      changeRouterTimer: null // 跳轉頁面計時器
    }
  },
  beforeDestroy() {
    // 清空所有計時器
    clearInterval(this.verifyCodeTimer)
    clearTimeout(this.changeRouterTimer)
    clearTimeout(this.clearErrorTimer)
  },
  methods: {
    validateName() {
      if (this.registerInfo.name.trim() === '') {
        this.errorMsg.name = '請輸入暱稱!'
        this.$refs.errorName.classList.add('show')
        return false
      }
      this.validation.name = true
      this.$refs.errorName.classList.remove('show')
    },
    validateEmail() {
      if (this.registerInfo.email.trim() === '') {
        this.errorMsg.email = '請輸入信箱!'
        this.$refs.errorEmail.classList.add('show')
        return false
      } else {
        const emailRule = /^\w+((-\w+)|(\.\w+))*@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/
        if (this.registerInfo.email.search(emailRule) === -1) {
          this.errorMsg.email = '信箱格式錯誤!'
          this.$refs.errorEmail.classList.add('show')
          return false
        }
      }
      this.validation.email = true
      this.$refs.errorEmail.classList.remove('show')
    },
    validateVerifyCode() {
      if (this.registerInfo.verifyCode.trim() === '') {
        this.errorMsg.verifyCode = '請輸入驗證碼!'
        this.$refs.errorVerifyCode.classList.add('show')
        return false
      }
      this.validation.verifyCode = true
      this.$refs.errorVerifyCode.classList.remove('show')
    },
    validtePwd() {
      if (this.registerInfo.pwd.trim() === '') {
        this.errorMsg.pwd = '請輸入密碼!'
        this.$refs.errorPwd.classList.add('show')
        return false
      }
      this.validation.pwd = true
      this.$refs.errorPwd.classList.remove('show')
    },
    validteConfirmPwd() {
      if (this.registerInfo.confirmPwd.trim() === '') {
        this.errorMsg.confirmPwd = '請再次輸入密碼!'
        this.$refs.errorConfirmPwd.classList.add('show')
        return false
      } else if (this.registerInfo.pwd !== this.registerInfo.confirmPwd) {
        this.errorMsg.confirmPwd = '兩次輸入密碼不一致!'
        this.$refs.errorConfirmPwd.classList.add('show')
        return false
      }
      this.validation.confirmPwd = true
      this.$refs.errorConfirmPwd.classList.remove('show')
    },
    async verifyCode() {
      // 已經發送過驗證碼
      if (this.verifyCodeTimer) return false

      if (this.validation.name && this.validation.email) {
        const self = this
        const {
          status,
          data: { msg, code }
        } = await self.$axios.post('/users/verify', {
          username: encodeURIComponent(self.registerInfo.name),
          email: self.registerInfo.email
        })

        // 成功發送驗證碼 開始倒數五分鐘
        if (status === 200 && code === 0) {
          let count = 300
          // self.countDownMsg = `驗證碼已發送，剩餘${count--}秒`

          // 驗證碼計時器
          self.verifyCodeTimer = setInterval(() => {
            self.countDownMsg = `驗證碼已發送，剩餘${count--}秒`
            self.$refs.verifyCodeMsg.classList.add('show')
            if (count === 0) {
              clearInterval(self.verifyCodeTimer)
              self.countDownMsg = ''
              self.$refs.verifyCodeMsg.classList.remove('show')
              self.verifyCodeTimer = null
            }
          }, 1000)
        } else {
          if (self.verifyCodeTimer) {
            clearInterval(self.verifyCodeTimer)
            self.verifyCodeTimer = null
            self.countDownMsg = ''
            self.$refs.verifyCodeMsg.classList.remove('show')
          }
          self.countDownMsg = msg
          self.$refs.verifyCodeMsg.classList.add('show')
          self.clearErrorTimer = setTimeout(() => {
            self.countDownMsg = ''
            self.$refs.verifyCodeMsg.classList.remove('show')
          }, 5000)
        }
      }
    },
    register() {
      const self = this
      if (
        this.validation.name &&
        this.validation.email &&
        this.validation.verifyCode &&
        this.validation.pwd &&
        this.validation.confirmPwd
      ) {
        self.$axios
          .post('/users/register', {
            username: window.encodeURIComponent(self.registerInfo.name),
            password: self.registerInfo.pwd,
            email: self.registerInfo.email,
            code: self.registerInfo.verifyCode
          })
          .then(({ status, data: { msg, retCode } }) => {
            if (status === 200 && retCode === 0) {
              self.registerMsg = msg
              self.$refs.registerMsg.classList.add('show')
              self.routerChange()
              return false
            }

            self.registerMsg = msg
            self.$refs.registerMsg.classList.add('show')

            // 清空錯誤訊息
            self.clearErrorMsg()
          })
      }
      return false
    },
    clearErrorMsg() {
      const self = this
      this.clearErrorTimer = setTimeout(() => {
        self.registerMsg = ''
        self.$refs.registerMsg.classList.remove('show')
        // 清空所有欄位
        self.registerInfo.name = ''
        self.registerInfo.email = ''
        self.registerInfo.verifyCode = ''
        self.registerInfo.pwd = ''
        self.registerInfo.confirmPwd = ''
      }, 3000)
    },
    routerChange() {
      this.changeRouterTimer = setTimeout(() => {
        this.$refs.registerMsg.classList.remove('show')
        // 清空所有計時器
        clearInterval(this.verifyCodeTimer)
        clearTimeout(this.changePageTime)
        clearTimeout(this.clearErrorTimer)
        location.href = '/login'
      }, 1500)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/public/_checkbox.scss';
@import '@/assets/scss/public/member/_member.scss';
</style>
