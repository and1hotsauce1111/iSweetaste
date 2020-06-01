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
        <div class="customer-service-chat-room-messages">
          <div class="customer-service-chat-room-messages-wrapper">
            <div class="customer-service-chat-room-messages-other-container">
              <div class="unread">
                <fa :icon="['fas', 'tag']" />&nbsp;
                <span>以下為尚未閱讀的訊息</span>
              </div>
              <div class="customer-service-chat-room-messages-other">
                <p class="meta">
                  user
                  <span>9:35 AM</span>
                </p>
                <p class="text">Hello</p>
              </div>
            </div>
            <div class="customer-service-chat-room-messages-self-container">
              <div class="customer-service-chat-room-messages-self">
                <p class="text">Hellllllo</p>
              </div>
              <div class="customer-service-chat-room-messages-time">9:35 AM</div>
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
  methods: {
    toggleChat() {
      this.$refs.chatContainer.classList.toggle('show')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/chat/_chat.scss';
</style>