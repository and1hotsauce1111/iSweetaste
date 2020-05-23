<template>
  <div>
    <div class="header__container">
      <Geo />
      <div class="mobile__header_hamburger" @click="toggleMobileMenu">
        <!-- <fa :icon="['fas', 'bars']" /> -->
        <div
          ref="mobileHamburger"
          class="mobile__header_hamburger_line_container"
        >
          <div class="mobile__header_hamburger_line"></div>
          <div class="mobile__header_hamburger_line"></div>
          <div class="mobile__header_hamburger_line"></div>
        </div>
      </div>
      <div class="header__logo_container">
        <nuxt-link id="header__logo" to="/"></nuxt-link>
      </div>
      <Nav />
    </div>
    <div ref="mobileClipMenu" class="mobile__clip_menu">
      <ul ref="mobileMenuList" class="mobile__clip_menu_container">
        <li class="mobile__clip_menu_list">
          <fa :icon="['fas', 'map-marker-alt']" />&emsp;Taichung
        </li>
        <li
          v-for="(list, index) in menuList"
          :key="index"
          class="mobile__clip_menu_list"
        >
          <nuxt-link :to="list.route">
            {{ list.name }}
          </nuxt-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Geo from '@/components/header/geo'
import Nav from '@/components/header/nav'

export default {
  components: {
    Geo,
    Nav
  },
  data() {
    return {
      menuList: [
        { name: '首頁', route: '/' },
        { name: '甜點', route: '/product' },
        { name: '註冊', route: '/register' },
        { name: '登入', route: '/login' },
        { name: '商家分佈', route: '/shop' }
      ],
      preventBodyScroll: false
    }
  },
  methods: {
    toggleMobileMenu() {
      const mobileClipMenu = this.$refs.mobileClipMenu
      const mobileClipMenuList = this.$refs.mobileMenuList.children
      const mobileHamburger = this.$refs.mobileHamburger.children
      // to array
      const listArray = Array.from(mobileClipMenuList)
      const hamburgerLine = Array.from(mobileHamburger)

      // 避免全頁面菜單顯示時，頁面隨著滾動
      const body = document.querySelector('body')
      this.preventBodyScroll = !this.preventBodyScroll
      if (this.preventBodyScroll) {
        body.scroll = 'no'
        body.style.overflow = 'hidden'
      } else {
        body.scroll = 'auto'
        body.style.overflow = 'auto'
      }

      mobileClipMenu.classList.toggle('open')
      listArray.forEach(list => {
        list.classList.toggle('open')
      })
      hamburgerLine.forEach(line => {
        line.classList.toggle('close')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/public/header/_header.scss';
</style>
