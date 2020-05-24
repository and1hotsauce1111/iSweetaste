<template>
  <div class="register__section">
    <div class="register__section_wrap">
      <div class="register__section_memberRegister">
        <form class="register__section_memberRegister_form">
          <div class="register__section_memberRegister_form_container">
            <h1 class="register__section_memberRegister_title">
              會員註冊
            </h1>
            <div class="mobile__socialMedia">
              <ul class="mobile__socialMedia_list">
                <li>
                  <a href="#">
                    <img src="~assets/img/icons/ic-facebook-logotype.svg" alt="" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src="~assets/img/icons/ic-google.svg" alt="" />
                  </a>
                </li>
                <li>
                  <a href="#">
                    <img src="~assets/img/icons/ic-yahoo.svg" alt="" />
                  </a>
                </li>
              </ul>
            </div>
            <div class="register__section_memberRegister_input">
              <div class="register__section_memberRegister_input_name">
                <fa :icon="['fas', 'user']" />
                <input type="text" placeholder="請輸入暱稱" />
              </div>
              <div class="register__section_memberRegister_input_password">
                <fa :icon="['fas', 'envelope']" />
                <input type="email" placeholder="請輸入註冊信箱" />
              </div>
              <div class="register__section_memberRegister_input_btn">
                <button>發送驗證碼</button>
                <p>驗證碼已發送，剩餘300秒</p>
              </div>
              <div class="register__section_memberRegister_input_verifyCode">
                <input type="email" placeholder="請輸入驗證碼" style="padding:0 20px" />
              </div>
              <div class="register__section_memberRegister_input_password">
                <fa :icon="['fas', 'key']" />
                <input type="password" placeholder="請輸入密碼" />
              </div>
              <div class="register__section_memberRegister_input_confirmPwd">
                <input type="email" placeholder="確認密碼" style="padding:0 20px" />
              </div>
            </div>
          </div>

          <a href="#" class="register__section_memberRegister_form_submit">
            註冊帳號
          </a>
        </form>
      </div>
      <div class="register__section_socialMedia">
        <h2 class="register__section_socialMedia_title">
          ⸺連結社群帳號⸺
        </h2>
        <ul class="register__section_socialMedia_list">
          <li>
            <a href="#">
              <img
                src="~assets/img/icons/ic-facebook-logotype.svg"
                alt=""
                width="108"
                height="20"
              />
            </a>
          </li>
          <li>
            <a href="#">
              <img src="~assets/img/icons/ic-google.svg" alt="" width="108" height="20" />
            </a>
          </li>
          <li>
            <a href="#">
              <img src="~assets/img/icons/ic-yahoo.svg" alt="" width="108" height="20" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/public/_checkbox.scss';
@import '@/assets/scss/public/member/_member.scss';
</style>
