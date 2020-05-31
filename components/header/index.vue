<template>
  <div class="header__section">
    <div class="header__container">
      <Geo />
      <div class="mobile__header_hamburger" @click="toggleMobileMenu">
        <!-- <fa :icon="['fas', 'bars']" /> -->
        <div ref="mobileHamburger" class="mobile__header_hamburger_line_container">
          <div class="mobile__header_hamburger_line"></div>
          <div class="mobile__header_hamburger_line"></div>
          <div class="mobile__header_hamburger_line"></div>
        </div>
      </div>
      <div class="header__logo_container">
        <nuxt-link id="header__logo" to="/"></nuxt-link>
      </div>
      <Nav @showPanel="toggleUserPanel" />
    </div>

    <!-- user panel -->
    <div v-if="showUserPanel" class="header__menu__Login_userInfo_panel_wrap">
      <div class="header__menu__Login_userInfo_panel">
        <div class="header__menu__Login_userInfo_panel_container">
          <div class="header__menu__Login_userInfo_panel_item" @click="logout">
            <div class="header__menu__Login_userInfo_panel_item_icon">
              <fa :icon="['fas', 'sign-out-alt']" />
            </div>
            <span>登出</span>
          </div>
        </div>
      </div>
    </div>

    <div ref="mobileClipMenu" class="mobile__clip_menu">
      <div class="mobile__clip_menu_userSection">
        <div v-if="loginUser" class="mobile__clip_menu_userInfo">
          <img class="mobile__clip_menu_userInfo_img" src="~assets/img/icons/user.png" alt />
          <div class="mobile__clip_menu_userInfo_username">{{ loginUser }}</div>
        </div>
        <div class="mobile__clip_menu_location">
          <fa :icon="['fas', 'map-marker-alt']" />
          &emsp;
          {{ currentCity }}
        </div>
      </div>
      <ul v-if="loginUser" ref="mobileMenuList" class="mobile__clip_menu_container">
        <li
          v-for="(list, index) in mobileMenuList"
          :key="index"
          class="mobile__clip_menu_list"
          @click="toggleMobileMenu"
        >
          <fa :icon="['fas', list.icon]" />

          <nuxt-link :to="list.route">{{ list.name }}</nuxt-link>
        </li>
        <li class="mobile__clip_menu_list">
          <fa :icon="['fas', 'sign-out-alt']" />
          <a href="javascript:;" @click="logout">退出</a>
        </li>
      </ul>
      <ul v-else ref="mobileMenuList" class="mobile__clip_menu_container">
        <li
          v-for="(list, index) in mobileMenuList"
          :key="index"
          class="mobile__clip_menu_list"
          @click="toggleMobileMenu"
        >
          <fa :icon="['fas', list.icon]" />
          <nuxt-link :to="list.route">{{ list.name }}</nuxt-link>
        </li>
        <li class="mobile__clip_menu_list">
          <fa :icon="['fas', 'sign-in-alt']" />
          <a href="/login">登入</a>
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
      mobileMenuList: [
        { name: '首頁', route: '/', icon: 'home' },
        { name: '甜點', route: '/product', icon: 'ice-cream' },
        { name: '註冊', route: '/register', icon: 'registered' },
        { name: '商家分佈', route: '/shop', icon: 'store' }
      ],
      preventBodyScroll: false,
      showUserPanel: false
    }
  },
  computed: {
    loginUser() {
      return decodeURIComponent(this.$store.state.user.user.name)
    },
    currentCity() {
      return this.$store.state.geo.position.city
    }
  },
  mounted() {
    const closeUserPanel = () => {
      this.showUserPanel = false
    }
    window.addEventListener('click', closeUserPanel)
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
    },
    toggleUserPanel() {
      this.showUserPanel = !this.showUserPanel
    },
    async login() {},
    async logout() {
      const {
        status,
        data: { msg, retCode }
      } = await this.$axios.get('/users/logout')

      if (status === 200 && retCode === 0) {
        alert(msg)
        location.href = '/'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/public/header/_header.scss';
</style>
