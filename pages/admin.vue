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
            <input
              v-model="searchUserName"
              type="text"
              placeholder="搜尋使用者"
              autocomplete="off"
              @keyup="searchUser"
            />
          </span>
        </div>
        <div v-if="friendList.length === 0" class="no_user">——— 尚無任何使用者 ———</div>
        <div v-if="friendList.length !== 0" class="chatRoom__userList_list">
          <ul>
            <li v-for="friend in friendList" :key="friend.userId">
              <div
                :class="[
                  'chatRoom__userList_list_user',
                  {
                    unread: friend.unread > 0,
                    selected: currentUserId === friend.userId && friend.unread === 0
                  }
                ]"
                @click="openChat(friend.userId, friend.unread)"
              >
                <div class="chatRoom__userList_list_user_img">
                  <img :src="friend.avatar" alt />
                </div>
                <div class="chatRoom__userList_list_user_message">
                  <div class="chatRoom__userList_list_user_message_name">
                    {{ decodeURIComponent(friend.username) }}
                  </div>
                  <div class="chatRoom__userList_list_user_message_content">
                    <p v-if="friend.lastestMsg !== ''" class="msg">
                      {{
                        friend.lastMsgFrom !== adminId
                          ? friend.lastestMsg
                          : `你 : ${friend.lastestMsg}`
                      }}
                    </p>
                    <span v-if="friend.lastestMsg !== ''" class="dot">·</span>
                    <span v-if="friend.lastestMsg !== ''" class="time">{{
                      friend.lastMsgTime | formatTime($moment, 'title')
                    }}</span>
                  </div>
                </div>
                <span
                  v-if="friend.unread > 0"
                  class="chatRoom__userList_list_user_notify"
                ></span>
                <div
                  v-if="friend.unread === 0 && friend.userId === adminId"
                  class="chatRoom__userList_list_user_notify_img"
                >
                  <img src="~assets/img/avatar/user.png" alt />
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div
        v-if="allMsg.length !== 0"
        ref="chatArea"
        class="chatRoom__userMessage_container"
      >
        <!-- 現在對話的對象標頭 -->
        <div v-if="currentUserId" class="chatRoom__userMessage_currentUser">
          <div class="chatRoom__userMessage_currentUser_back" @click="backToUserList">
            <fa :icon="['fas', 'chevron-left']" />
          </div>
          <div class="chatRoom__userMessage_currentUser_img">
            <img :src="chatRoomAvatar" alt />
          </div>
          <div class="chatRoom__userMessage_currentUser_userInfo">
            <h2>{{ decodeURIComponent(currentUserMsg.titleArea.username) }}</h2>
            <span
              v-if="showLastLoginTime"
              class="chatRoom__userMessage_currentUser_userInfo_lastOnline"
            >
              {{ lastLoginTime }}上線
            </span>
            <span v-else class="chatRoom__userMessage_currentUser_userInfo_lastOnline">
              上線中
            </span>
          </div>
        </div>

        <div v-if="!currentUserId" class="chatRoom__userMessage_noChat">
          ———尚未選擇聊天室———
        </div>

        <!-- 訊息主體 -->
        <div ref="msgContent" class="chatRoom__userMessage_content">
          <div
            v-for="msg in currentUserMsg.msgContent.msg"
            :key="msg._id"
            class="chatRoom__userMessage_content_wrapper"
          >
            <div
              v-if="msg.from._id === currentUserId"
              ref="otherMsg"
              class="chatRoom__userMessage_content_container other_container"
            >
              <div v-if="msg.isTime" ref="timeSection" class="msg_time">
                <span>{{ msg.createAt | formatTime($moment, 'calendar') }}</span>
              </div>
              <div v-if="msg.showUnreadTag" id="unread" ref="unread" class="unread">
                <fa :icon="['fas', 'tag']" />&nbsp;
                <span>以下為尚未閱讀的訊息</span>
              </div>
              <div class="chatRoom__userMessage_content_message_wrap">
                <div
                  :class="[
                    'chatRoom__userMessage_content_userImg',
                    { show: msg.isHeadShot }
                  ]"
                >
                  <img :src="chatRoomAvatar" alt />
                </div>
                <el-tooltip
                  class="chatRoom__userMessage_content_message content_other"
                  effect="dark"
                  :content="msg.createAt | formatTime($moment, 'msg')"
                  placement="left-start"
                >
                  <p class="text">{{ msg.message }}</p>
                </el-tooltip>
                <div
                  v-if="msg.isSend"
                  ref="otherMsgIcon"
                  class="chatRoom__userMessage_content_userReadImg"
                >
                  <img :src="chatRoomAvatar" alt />
                </div>
              </div>
            </div>
            <div
              v-else
              ref="selfMsg"
              class="chatRoom__userMessage_content_container self_container"
            >
              <div v-if="msg.isTime" class="msg_time">
                <span>{{ msg.createAt | formatTime($moment, 'calendar') }}</span>
              </div>
              <el-tooltip
                class="chatRoom__userMessage_content_message content_self"
                effect="dark"
                :content="msg.createAt | formatTime($moment, 'msg')"
                placement="right-start"
              >
                <p class="text">{{ msg.message }}</p>
              </el-tooltip>
              <fa
                v-if="!msg.isSend && !msg.isHide"
                class="send_msg send_no"
                :icon="['far', 'check-circle']"
              />
              <fa
                v-if="msg.isSend && !msg.isHide"
                class="send_msg send_yes"
                :icon="['fas', 'check-circle']"
              />
              <div
                v-if="msg.isRead"
                ref="selfMsgIcon"
                class="chatRoom__userMessage_content_otheruserReadImg"
              >
                <img :src="chatRoomAvatar" alt />
              </div>
            </div>
          </div>
          <!-- fixed show time -->
          <div class="fixed_showTime">
            <span>{{ fixedShowTime }}</span>
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
import _groupBy from 'lodash.groupby'
import { Loading } from 'element-ui'
import socket from '@/plugins/socket-io'

export default {
  data() {
    return {
      searchUserName: '', // 搜尋使用者名稱
      sendMsg: '',
      allUsers: [], // 在線的使用者
      friendList: [], // 已加入的所有使用者
      copyFriendList: [], // 篩選用使用者列表
      currentUserId: '', // 當前選中的使用者
      dynamicUser: null, // 動態使用者（登入/離線)
      currentUserMsg: {
        titleArea: {},
        msgContent: []
      }, // 顯示當前對話者的訊息內容
      allMsg: [],
      tempMsg: [], // 發送訊息暫存區
      hasHistoryMsg: false,
      userLastMsgTime: 0, // 管理者最後一則訊息的時間
      // showUnreadTag: false,
      // throttleTimer: null, // 節流函數計時器
      clearTagTimer: null, // 清除unread Tag
      lastSelfMsgIndex: 0, // 暫存最後一則訊息index updateHeadShot用
      fixedShowTime: '' // 滾動時顯示的時間段
    }
  },
  computed: {
    loginId() {
      return this.$store.state.user.user.id
    },
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
    lastLoginTime() {
      // 上次登入時間
      const friend = this.friendList.find(friend => friend.userId === this.currentUserId)
      if (friend) {
        return this.$formatTime(this.$moment, parseInt(friend.loginTime))
      }
      return ''
    },
    // socket 即時更新上線時間
    updateOnlineTime() {
      if (this.dynamicUser !== null) {
        const friend = this.friendList.find(
          friend => friend.userId === this.currentUserId
        )
        friend.loginTime = this.dynamicUser.loginTime
      }
      return false
    },
    // 顯示對話框大頭貼
    chatRoomAvatar() {
      const currentUser = this.friendList.find(
        friend => friend.userId === this.currentUserId
      )
      return currentUser.avatar
    },
    // 顯示管理者頭像
    adminAvatar() {
      const haveAvatar = this.$store.state.chat.admin.adminHaveAvatar
      if (haveAvatar) return `/users/${this.adminId}/avatar`
      return `${require('@/assets/img/avatar/user.png')}`
    }
  },
  mounted() {
    // 判斷手機轉橫
    window.addEventListener('resize', this.resizeHandler)
    // 監聽scroll事件
    window.addEventListener('scroll', this.scrollHandler)

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
    socket.on('getAllUser', (users, user) => {
      console.log('getAllUsers', users)
      this.dynamicUser = user
      this.allUsers = users.filter(user => user.username !== 'admin')
    })

    // 監聽使用者傳來的訊息
    socket.on('msgFromUser', ({ msg }) => {
      const vm = this
      setTimeout(() => {
        this.$messageHandler._outPutMessage(vm, msg.from._id, msg)
        this.updateFriendList(msg)
        // 開啟對話框的情況
        if (msg.from._id === vm.currentUserId) {
          vm.readMsg(msg.from._id, vm.adminId)
          // 更新對方訊息頭像顯示
          vm.updateHeadShot()
          return false
        }
        // unreadMsgCount寫入vuex
        vm.$store.commit('chat/addMsgCount')
      }, 1000)
    })

    // 監聽對方已讀事件
    socket.on('readFromUser', from => {
      // 開啟對話框的情況
      const self = this
      if (this.currentUserId === from) {
        setTimeout(() => {
          self.readAnim()
        }, 1000)
        return false
      }
    })

    // socket重新連結
    socket.on('reconnect', () => {
      socket.emit('userJoin', {
        userId: this.adminId,
        username: 'admin',
        room: 'admin',
        unread: 0,
        loginTime: this.$moment()
          .tz('Asia/Taipei')
          .format('x')
      })
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeHandler)
    window.removeEventListener('scroll', this.scrollHandler)
    clearInterval(this.clearTagTimer)
    this.clearTagTimer = null
  },
  methods: {
    openChat(userId, unread) {
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

      // 沒有歷史訊息 return
      if (!this.hasHistoryMsg && currentMsg.msg.length === 0) {
        loadingInstance.close()
        return false
      }

      this.upadteImgIcon()

      // 移動至未讀區域或至底
      this.$nextTick(() => {
        const currentUser = this.friendList.find(
          friend => friend.userId === this.currentUserId
        )
        const unread = currentUser.unread

        if (unread > 0) {
          this.updateHeadShot()
          this.$messageHandler._scrollToUnread(this, 'admin')
          // 更新所有對方訊息為已讀
          this.readMsg(userId, this.adminId)
          // 更新vuex unreadMsgCount
          this.$store.commit('chat/substractMsgCount', unread)
        } else {
          this.$messageHandler._scrollToBottom(this)
        }

        loadingInstance.close()

        // 設定定時清除unread tag
        this.clearTagTimer = setInterval(() => {
          this.clearTag()
        }, 5 * 60 * 1000)
      })
    },
    backToUserList() {
      this.$refs.chatArea.classList.remove('open')
      // 清空選取使用者
      this.currentUserId = ''
      this.currentUserMsg.titleArea = {}
      this.currentUserMsg.msgContent = []
    },
    resizeHandler() {
      if (this.$refs.chatArea) {
        if (window.innerHeight > 319) {
          this.$refs.chatArea.style.height = '100%'
          return false
        }
        this.$refs.chatArea.style.height = window.innerHeight / 2 + 'px'
      }
    },
    scrollHandler() {
      if (this.currentUserId !== '') {
      }
    },
    sendMessage() {
      const msgInfo = {
        from: { _id: this.adminId },
        to: { _id: this.currentUserId },
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
      this.$messageHandler._sendMessage(this, socket, msgInfo, 'admin')
      this.$messageHandler._sortUserList(this)
    },
    // 即時更新使用者列表顯示
    async updateFriendList(msg) {
      // 若對話框開啟下 直接顯示為已讀
      const msgFrom = msg.from._id

      const updateFriend = this.friendList.find(friend => friend.userId === msgFrom)
      updateFriend.lastMsgTime = msg.createAt
      updateFriend.lastestMsg = msg.message
      updateFriend.lastMsgFrom = msgFrom

      if (this.currentUserId === msgFrom) {
        // 更新已讀到DB
        await this.$axios.post('/readMessage', { from: msgFrom, to: this.loginId })
        updateFriend.unread = 0
        this.$messageHandler._scrollToBottom(this)
      } else {
        this.$messageHandler._findLastMessage(this, this.loginId, msgFrom)
      }
      // 更新列表排序
      this.$messageHandler._sortUserList(this)
    },
    updateHeadShot() {
      const currentUserMsg =
        this.currentUserMsg.msgContent.msg ||
        this.allMsg.find(msg => msg.userId === this.currentUserId).msg

      // 自己的訊息
      const selfMsg = currentUserMsg.filter(msg => msg.from._id === this.adminId)
      // 別人的訊息
      const otherMsg = currentUserMsg.filter(msg => msg.from._id === this.currentUserId)

      console.log('otherMsg', otherMsg)

      // 尚無自己的訊息

      if (selfMsg.length === 0) {
        if (otherMsg.length !== 0) {
          // 顯示 隱藏headshot isSend
          // 從 isSend isHeadShot都為true的開始往下找
          const startIndex = otherMsg.findIndex(msg => msg.isHeadShot && msg.isSend)
          console.log('startIndex', startIndex)

          // 需要迴圈判斷的msg
          const loopMsg = otherMsg.slice(startIndex)

          console.log('loopMsg', loopMsg)
          if (loopMsg.length === 0) return false

          for (let i = 0; i < loopMsg.length; i++) {
            loopMsg[i].isHeadShot = false
            loopMsg[i].isSend = false
          }

          // 第一則訊息顯示時間
          loopMsg[0].isTime = true

          const lastOtherMsg = otherMsg[otherMsg.length - 1]
          lastOtherMsg.isHeadShot = true
          lastOtherMsg.isSend = true
        }

        return false
      }

      // 只專注更新自己最後一則訊息以後的headshot
      // 自己最後一則訊息的index
      const lastSelfMsgIndex = currentUserMsg.findIndex(
        msg => msg.from._id === this.adminId && msg.isRead
      )

      if (lastSelfMsgIndex !== -1) {
        this.lastSelfMsgIndex = lastSelfMsgIndex
      }

      // 自己訊息的最後一則img icon隱藏
      const lastSelfMsg = selfMsg[selfMsg.length - 1]
      lastSelfMsg.isRead = false

      // 需要跑更新的訊息區塊
      const targetUpdatMsg = currentUserMsg.slice(this.lastSelfMsgIndex)

      // 先隱藏全部大頭像 img icon 並更新db
      if (targetUpdatMsg.length !== 0) {
        for (let i = 0; i < targetUpdatMsg.length; i++) {
          if (targetUpdatMsg[i].from._id === this.currentUserId) {
            targetUpdatMsg[i].isSend = false
            targetUpdatMsg[i].isHeadShot = false
          }
        }
      }

      // 判斷別人訊息的下一則訊息若為自己的訊息 該則別人訊息添加頭像
      for (let i = 0; i < targetUpdatMsg.length; i++) {
        if (targetUpdatMsg[i].from._id === this.currentUserId) {
          const nextMsg = targetUpdatMsg[i + 1]
          if (nextMsg && nextMsg.from._id === this.adminId) {
            targetUpdatMsg[i].isHeadShot = true
          }
        }
      }

      // 若所有訊息的最後一則為他人訊息 則添加isSend
      // 最後一則訊息index
      const lastMsgIndex = currentUserMsg.length - 1
      if (
        lastMsgIndex !== -1 &&
        currentUserMsg[lastMsgIndex].from._id === this.currentUserId
      ) {
        currentUserMsg[lastMsgIndex].isHeadShot = true
        currentUserMsg[lastMsgIndex].isSend = true
      }

      // groupby msg
      const groupByTime = _groupBy(currentUserMsg, 'groupByTime')
      for (const day in groupByTime) {
        groupByTime[day][0].isTime = true
      }
    },
    async readMsg(from, to) {
      // 更新自身訊息為已讀
      await this.$axios.post('/readMessage', { from, to })
      this.friendList.find(friend => friend.userId === from).unread = 0
      // 打出已讀socket事件
      socket.emit('adminReadMsg', this.adminId, this.currentUserId)
    },
    // 處理對方已讀img icon動畫
    readAnim() {
      // 第一種: 對方未讀訊息 img icon顯示在對方訊息後
      // 第二種: 對方開啟對話框(已讀) 自己發送新訊息 img icon顯示在自己最後一則訊息後
      this.$nextTick(() => {
        const otherMsgIcon = this.$refs.otherMsgIcon // 別人訊息img icon
        const selfMsgIcon = this.$refs.selfMsgIcon // 自己訊息img icon
        const targetOtherMsg = this.currentUserMsg.msgContent.msg.find(
          msg => msg.isSend === true && msg.from._id === this.currentUserId
        ) // 別人訊息有img icon的
        const targetSelfMsg = this.currentUserMsg.msgContent.msg.filter(
          msg =>
            msg.from._id === this.adminId && msg.isSend === true && msg.isHide === false
        ) // 自己訊息有勾勾的
        const targetSelfMsgIcon = this.currentUserMsg.msgContent.msg.find(
          msg => msg.from._id === this.adminId && msg.isRead === true
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
          const selfMsg = this.currentUserMsg.msgContent.msg.filter(
            msg => msg.from._id === this.adminId
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
    // mounted 時更新img icon顯示
    upadteImgIcon() {
      if (typeof this.currentUserMsg.msgContent === 'undefined') return false
      const msgContent = this.currentUserMsg.msgContent.msg
      // const otherMsg = msgContent.filter(msg => msg.from._id === this.currentUserId)
      const selfMsg = msgContent.filter(msg => msg.from._id === this.adminId)

      // 顯示laoding
      const loadingInstance = Loading.service({
        target: '.chatRoom__userMessage_container'
      })

      msgContent.forEach((msg, index) => {
        const nextMsg = msgContent[index + 1]
        if (
          nextMsg &&
          nextMsg.from._id === this.adminId &&
          msg.from._id === this.currentUserId
        ) {
          msg.isHeadShot = true
          msg.isSend = false
        } else {
          msg.isHeadShot = false
          msg.isSend = false
        }
      })

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
      const lastMsg = msgContent[msgContent.length - 1]
      if (lastMsg && lastMsg.from._id === this.adminId) {
        if (lastMsg.unread === '0') {
          lastMsg.isRead = false
        } else {
          lastMsg.isRead = true
        }
      }
      if (lastMsg && lastMsg.from._id === this.currentUserId) {
        lastMsg.isHeadShot = true
        lastMsg.isSend = true
      }

      // groupby msg
      const groupByTime = _groupBy(msgContent, 'groupByTime')
      for (const day in groupByTime) {
        groupByTime[day][0].isTime = true
      }

      loadingInstance.close()
    },
    clearTag() {
      if (this.currentUserId !== '') {
        this.currentUserMsg.msgContent.msg.forEach(msg => {
          msg.showUnreadTag = false
        })
        return false
      }

      this.allMsg.forEach(msg => {
        msg.msg.forEach(item => {
          item.showUnreadTag = false
        })
      })
    },
    searchUser() {
      const userName = []
      this.copyFriendList.forEach(friend => userName.push(friend.username))
      // 顯示所有使用者
      if (this.searchUserName === '') {
        this.friendList = this.copyFriendList
      }
      this.friendList = this.copyFriendList.filter(friend =>
        friend.username.match(this.searchUserName)
      )
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/admin/_admin.scss';
</style>
