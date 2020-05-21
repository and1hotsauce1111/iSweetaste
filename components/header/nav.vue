<template>
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
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.header__menu {
  flex: 0 0 54.5%;
  line-height: 100px;

  li {
    float: left;
    margin: 0 25px;
  }
}
</style>
