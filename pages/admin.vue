<template>
  <div class="chatRoom__wrap">
    <div class="chatRoom__container">
      <div class="chatRoom__userList_container">
        <div class="chatRoom__userList_header">
          <div class="chatRoom__userList_header_title">聊天室</div>
        </div>
        <div class="chatRoom__userList_search">
          <span class="search_container">
            <fa :icon="['fas', 'search']" />
            <input type="text" placeholder="搜尋使用者" autocomplete="off" />
          </span>
        </div>
        <div class="chatRoom__userList_list">
          <ul>
            <li v-for="(num, index) in 3" :key="index">
              <div class="chatRoom__userList_list_user" @click="openChat">
                <div class="chatRoom__userList_list_user_img">
                  <img src="~assets/img/icons/user.png" alt />
                </div>
                <div class="chatRoom__userList_list_user_message">
                  <div class="chatRoom__userList_list_user_message_name">user{{ num }}</div>
                  <div class="chatRoom__userList_list_user_message_content">
                    <p class="msg">Lorem ipsum dolor sit amet.</p>
                    <span class="time">9:30 PM</span>
                  </div>
                </div>
                <span class="chatRoom__userList_list_user_notify"></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div ref="chatArea" class="chatRoom__userMessage_container">
        <!-- 現在對話的對象標頭 -->
        <div class="chatRoom__userMessage_currentUser">
          <div class="chatRoom__userMessage_currentUser_back" @click="openChat">
            <fa :icon="['fas', 'chevron-left']" />
          </div>
          <div class="chatRoom__userMessage_currentUser_img">
            <img src="~assets/img/icons/user.png" alt />
          </div>
          <div class="chatRoom__userMessage_currentUser_userInfo">
            <h2>User1</h2>
            <span class="chatRoom__userMessage_currentUser_userInfo_lastOnline">50分鐘前上線</span>
          </div>
        </div>

        <!-- 訊息主體 -->
        <div class="chatRoom__userMessage_content">
          <div class="chatRoom__userMessage_content_wrapper">
            <div class="chatRoom__userMessage_content_container other_container">
              <div class="unread">
                <fa :icon="['fas', 'tag']" />&nbsp;
                <span>以下為尚未閱讀的訊息</span>
              </div>
              <div class="chatRoom__userMessage_content_message_wrap">
                <div class="chatRoom__userMessage_content_userImg">
                  <img src="~assets/img/icons/user.png" alt />
                </div>
                <el-tooltip
                  class="chatRoom__userMessage_content_message content_other"
                  effect="dark"
                  content="9:35 AM"
                  placement="left-start"
                >
                  <p class="text">Hello</p>
                </el-tooltip>
                <div class="chatRoom__userMessage_content_userReadImg">
                  <img src="~assets/img/icons/user.png" alt />
                </div>
              </div>
            </div>
            <div
              v-for="(item, index) in 100"
              :key="index"
              class="chatRoom__userMessage_content_container self_container"
            >
              <el-tooltip
                class="chatRoom__userMessage_content_message content_self"
                effect="dark"
                content="9:35 AM"
                placement="right-start"
              >
                <p class="text">Hellllllo</p>
              </el-tooltip>
            </div>
          </div>
        </div>
        <!-- 輸入框 -->
        <div class="chatRoom__input_container">
          <form id="chatRoom__input_form">
            <input id="send_msg" type="text" placeholder="請輸入訊息..." required autocomplete="off" />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    openChat() {
      this.$refs.chatArea.classList.toggle('open')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/admin/_admin.scss';
</style>