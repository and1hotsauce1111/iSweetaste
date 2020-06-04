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
                  <div class="chatRoom__userList_list_user_message_name">
                    user{{ num }}
                  </div>
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
            <span class="chatRoom__userMessage_currentUser_userInfo_lastOnline">
              50分鐘前上線
            </span>
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
              <fa class="unsend_msg" :icon="['far', 'check-circle']" />
            </div>
          </div>
        </div>
        <!-- 輸入框 -->
        <div class="chatRoom__input_container">
          <div id="chatRoom__input_form">
            <input
              id="send_msg"
              v-model="sendMsg"
              type="text"
              placeholder="請輸入訊息..."
              required
              autocomplete="off"
              @keyup.enter="sendMessage"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import groupBy from 'lodash/groupBy'
import socket from '@/plugins/socket-io'

export default {
  data() {
    return {
      sendMsg: '',
      onlineUsers: [], // 在線的使用者
      userLists: [], // 已加入的所有使用者
      currentUserId: '',
      allMessages: [],
      hasHistoryMsg: false,
      adminMsgTime: 0, // 管理者最後一則訊息的時間
      showUnreadTag: false,
      timer: null
    }
  },
  computed: {
    adminId() {
      return this.$store.state.chat.admin.id
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeHandler)

    // admin join
    socket.emit('userJoin', {
      userId: this.adminId,
      username: 'admin',
      room: 'admin',
      unread: 0,
      loginTime: new Date().getTime()
    })

    // 獲取所有在線的使用者
    socket.on('getAllUser', users => {
      this.onlineUsers = users.filter(user => user.username !== 'admin')
    })

    // 監聽使用者傳來的訊息
    socket.on('msgFromUser', ({ userId, msg }) => {
      console.log('receive msg')
      console.log(msg)
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
  },
  methods: {
    openChat() {
      this.$refs.chatArea.classList.toggle('open')
    },
    resizeHandler() {
      if (window.innerHeight > 319) {
        this.$refs.chatArea.style.height = '100%'
        return false
      }
      this.$refs.chatArea.style.height = window.innerHeight / 2 + 'px'
    },
    sendMessage() {
      socket.emit('sendToUser', {
        id: '5eaf9f9619e26b3afb08b3a7',
        msg: this.sendMsg
      })
      this.sendMsg = ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/admin/_admin.scss';
</style>
