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
        <div class="header__menu__Login_userInfo_container" @click="showPanel">
          <img
            class="header__menu__Login_userInfo_img"
            src="~assets/img/icons/user.png"
            alt=""
          />
          <div class="header__menu__Login_userInfo_username">
            {{ loginUser }}
          </div>
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
      ]
    }
  },
  computed: {
    loginUser() {
      return decodeURIComponent(this.$store.state.user.user.name)
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
    line-height: 100px;
    display: flex;
    justify-content: space-around;
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
        max-height: 40%;
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
        }

        .header__menu__Login_userInfo_username {
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          max-width: 7.5rem;
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
  .header__menu,
  .header__menu__Login {
    flex: 0 0 55%;
  }
}
// pad
@media screen and (max-width: 768px) {
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
// mobile
@media screen and (max-width: 376px) {
}
</style>
