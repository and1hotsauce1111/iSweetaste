<template>
  <div class="header__menu_container">
    <ul class="header__menu">
      <li>
        <nuxt-link to="/">
          首頁
        </nuxt-link>
      </li>
      <li>
        <nuxt-link to="/">
          甜點
        </nuxt-link>
      </li>
      <li>
        <nuxt-link to="/">
          註冊
        </nuxt-link>
      </li>
      <li>
        <nuxt-link to="/">
          登入
        </nuxt-link>
      </li>
      <li>
        <nuxt-link to="/">
          商家分佈
        </nuxt-link>
      </li>
      <li>
        <fa :icon="['fas', 'shopping-cart']" />
      </li>
    </ul>
    <div class="mobile__cart">
      <fa :icon="['fas', 'shopping-cart']" />
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.header__menu_container {
  width: 100%;
  height: 100%;

  .header__menu {
    flex: 0 0 59.8%;
    line-height: 100px;
    display: flex;
    justify-content: space-around;
  }

  .mobile__cart {
    width: 80px;
    height: 100%;
    display: none;
  }
}

// 平板轉橫
@media screen and (max-width: 1023px) {
  .header__menu {
    flex: 0 0 55%;
  }
}
// pad
@media screen and (max-width: 768px) {
  .header__menu_container {
    flex: 0 0 10%;

    .header__menu {
      display: none !important;
    }
    .mobile__cart {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }
}
// mobile
@media screen and (max-width: 376px) {
}
</style>
