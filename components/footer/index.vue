<template>
  <div class="footer__container">
    <div class="footer__register">
      <div class="register__container">
        <div class="register__content">
          <div class="register__content_title">
            <img
              src="~assets/img/logo/desktop/logo-light.svg"
              alt=""
              width="40"
              height="40"
            />
            <h3>訂閱你我的甜蜜郵件</h3>
          </div>
          <form action="" class="register__content__form">
            <fa :icon="['fas', 'envelope']" class="register__content_envlope" />
            <input type="email" class="register__content__form_input" />
            <button class="register__content__form_submit">
              <fa :icon="['fas', 'arrow-right']" class="arrow" />
            </button>
          </form>
        </div>
      </div>
    </div>
    <div class="footer__contact">
      <div class="footer__contact_container">
        <div class="footer__contact_address">
          <div class="footer__contact_address_logo">
            <img
              src="~assets/img/logo/desktop/logotype-lg-dark.svg"
              alt=""
              width="170"
              heigth="26"
            />
            <ul class="address">
              <li>
                <a href="tel:+0712345678">
                  07-12345678
                </a>
              </li>
              <li>
                <a href="mailto:sweetaste@email.com">
                  sweetaste@email.com
                </a>
              </li>
              <li>
                <a href="#">
                  800 高雄市新興區幸福路 520 號
                </a>
              </li>
            </ul>
          </div>
          <div class="footer__contact_address_slogan">
            <img
              src="~assets/img/quote/desktop/sm-今天是個吃甜點的好日子.svg"
              alt=""
            />
          </div>
        </div>
        <div class="footer__contact_socialMedia">
          <div class="footer__contact_socialMedia_icon">
            <ul class="list">
              <li>
                <a href="#">
                  <img
                    src="~assets/img/icons/ic-line@.svg"
                    alt=""
                    width="32"
                    height="32"
                  />
                </a>
              </li>
              <li>
                <a href="#">
                  <img
                    src="~assets/img/icons/ic-facebook.svg"
                    alt=""
                    width="32"
                    height="32"
                  />
                </a>
              </li>
            </ul>
          </div>
          <div class="footer__contact_socialMedia_copyRight">
            <h3>© 2018 Sweetaste* All Rights Reserved</h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/footer/_footer.scss';
</style>
