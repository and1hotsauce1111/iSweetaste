<template>
  <div class="header__menu_container">
    <ul class="header__menu">
      <li
        v-for="(list, index) in menuList"
        :key="index"
        class="header__menu_list"
      >
        <nuxt-link :to="list.route">
          {{ list.name }}
        </nuxt-link>
      </li>
      <li class="header__menu_list">
        <fa :icon="['fas', 'shopping-cart']" />
      </li>
    </ul>
    <div class="mobile__cart">
      <fa :icon="['fas', 'shopping-cart']" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuList: [
        { name: '首頁', route: '/' },
        { name: '甜點', route: '/product' },
        { name: '註冊', route: '/register' },
        { name: '登入', route: '/login' },
        { name: '商家分佈', route: '/shop' }
      ]
    }
  }
}
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
