<template>
  <div v-if="loginUser !== 'admin'">
    <div class="customer-service" @click="toggleChat">
      <span class="customer-service-message-count">1</span>
    </div>
    <div class="customer-sevice-container">
      <div ref="chatContainer" class="customer-service-chat-room">
        <div class="customer-service-chat-room-header">
          <div class="customer-service-chat-room-header-title">
            <img src="~assets/img/logo/desktop/logo-light.svg" alt width="26" height="26" />&nbsp; Sweetaste
          </div>
          <div class="customer-service-chat-room-header-close" @click="toggleChat">
            <svg height="26px" width="26px" viewBox="-4 -4 24 24">
              <line
                stroke="#ffe180"
                stroke-linecap="round"
                stroke-width="2"
                x1="2"
                x2="14"
                y1="2"
                y2="14"
              />
              <line
                stroke="#ffe180"
                stroke-linecap="round"
                stroke-width="2"
                x1="2"
                x2="14"
                y1="14"
                y2="2"
              />
            </svg>
          </div>
        </div>
        <div ref="msgContent" class="customer-service-chat-room-messages">
          <div class="customer-service-chat-room-messages-wrapper">
            <div class="customer-service-chat-room-messages-other-container">
              <div class="unread">
                <fa :icon="['fas', 'tag']" />&nbsp;
                <span>以下為尚未閱讀的訊息</span>
              </div>
              <div class="customer-service-chat-room-messages-other">
                <div class="customer-service-chat-room-messages-other_userImg">
                  <img src="~assets/img/icons/user.png" alt />
                </div>
                <el-tooltip
                  class="customer-service-chat-room-messages-other_msg"
                  effect="dark"
                  content="9:35 AM"
                  placement="left-start"
                >
                  <p class="text">Hello</p>
                </el-tooltip>
                <div class="customer-service-chat-room-messages-other_userReadImg">
                  <img src="~assets/img/icons/user.png" alt />
                </div>
              </div>
            </div>
            <div class="customer-service-chat-room-messages-self-container">
              <div class="customer-service-chat-room-messages-self">
                <el-tooltip effect="dark" content="9:35 AM" placement="right-start">
                  <p class="text">Hellllllo</p>
                </el-tooltip>
              </div>
            </div>
          </div>
        </div>
        <div class="customer-service-chat-room-form">
          <form id="chat-form">
            <input id="msg" type="text" placeholder="請輸入訊息..." required autocomplete="off" />
            <!-- <button class="btn">
              <fa :icon="['fas', 'paper-plane']" />&nbsp;送出
            </button>-->
          </form>
        </div>
        <div class="customer-service-chat-room-triangle"></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    loginUser() {
      return decodeURIComponent(this.$store.state.user.user.name)
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeHandler)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
    toggleChat() {
      this.$refs.chatContainer.classList.toggle('show')
    },
    resizeHandler() {
      // 調整聊天視窗大小
      // 手機轉橫
      if (window.innerHeight < 415) {
        this.$refs.msgContent.style.height = window.innerHeight / 2 + 'px'
        return false
      }
      // 平板
      if (window.innerWidth > 415) {
        this.$refs.msgContent.style.height = '354px'
        return false
      }
      // 手機
      this.$refs.msgContent.style.height = '80%'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/chat/_chat.scss';
</style>