<template>
  <div class="header__menu_container">
    <ul v-if="!loginUser" class="header__menu">
      <li v-for="(list, index) in menuList" :key="index" class="header__menu_list">
        <nuxt-link :to="list.route">{{ list.name }}</nuxt-link>
      </li>
      <li class="header__menu_list">
        <nuxt-link to="/cart">
          <fa :icon="['fas', 'shopping-cart']" />
        </nuxt-link>
      </li>
    </ul>
    <ul v-else class="header__menu__Login">
      <li v-for="(list, index) in loginMenuList" :key="index" class="header__menu_list">
        <nuxt-link :to="list.route">{{ list.name }}</nuxt-link>
      </li>
      <li class="header__menu__Login_userInfo">
        <div class="header__menu__Login_userInfo_container" @click.stop="showPanel">
          <img
            class="header__menu__Login_userInfo_img"
            :src="changeAvatar !== '' ? changeAvatar : avatarUrl"
            alt
          />
          <div class="header__menu__Login_userInfo_username">{{ loginUser }}</div>
        </div>
      </li>
      <li class="header__menu__Login_list">
        <nuxt-link to="/cart">
          <fa :icon="['fas', 'shopping-cart']" />
        </nuxt-link>
      </li>
    </ul>
    <div class="mobile__cart">
      <nuxt-link to="/cart">
        <fa :icon="['fas', 'shopping-cart']" />
      </nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    avatarUrl: {
      type: String,
      default: `${require('@/assets/img/avatar/user.png')}`
    },
    changeAvatar: {
      type: String,
      default: `${require('@/assets/img/avatar/user.png')}`
    }
  },
  data() {
    return {
      menuList: [
        { name: '首頁', route: '/' },
        { name: '甜點', route: '/product' },
        { name: '註冊', route: '/register' },
        { name: '商家分佈', route: '/shop' },
        { name: '登入', route: '/login' }
      ],
      loginMenuList: [
        { name: '首頁', route: '/' },
        { name: '甜點', route: '/product' },
        { name: '註冊', route: '/register' },
        { name: '商家分佈', route: '/shop' }
      ],
      newAvatar: ''
    }
  },
  computed: {
    loginUser() {
      return decodeURIComponent(this.$store.state.user.user.name)
    },
    userId() {
      return this.$store.state.user.user.id
    }
  },
  methods: {
    showPanel() {
      this.$emit('showPanel')
    }
  }
}
</script>

<style lang="scss" scoped>
.header__menu_container {
  width: 100%;
  height: 100%;
  position: relative;

  .header__menu,
  .header__menu__Login {
    flex: 0 0 59.8%;
    height: 100px;
    line-height: 100px;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }

  .header__menu__Login {
    .header__menu__Login_userInfo {
      display: flex;
      align-items: center;
      justify-content: space-between;

      .header__menu__Login_userInfo_container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        line-height: 40px;
        padding: 0 1rem;
        border-bottom-right-radius: 18px;
        border-bottom-left-radius: 18px;
        border-top-right-radius: 18px;
        border-top-left-radius: 18px;
        cursor: pointer;

        &:hover {
          background: #eee;
        }

        .header__menu__Login_userInfo_img {
          display: inline-block;
          border: 0;
          width: 1.87rem;
          height: 1.87rem;
          margin-right: 1.2rem;
          border-radius: 50%;
        }

        .header__menu__Login_userInfo_username {
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 6rem;
          height: 100%;
          user-select: none;
        }
      }
    }
  }

  .mobile__cart {
    width: 80px;
    height: 100%;
    display: none;
  }
}

// 平板轉橫
@media screen and (max-width: 1023px) {
  .header__container {
    .header__menu,
    .header__menu__Login {
      flex: 0 0 55%;
    }
  }
}
// pad
@media screen and (max-width: 767px) {
  .header__container {
    .header__menu_container {
      padding-right: 0.5rem;
      // flex: 0 0 10%;
      // .header__menu,
      .header__menu__Login {
        // height: 80px;
        // line-height: 80px;

        .header__menu_list {
          padding-right: 0.3rem;
        }
      }
      // .mobile__cart {
      //   display: flex;
      //   justify-content: center;
      //   align-items: center;
      //   cursor: pointer;
      // }
    }
  }
}
// mobile
@media screen and (max-width: 414px) {
  .header__container {
    .header__menu_container {
      flex: 0 0 10%;

      .header__menu,
      .header__menu__Login {
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
}
// 手機轉橫
@media screen and (orientation: landscape) and (max-width: 812px) {
  .header__container {
    .header__menu_container {
      flex: 0 0 10%;

      .header__menu,
      .header__menu__Login {
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
}
</style>
