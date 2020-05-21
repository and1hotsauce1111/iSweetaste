<template>
  <div class="header__container">
    <Geo />
    <nuxt-link id="header__logo" to="/"></nuxt-link>
    <Nav />
  </div>
</template>

<script>
import Geo from '@/components/header/geo'
import Nav from '@/components/header/nav'

export default {
  components: {
    Geo,
    Nav
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/header/_header.scss';
</style>
