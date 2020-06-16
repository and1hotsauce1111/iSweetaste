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
            ref="allMsg"
            class="customer-service-chat-room-messages-wrapper"
          >
            <div
              v-if="msg.from._id === adminId"
              ref="otherMsg"
              class="customer-service-chat-room-messages-other-container"
            >
              <div v-if="msg.isTime" class="msg_time">
                <span>{{ msg.createAt | formatTime($moment, 'calendar') }}</span>
              </div>
              <div v-if="msg.showUnreadTag" id="unread" ref="unread" class="unread">
                <fa :icon="['fas', 'tag']" />&nbsp;
                <span>以下為尚未閱讀的訊息</span>
              </div>
              <div class="customer-service-chat-room-messages-other">
                <div
                  :class="['customer-service-chat-room-messages-other_userImg', {'show' : msg.isHeadShot}]"
                >
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
                <div
                  v-if="msg.isSend"
                  ref="otherMsgIcon"
                  class="customer-service-chat-room-messages-other_userReadImg"
                >
                  <img src="~assets/img/logo/desktop/logo-dark.svg" alt />
                </div>
              </div>
            </div>
            <div v-else ref="selfMsg" class="customer-service-chat-room-messages-self-container">
              <div v-if="msg.isTime" class="msg_time">
                <span>{{ msg.createAt | formatTime($moment, 'calendar') }}</span>
              </div>
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
                v-if="!msg.isSend && !msg.isHide"
                class="unsend_msg send_no"
                :icon="['far', 'check-circle']"
              />
              <fa
                v-if="msg.isSend && !msg.isHide"
                class="unsend_msg send_yes"
                :icon="['fas', 'check-circle']"
              />
              <div v-if="msg.isRead" ref="selfMsgIcon" class="user_imgIcon">
                <img src="~assets/img/logo/desktop/logo-dark.svg" alt />
              </div>
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
import _groupBy from 'lodash.groupby'
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
      debounceTimer: null, // 防抖函數計時器
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

    socket.on('getAllUser', users => {
      this.allUsers = users
    })

    // 非管理者則執行userJoin
    if (this.currentUserId !== this.adminId) {
      this.userJoin()
    }

    // 接收來自admin的訊息
    socket.on('msgFromAdmin', msg => {
      const vm = this

      if (!vm.isOpenChat) {
        this.$messageHandler._outPutMessage(vm, vm.currentUserId, msg)
        // 未開啟對話框才判斷顯示未讀
        vm.$messageHandler._findLastMessage(vm, vm.currentUserId, vm.adminId)
        vm.$messageHandler._scrollToBottom(vm)
      } else {
        // 開啟直接都顯示已讀
        // 配合節流函數
        setTimeout(() => {
          this.$messageHandler._outPutMessage(vm, vm.currentUserId, msg)
          vm.readMsg()
          // 更新對方訊息頭像顯示
          vm.updateHeadShot()
          vm.$messageHandler._scrollToBottom(vm)
        }, 1000)
      }
    })
    // 監聽admin已讀事件
    socket.on('readFromAdmin', from => {
      // 已讀動畫
      const self = this
      if (this.isOpenChat) {
        // 因為儲存訊息節流函數延遲2000
        setTimeout(() => {
          self.readAnim()
        }, 1000)
        return false
      }
    })

    // socket重新連結
    socket.on('reconnect', () => {
      if (this.currentUserId !== this.adminId) {
        this.userJoin()
      }
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

      if (this.unreadMsgCount > 0) {
        this.readMsg()
        this.updateImgIcon()
        this.$messageHandler._scrollToUnread(this)
      } else {
        this.updateImgIcon()
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
        this.$refs.msgContent.style.height = '81%'
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
        groupByTime: this.$moment()
          .tz('Asia/Taipei')
          .format('ll'),
        showUnreadTag: false,
        isSend: false,
        isHeadShot: false,
        isRead: false,
        isHide: false,
        isTime: false
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
      socket.emit('userReadMsg', this.currentUserId, this.adminId)
    },
    clearTag() {
      this.renderMsg.forEach(msg => {
        msg.showUnreadTag = false
      })
    },
    // 顯示對方已讀動畫
    readAnim() {
      // 第一種: 對方未讀訊息 img icon顯示在對方訊息後
      // 第二種: 對方開啟對話框(已讀) 自己發送新訊息 img icon顯示在自己最後一則訊息後
      this.$nextTick(() => {
        const otherMsgIcon = this.$refs.otherMsgIcon // 別人訊息img icon
        const selfMsgIcon = this.$refs.selfMsgIcon // 自己訊息img icon
        const targetOtherMsg = this.allMsg[0].msg.find(
          msg => msg.isSend === true && msg.from._id === this.adminId
        ) // 別人訊息有img icon的
        const targetSelfMsg = this.allMsg[0].msg.filter(
          msg =>
            msg.from._id === this.currentUserId &&
            msg.isSend === true &&
            msg.isHide === false
        ) // 自己訊息有勾勾的
        const targetSelfMsgIcon = this.allMsg[0].msg.find(
          msg => msg.from._id === this.currentUserId && msg.isRead === true
        ) // 自己訊息有img icon

        if (targetSelfMsg.length === 0) return false

        const targetSelfMsgDOM = this.$refs.selfMsg

        if (targetOtherMsg || targetSelfMsg) {
          // 計算出需要移動的距離 所有自己訊息的offsetHeight
          let moveY = 0
          targetSelfMsgDOM.forEach(msg => {
            if (msg.children[1] && msg.children[1].classList[1] === 'send_yes') {
              moveY += msg.offsetHeight
            }
          })

          // 自己訊息
          // 清除畫面上的訊息送出勾勾
          targetSelfMsg.forEach(msg => {
            msg.isHide = true
          })
          // 移動到該位置
          if (typeof otherMsgIcon !== 'undefined') {
            // 可能為空陣列
            if (otherMsgIcon[0]) {
              otherMsgIcon[0].style.transform = `translateY(${moveY}px)`
            }
          }

          // 別人訊息
          if (typeof selfMsgIcon !== 'undefined') {
            // 可能為空陣列
            if (selfMsgIcon[0]) {
              selfMsgIcon[0].style.transform = `translateY(${moveY}px)`

              if (targetSelfMsgIcon) {
                targetSelfMsgIcon.isRead = false
              }
            }
          }

          // 顯示自己最後一則訊息img icon 其餘隱藏
          const selfMsg = this.allMsg[0].msg.filter(
            msg => msg.from._id === this.currentUserId
          )
          const selfLastMsg = selfMsg[selfMsg.length - 1]
          selfLastMsg.isRead = true

          // 隱藏對方訊息img icon
          if (targetOtherMsg) {
            targetOtherMsg.isSend = false
          }
        }
      })
    },
    // 顯示 隱藏img icon
    updateImgIcon() {
      if (typeof this.allMsg[0] === 'undefined') return false
      const allMsg = this.allMsg[0].msg
      // 別人的訊息
      const otherMsg = allMsg.filter(msg => msg.from._id === this.adminId)
      // 自己的訊息
      const selfMsg = allMsg.filter(msg => msg.from._id === this.currentUserId)

      // 顯示laoding
      const loadingInstance = Loading.service({
        target: '.customer-service-chat-room'
      })

      // 別人訊息的頭像
      if (otherMsg.length !== 0) {
        otherMsg.forEach(msg => {
          msg.isHeadShot = false
          msg.isSend = false
        })
      }

      allMsg.forEach((msg, index) => {
        const nextMsg = allMsg[index + 1]
        if (
          nextMsg &&
          nextMsg.from._id === this.currentUserId &&
          msg.from._id === this.adminId
        ) {
          msg.isHeadShot = true
          msg.isSend = false
          msg.isTime = false
        } else {
          msg.isHeadShot = false
          msg.isSend = false
          msg.isTime = false
        }
      })

      // 自己的訊息頭像
      if (selfMsg.length !== 0) {
        selfMsg.forEach(msg => {
          if (msg.unread === '0') {
            msg.isSend = true
          } else {
            msg.isHide = true
          }
        })
      }

      // 判斷最後一則訊息
      const lastMsg = allMsg[allMsg.length - 1]
      if (lastMsg && lastMsg.from._id === this.currentUserId) {
        if (lastMsg.unread === '0') {
          lastMsg.isRead = false
        } else {
          lastMsg.isRead = true
        }
      }
      if (lastMsg && lastMsg.from._id === this.adminId) {
        lastMsg.isHeadShot = true
        lastMsg.isSend = true
      }

      // groupby msg
      const groupByTime = _groupBy(allMsg, 'groupByTime')

      for (const day in groupByTime) {
        groupByTime[day][0].isTime = true
      }

      loadingInstance.close()
    },
    updateHeadShot() {
      const allMsg = this.allMsg[0].msg
      // 別人的訊息
      const otherMsg = allMsg.filter(msg => msg.from._id === this.adminId)
      // 自己的訊息
      const selfMsg = allMsg.filter(msg => msg.from._id === this.currentUserId)

      // 隱藏別人訊息的頭像
      if (otherMsg.length !== 0) {
        otherMsg.forEach(msg => {
          msg.isHeadShot = false
          msg.isSend = false
        })
      }

      // 隱藏自己訊息的頭像
      if (selfMsg.length !== 0) {
        selfMsg.forEach(msg => {
          msg.isHide = true
          msg.isRead = false
        })
      }

      allMsg.forEach((msg, index) => {
        const nextMsg = allMsg[index + 1]
        if (
          nextMsg &&
          nextMsg.from._id === this.currentUserId &&
          msg.from._id === this.adminId
        ) {
          msg.isHeadShot = true
          msg.isSend = false
          msg.isTime = false
        } else {
          msg.isHeadShot = false
          msg.isSend = false
          msg.isTime = false
        }
      })

      // 自己的訊息頭像
      if (selfMsg.length !== 0) {
        selfMsg.forEach(msg => {
          if (msg.unread === '0') {
            msg.isSend = true
          } else {
            msg.isHide = true
          }
        })
      }

      // 判斷最後一則訊息
      const lastMsg = allMsg[allMsg.length - 1]
      if (lastMsg && lastMsg.from._id === this.currentUserId) {
        if (lastMsg.unread === '0') {
          lastMsg.isRead = false
        } else {
          lastMsg.isRead = true
        }
      }
      if (lastMsg && lastMsg.from._id === this.adminId) {
        lastMsg.isHeadShot = true
        lastMsg.isSend = true
      }

      // groupby msg
      const groupByTime = _groupBy(allMsg, 'groupByTime')

      for (const day in groupByTime) {
        groupByTime[day][0].isTime = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/chat/_chat.scss';
</style>
