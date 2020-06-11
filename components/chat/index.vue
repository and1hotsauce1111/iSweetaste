<template>
  <div v-if="loginUser !== 'admin' && currentUserId !== ''">
    <div class="customer-service" @click="toggleChat">
      <span v-if="unreadMsgCount > 0" class="customer-service-message-count">{{ unreadMsgCount }}</span>
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
          <div
            v-for="(msg, index) in renderMsg"
            :key="index"
            class="customer-service-chat-room-messages-wrapper"
          >
            <div
              v-if="msg.from._id === adminId"
              class="customer-service-chat-room-messages-other-container"
            >
              <div v-if="msg.showUnreadTag" ref="unread" class="unread">
                <fa :icon="['fas', 'tag']" />&nbsp;
                <span>以下為尚未閱讀的訊息</span>
              </div>
              <div class="customer-service-chat-room-messages-other">
                <div class="customer-service-chat-room-messages-other_userImg">
                  <img src="~assets/img/logo/desktop/logo-dark.svg" alt />
                </div>
                <el-tooltip
                  class="customer-service-chat-room-messages-other_msg"
                  effect="dark"
                  :content="msg.createAt | formatTime($moment, 'msg')"
                  placement="left-start"
                >
                  <p class="text">{{ msg.message }}</p>
                </el-tooltip>
                <div class="customer-service-chat-room-messages-other_userReadImg">
                  <img src="~assets/img/logo/desktop/logo-dark.svg" alt />
                </div>
              </div>
            </div>
            <div v-else ref="selfMsg" class="customer-service-chat-room-messages-self-container">
              <div class="customer-service-chat-room-messages-self">
                <el-tooltip
                  effect="dark"
                  :content="msg.createAt | formatTime($moment, 'msg')"
                  placement="right-start"
                >
                  <p class="text">{{ msg.message }}</p>
                </el-tooltip>
              </div>
              <fa
                v-if="!msg.isSend && msg.unread === '0'"
                class="unsend_msg"
                :icon="['far', 'check-circle']"
              />
              <fa
                v-if="msg.isSend && msg.unread === '0'"
                class="unsend_msg"
                :icon="['fas', 'check-circle']"
              />
            </div>
          </div>
        </div>
        <div class="customer-service-chat-room-form">
          <div id="chat-form">
            <input
              id="msg"
              v-model="sendMsg"
              type="text"
              placeholder="請輸入訊息..."
              required
              autocomplete="off"
              @keyup.enter="sendMessage"
            />
          </div>
        </div>
        <div class="customer-service-chat-room-triangle"></div>
      </div>
    </div>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import socket from '@/plugins/socket-io'

export default {
  data() {
    return {
      sendMsg: '',
      allUsers: [], // 所有在線使用者
      allMsg: [], // 所有歷史訊息
      tempMsg: [], // 線上即時傳遞的訊息
      adminInfo: [], // 管理者資料
      userInfo: [], // 使用者資料
      isJoin: false, // 已登入線上
      isOpenChat: false, // 是否開啟對話框，判斷是否要顯示小紅點
      unreadMsgCount: 0, // 小紅點
      hasHistoryMsg: false,
      userLastMsgTime: '', // 使用者最後一則訊息的時間
      throttleTimer: null, // 節流函數計時器
      clearTagTimer: null // 清除unread Tag
    }
  },
  computed: {
    loginUser() {
      return decodeURIComponent(this.$store.state.user.user.name)
    },
    currentUserId() {
      return this.$store.state.user.user.id
    },
    adminId() {
      return this.$store.state.chat.admin.id
    },
    renderMsg() {
      if (this.allMsg.length !== 0) {
        const existMsg = this.allMsg.find(
          message => message.userId === this.currentUserId
        )
        if (existMsg) {
          return existMsg.msg
        }
      }
      return []
    }
  },
  watch: {
    allUsers: {
      handler(newVal, oldVal) {
        const user = this.allUsers.find(user => user.userId === this.adminId)

        if (user) {
          this.unreadMsgCount = user.unread
        }
      },
      deep: true
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeHandler)

    // 獲取未讀訊息小紅點
    this.$messageHandler._getUserUnreadMsgCount(this, this.adminId, this.currentUserId)

    socket.on('getAllUser', users => {
      this.allUsers = users
    })

    this.userJoin()

    // 接收來自admin的訊息
    socket.on('msgFromAdmin', msg => {
      this.$messageHandler._outPutMessage(this, this.currentUserId, msg)
      if (!this.isOpenChat) {
        // 未開啟對話框才判斷顯示未讀
        this.$messageHandler._findLastMessage(this, this.currentUserId, this.adminId)
      } else {
        // 開啟直接都顯示已讀
        this.readMsg()
        this.$messageHandler._scrollToBottom(this)
      }
    })
    // 監聽admin已讀事件
    socket.on('readFromAdmin', () => {
      // 更新已讀
      console.log('update unread')
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
    clearInterval(this.clearTagTimer)
    this.clearTagTimer = null
  },
  methods: {
    toggleChat() {
      this.$refs.chatContainer.classList.toggle('show')
      // await this.userJoin()
      this.isJoin = true
      this.isOpenChat = !this.isOpenChat

      // 建立socket連線，尚未取得使用者列表
      // if (this.allUsers.length === 0) {
      //   if (this.unreadMsgCount > 0) {
      //     console.log('in')

      //     this.unreadMsgCount = 0
      //     this.readMsg()
      //     this.$messageHandler._scrollToUnread(this)
      //   } else {
      //     this.$messageHandler._scrollToBottom(this)
      //   }
      //   // 設定定時清除unread tag
      //   this.clearTagTimer = setInterval(() => {
      //     this.clearTag()
      //   }, 5 * 60 * 1000)

      //   return false
      // }

      if (this.unreadMsgCount > 0) {
        console.log('in')
        this.readMsg()
        this.$messageHandler._scrollToUnread(this)
      } else {
        this.$messageHandler._scrollToBottom(this)
      }

      // 設定定時清除unread tag
      this.clearTagTimer = setInterval(() => {
        this.clearTag()
      }, 5 * 60 * 1000)
    },
    resizeHandler() {
      // 調整聊天視窗大小
      // 手機轉橫
      if (this.$refs.msgContent) {
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
    },
    async userJoin() {
      if (this.loginUser === '') return false
      // 已經開啟過對話框 不重複執行登入
      if (this.isJoin) return false
      // 顯示laoding
      const loadingInstance = Loading.service({
        target: '.customer-service-chat-room-messages'
      })
      // 驗證使用者是否已經存在
      const self = this
      const {
        status: findFriendStatus,
        data: { friend: oldFriend, admin, retCode: findFriendRetcode }
      } = await self.$axios.post('/oneFriend', { friendId: self.currentUserId })

      // 查無使用者 第一次登入
      // 新增使用者
      if (
        findFriendStatus === 200 &&
        oldFriend.length === 0 &&
        admin.length !== 0 &&
        findFriendRetcode === -1
      ) {
        // socket連線
        socket.emit('userJoin', {
          userId: self.currentUserId,
          username: self.loginUser,
          room: 'admin',
          unread: 0,
          // 透過socket即時顯示用
          loginTime: self
            .$moment()
            .tz('Asia/Taipei')
            .format('x')
        })

        // 紀錄管理者資料
        self.adminInfo = admin

        // 添加使用者到DB
        const {
          status: addFriendStatus,
          data: { retCode: addFriendRetCode, friend: newFriend }
        } = await self.$axios.post('/addFriend', {
          selfId: 'admin',
          friendId: self.currentUserId,
          loginTime: self
            .$moment()
            .tz('Asia/Taipei')
            .format('x')
        })

        if (addFriendStatus === 200 && addFriendRetCode === 0) {
          // 首次登入歡迎提示
          const obj = {
            from: { _id: self.adminId },
            to: { _id: self.currentUserId },
            message: '歡迎來到Sweetaste',
            unread: '0',
            createAt: self
              .$moment()
              .tz('Asia/Taipei')
              .format('x'),
            formatTime: self
              .$moment()
              .tz('Asia/Taipei')
              .format('lll'),
            showUnreadTag: false,
            isSend: false,
            isHeadShot: false
          }
          self.allMsg.push({
            userId: self.currentUserId,
            msg: [obj]
          })
          // 紀錄使用者資料
          self.userInfo = newFriend
        }
      }

      // 使用者已加入 socket通知上線 載入歷史訊息
      if (
        findFriendStatus === 200 &&
        oldFriend.length !== 0 &&
        admin.length !== 0 &&
        findFriendRetcode === 0
      ) {
        // socket連線
        socket.emit('userJoin', {
          userId: self.currentUserId,
          username: self.loginUser,
          room: 'admin',
          unread: 0,
          loginTime: self
            .$moment()
            .tz('Asia/Taipei')
            .format('x')
        })

        self.userInfo = oldFriend
        self.adminInfo = admin

        // 更新登入時間
        await self.$axios.post('/upadatLoginTime', {
          userId: self.currentUserId,
          loginTime: self
            .$moment()
            .tz('Asia/Taipei')
            .format('x')
        })

        // 獲取歷史訊息
        self.$messageHandler._getHistoryMessage(self)
      }
      loadingInstance.close()
    },
    sendMessage() {
      const msgInfo = {
        from: { _id: this.currentUserId },
        to: { _id: this.adminId },
        message: this.sendMsg,
        unread: '0',
        createAt: this.$moment()
          .tz('Asia/Taipei')
          .format('x'),
        formatTime: this.$moment()
          .tz('Asia/Taipei')
          .format('lll'),
        diffTime: 0,
        showUnreadTag: false,
        isSend: false,
        isHeadShot: false,
        isRead: false,
        isHide: false
      }
      this.$messageHandler._sendMessage(this, socket, msgInfo, 'user')
    },
    async readMsg() {
      // 小紅點歸0
      const user = this.allUsers.find(user => user.userId === this.adminId)
      user.unread = 0
      // 所有訊息歸0
      this.allMsg[0].msg.forEach(msg => {
        msg.unread = '1'
      })
      // 更新已讀到DB
      await this.$axios.post('/readMessage', {
        from: this.adminId,
        to: this.currentUserId
      })
      // 打出已讀socket事件
      console.log('userReadMsg')
      socket.emit('userReadMsg', this.currentUserId, this.adminId)
    },
    clearTag() {
      this.renderMsg.forEach(msg => {
        msg.showUnreadTag = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/chat/_chat.scss';
</style>
