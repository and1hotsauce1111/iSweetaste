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
        <div v-if="friendList.length !== 0" class="chatRoom__userList_list">
          <ul>
            <li v-for="friend in friendList" :key="friend.userId">
              <div
                :class="['chatRoom__userList_list_user', { 'unread': friend.unread > 0 , 'selected':currentUserId === friend.userId && friend.unread === 0 }]"
                @click="openChat(friend.userId)"
              >
                <div class="chatRoom__userList_list_user_img">
                  <img src="~assets/img/icons/user.png" alt />
                </div>
                <div class="chatRoom__userList_list_user_message">
                  <div class="chatRoom__userList_list_user_message_name">{{ friend.username }}</div>
                  <div class="chatRoom__userList_list_user_message_content">
                    <p
                      class="msg"
                    >{{ friend.userId !== adminId ? '' : '你 : ' }}{{ friend.lastestMsg }}</p>
                    <span class="dot">·</span>
                    <span
                      class="time"
                    >{{ parseInt(friend.lastMsgTime) | formatTime($moment, 'title') }}</span>
                  </div>
                </div>
                <span class="chatRoom__userList_list_user_notify"></span>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="allMsg.length !== 0" ref="chatArea" class="chatRoom__userMessage_container">
        <!-- 現在對話的對象標頭 -->
        <div v-if="currentUserId" class="chatRoom__userMessage_currentUser">
          <div class="chatRoom__userMessage_currentUser_back" @click="backToUserList">
            <fa :icon="['fas', 'chevron-left']" />
          </div>
          <div class="chatRoom__userMessage_currentUser_img">
            <img src="~assets/img/icons/user.png" alt />
          </div>
          <div class="chatRoom__userMessage_currentUser_userInfo">
            <h2>{{ currentUserMsg.titleArea.username }}</h2>
            <span
              v-if="showLastLoginTime"
              class="chatRoom__userMessage_currentUser_userInfo_lastOnline"
            >{{ updateOnlineTime || formatOnlineTime }}上線</span>
            <span v-else class="chatRoom__userMessage_currentUser_userInfo_lastOnline">上線中</span>
          </div>
        </div>

        <div v-if="!currentUserId" class="chatRoom__userMessage_noChat">———尚未選擇聊天室———</div>

        <!-- 訊息主體 -->
        <div class="chatRoom__userMessage_content">
          <div
            v-for="msg in currentUserMsg.msgContent.messages"
            :key="msg._id"
            class="chatRoom__userMessage_content_wrapper"
          >
            <div
              v-if="msg.from._id !== adminId"
              class="chatRoom__userMessage_content_container other_container"
            >
              <div v-if="msg.showUnreadTag" class="unread">
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
                  :content="parseInt(msg.createAt) | formatTime($moment, 'msg')"
                  placement="left-start"
                >
                  <p class="text">{{ msg.message }}</p>
                </el-tooltip>
                <div class="chatRoom__userMessage_content_userReadImg">
                  <img src="~assets/img/icons/user.png" alt />
                </div>
              </div>
            </div>
            <div v-else class="chatRoom__userMessage_content_container self_container">
              <el-tooltip
                class="chatRoom__userMessage_content_message content_self"
                effect="dark"
                :content="parseInt(msg.createAt) | formatTime($moment, 'msg')"
                placement="right-start"
              >
                <p class="text">{{ msg.message }}</p>
              </el-tooltip>
              <fa class="unsend_msg" :icon="['far', 'check-circle']" />
            </div>
          </div>
        </div>
        <!-- 輸入框 -->
        <div v-if="currentUserId" class="chatRoom__input_container">
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
import { Loading } from 'element-ui'
import socket from '@/plugins/socket-io'

export default {
  data() {
    return {
      sendMsg: '',
      allUsers: [], // 在線的使用者
      friendList: [], // 已加入的所有使用者
      currentUserId: '', // 當前選中的使用者
      offlineUser: null, // 離線使用者
      currentUserMsg: {
        titleArea: {},
        msgContent: []
      }, // 顯示當前對話者的訊息內容
      allMsg: [],
      hasHistoryMsg: false,
      userLastMsgTime: 0, // 管理者最後一則訊息的時間
      showUnreadTag: false,
      throttleTimer: null // 節流函數計時器
    }
  },
  computed: {
    adminId() {
      return this.$store.state.chat.admin.id
    },
    // 顯示使用者上次上線時間
    showLastLoginTime() {
      const existUser = this.allUsers.findIndex(
        friend => friend.userId === this.currentUserMsg.titleArea.userId
      )
      if (existUser !== -1) return false
      return true
    },
    // 格式化上線時間
    formatOnlineTime() {
      const existUser = this.friendList.findIndex(
        friend => friend.userId === this.currentUserMsg.titleArea.userId
      )
      if (existUser !== -1)
        return this.$formatTime(this.$moment, this.currentUserMsg.titleArea.loginTime)
      return ''
    },
    // socket 即時更新上線時間
    updateOnlineTime() {
      if (this.offlineUser !== null) {
        return this.$formatTime(this.$moment, parseInt(this.offlineUser.loginTime))
      }
      return false
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
      loginTime: this.$moment()
        .tz('Asia/Taipei')
        .format('x')
    })

    // 已加入的所有使用者
    this.$messageHandler._getAllFriends(this)
    // 獲取所有歷史訊息
    this.$messageHandler._getAllHistoryMessage(this, this.adminId)
    // 處理朋友列表的顯示

    // 獲取所有在線的使用者
    socket.on('getAllUser', (users, offlineUser) => {
      console.log('getAllUser')
      if (offlineUser) {
        this.offlineUser = offlineUser
      }
      this.allUsers = users.filter(user => user.username !== 'admin')
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
    openChat(userId) {
      this.$refs.chatArea.classList.add('open')
      this.currentUserId = userId
      // 顯示laoding
      const loadingInstance = Loading.service({
        target: '.chatRoom__userMessage_container'
      })

      const currentFriend = this.friendList.find(friend => friend.userId === userId)
      const currentMsg = this.allMsg.find(msg => msg.userId === userId)

      this.currentUserMsg.titleArea = currentFriend
      this.currentUserMsg.msgContent = currentMsg

      // 更新所有訊息為已讀

      loadingInstance.close()
    },
    backToUserList() {
      this.$refs.chatArea.classList.remove('open')
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
