<template>
  <div class="header__section">
    <div class="header__container">
      <geo />
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
      <my-nav
        :avatar-url="avatarUrl"
        :change-avatar="changeAvatar"
        @showPanel="toggleUserPanel"
      ></my-nav>
    </div>

    <!-- user panel -->
    <div v-if="showUserPanel" class="header__menu__Login_userInfo_panel_wrap">
      <div v-if="loginUser === 'admin'" class="header__menu__Login_userInfo_panel">
        <div class="header__menu__Login_userInfo_panel_container">
          <a class="header__menu__Login_userInfo_panel_item" href="/admin">
            <div class="header__menu__Login_userInfo_panel_item_icon">
              <fa :icon="['far', 'comment-dots']" />
            </div>
            <span>線上客服</span>&emsp;
            <span v-if="adminUnreadCount && adminUnreadCount <= 99" class="msg_count">{{
              adminUnreadCount
            }}</span>
            <span
              v-if="adminUnreadCount && adminUnreadCount > 99"
              class="msg_count_large"
            >
              {{ adminUnreadCount }}
            </span>
          </a>
        </div>
      </div>
      <div class="header__menu__Login_userInfo_panel">
        <div class="header__menu__Login_userInfo_panel_container">
          <a class="header__menu__Login_userInfo_panel_item" href="/profile">
            <div class="header__menu__Login_userInfo_panel_item_icon">
              <fa :icon="['fas', 'edit']" />
            </div>
            <span>個人檔案</span>&emsp;
          </a>
        </div>
      </div>
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
        <div v-if="loginUser" class="mobile__clip_menu_userInfo" @click="toEditUserPage">
          <img
            class="mobile__clip_menu_userInfo_img"
            :src="changeAvatar !== '' ? changeAvatar : avatarUrl"
            alt
          />
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
        <li v-if="loginUser === 'admin'" class="mobile__clip_menu_list">
          <fa :icon="['fas', 'comment-dots']" />
          <a href="/admin">線上客服</a>
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
import MyNav from '@/components/header/nav'

export default {
  components: {
    Geo,
    MyNav
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
    loginUserId() {
      return this.$store.state.user.user.id
    },
    adminId() {
      return this.$store.state.chat.admin.id
    },
    currentCity() {
      return this.$store.state.geo.position.city
    },
    adminUnreadCount() {
      return this.$store.state.chat.adminUnreadMsg
    },
    avatarUrl() {
      const haveAvatar = this.$store.state.user.user.haveAvatar
      if (haveAvatar) {
        return `/users/${this.loginUserId}/avatar`
      }
      return `${require('@/assets/img/avatar/user.png')}`
    },
    changeAvatar() {
      return this.$store.state.user.avatar
    }
  },
  mounted() {
    const closeUserPanel = () => {
      this.showUserPanel = false
    }
    window.addEventListener('click', closeUserPanel)
  },
  methods: {
    toEditUserPage() {
      this.toggleMobileMenu()
      this.$router.push({
        path: '/profile'
      })
    },
    toggleMobileMenu() {
      const mobileClipMenu = this.$refs.mobileClipMenu
      const mobileClipMenuList = this.$refs.mobileMenuList.children
      const mobileHamburger = this.$refs.mobileHamburger.children
      // to array
      const listArray = Array.from(mobileClipMenuList)
      const hamburgerLine = Array.from(mobileHamburger)

      // 避免全頁面菜單顯示時，頁面隨著滾動
      const body = document.querySelector('body')
      const html = document.querySelector('html')
      this.preventBodyScroll = !this.preventBodyScroll

      if (this.preventBodyScroll) {
        body.style.height = '100%'
        body.style.overflow = 'hidden'
        html.style.height = '100%'
        html.style.overflow = 'hidden'
      } else {
        body.style.overflow = 'auto'
        html.style.overflow = 'auto'
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
