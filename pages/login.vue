<template>
  <div class="login__section">
    <div class="login__section_wrap">
      <div class="login__section_memberLogin">
        <form class="login__section_memberLogin_form">
          <div class="login__section_memberLogin_form_container">
            <h1 class="login__section_memberLogin_title">
              會員登入
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
            <div class="login__section_memberLogin_input">
              <div class="login__section_memberLogin_input_account">
                <fa :icon="['fas', 'user']" />
                <input type="text" placeholder="電子信箱/手機號碼" />
              </div>
              <div class="login__section_memberLogin_input_password">
                <fa :icon="['fas', 'key']" />
                <input type="password" placeholder="請輸入使用者密碼" />
              </div>
            </div>
            <div class="login__section_memberLogin_remember">
              <label class="checkbox__container">
                記住我
                <input type="checkbox" />
                <span class="checkbox__custom"></span>
              </label>
            </div>
          </div>

          <a href="#" class="login__section_memberLogin_form_submit">
            登入帳號
          </a>
        </form>
      </div>
      <div class="login__section_socialMedia">
        <h2 class="login__section_socialMedia_title">
          ⸺連結社群帳號⸺
        </h2>
        <ul class="login__section_socialMedia_list">
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
@import '@/assets/scss/login/_login.scss';
</style>
