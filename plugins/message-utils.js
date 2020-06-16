import Vue from 'vue'
import _orderby from 'lodash.orderby'
import { Loading } from 'element-ui'

Vue.prototype.$messageHandler = {
  // this 指向$messageHandler
  // 送出訊息
  _sendMessage(vm, socket, msgInfo, type) {
    // 判斷當前用戶是否在線
    const currentUser = vm.allUsers.find(user => user.userId === vm.currentUserId)

    if (vm.sendMsg !== '') {
      if (currentUser && currentUser.socketId !== '') {
        // 使用者在線
        if (type === 'user') {
          socket.emit('sendToAdmin', msgInfo)
        }

        if (type === 'admin') {
          socket.emit('sendToUser', msgInfo)
        }

        // 記錄到待送訊息區
        vm.tempMsg.push(msgInfo)
        this._outPutMessage(vm, vm.currentUserId, msgInfo)
        // 存一份到localstorage
        window.localStorage.setItem(msgInfo.from._id, vm.tempMsg)
        // 清空輸入框
        vm.sendMsg = ''
        // 存進DB
        this._debounceSengMsg(vm, this._saveMessage, 1000)(
          vm,
          msgInfo.from._id,
          msgInfo.to._id,
          type
        )

        this._scrollToBottom(vm)
        if (type === 'admin') {
          // 更新使用者列表
          const currentFriend = vm.friendList.find(
            friend => friend.userId === msgInfo.to._id
          )
          currentFriend.lastestMsg = msgInfo.message
          currentFriend.lastMsgTime = msgInfo.createAt
        }
      } else {
        vm.tempMsg.push(msgInfo)
        this._outPutMessage(vm, vm.currentUserId, msgInfo)
        window.localStorage.setItem(msgInfo.from._id, vm.tempMsg)
        vm.sendMsg = ''

        this._debounceSengMsg(vm, this._saveMessage, 1000)(
          vm,
          msgInfo.from._id,
          msgInfo.to._id,
          type
        )
        this._scrollToBottom(vm)
        if (type === 'admin') {
          // 更新使用者列表
          const currentFriend = vm.friendList.find(
            friend => friend.userId === msgInfo.to._id
          )
          currentFriend.lastestMsg = msgInfo.message
          currentFriend.lastMsgTime = msgInfo.createAt
        }
      }
    }
  },
  // user取得歷史訊息
  async _getHistoryMessage(vm) {
    // 顯示laoding
    const loadingInstance = Loading.service({
      target: '.customer-service-chat-room-messages'
    })

    const self = vm
    if (self.adminInfo.length === 0) return false
    const {
      status,
      data: { allMsg, retCode }
    } = await self.$axios.post('/historyMessage', {
      from: self.adminInfo[0]._id,
      to: self.currentUserId
    })
    // 查無歷史訊息
    if (status === 200 && allMsg.length === 0 && retCode === -1) {
      loadingInstance.close()
      return false
    }

    if (status === 200 && allMsg.length !== 0 && retCode === 0) {
      // 整理訊息格式
      if (allMsg.length !== 0) {
        self.hasHistoryMsg = true
        // 先清空資料
        const userMsgIndex = self.allMsg.findIndex(message => {
          return Object.keys(message)[0] === self.currentUserId
        })
        if (userMsgIndex !== -1) {
          self.allMsg[userMsgIndex][self.currentUserId].msg = []
        }

        for (let i = 0; i < allMsg.length; i++) {
          for (let j = 0; j < allMsg[i].msg.length; j++) {
            this._outPutMessage(vm, allMsg[i].userId, allMsg[i].msg[j])
          }
        }

        // 更新img icon
        self.updateImgIcon()
        this._findLastMessage(vm, self.currentUserId, self.adminInfo[0]._id)
        // self.readMsg()
        loadingInstance.close()
      }
      return false
    }
    loadingInstance.close()
  },
  // admin取得歷史訊息
  async _getAllHistoryMessage(vm, adminId) {
    // 顯示laoding
    const loadingInstance = Loading.service({
      target: '.chatRoom__container'
    })
    const self = vm
    const {
      status: getMsgStatus,
      data: { allMsg, retCode: retCode1 }
    } = await self.$axios.post('/allHistoryMessage', { adminId })

    self.allMsg = allMsg

    let hasHistoryMsg = 0
    allMsg.forEach(msg => {
      if (msg.msg.length !== 0) {
        hasHistoryMsg++
      }
    })

    // 查無歷史訊息
    if (getMsgStatus === 200 && hasHistoryMsg === 0 && retCode1 === -1) {
      loadingInstance.close()
      return false
    }
    if (getMsgStatus === 200 && hasHistoryMsg > 0 && retCode1 === 0) {
      self.allMsg = allMsg
      self.hasHistoryMsg = true
      // 顯示未讀訊息tag
      self.allMsg.forEach(msg => {
        this._findLastMessage(vm, vm.loginId, msg.userId)
      })
      loadingInstance.close()
    }

    // 預設顯示上次互動的使用者
    const {
      status: getLastStatus,
      data: { lastestMsg, retCode: retCode2 }
    } = await self.$axios.post('/getlastestMsg')

    if (getLastStatus === 200 && retCode2 === 0) {
      // 判斷最後一則訊息是否已讀
      // 若為他人訊息且未讀則return 避免直接已讀
      if (lastestMsg.from !== vm.adminId && lastestMsg.unread === '0') {
        // 整理使用者列表格式
        this._sortUserList(vm)
        return false
      }

      // 預設顯示最後一次對話使用者的訊息
      const filter = lastestMsg.from === vm.adminId ? lastestMsg.to : lastestMsg.from
      const lastMsgContent = allMsg.find(msg => msg.userId === filter)

      self.currentUserMsg.msgContent = lastMsgContent || {}
      // 更新img icon顯示
      self.upadteImgIcon()
      this._sortUserList(vm)
      this._scrollToBottom(vm)
      loadingInstance.close()
    } else if (getLastStatus === 200 && retCode2 === -1) {
      self.currentUserMsg.msgContent = {}
      loadingInstance.close()
    }
  },
  // 格式化送出訊息
  _outPutMessage(vm, currentUserId, msg) {
    // 渲染發送訊息用
    const userMsgIndex = vm.allMsg.findIndex(message => {
      return message.userId === currentUserId
    })

    if (userMsgIndex !== -1) {
      vm.allMsg[userMsgIndex].msg.push(msg)
    } else {
      const mdgObj = {
        userId: currentUserId,
        msg: []
      }
      mdgObj.msg.push(msg)
      vm.allMsg.push(mdgObj)
    }
  },
  async _saveMessage(vm, from, to, type) {
    await vm.$axios.post('/addChatMessage', { tempMsg: vm.tempMsg })

    // 更改訊息為實心勾勾
    if (type === 'user') {
      vm.allMsg[0].msg.forEach(msg => {
        if (msg.from._id === from) {
          msg.isSend = true
        }
      })
    }

    if (type === 'admin') {
      vm.allMsg.forEach(msg => {
        if (msg.userId === to) {
          msg.msg.forEach(item => {
            if (item.from._id === from) {
              item.isSend = true
            }
          })
        }
      })
    }

    await vm.$axios.post('/sendMsgStatus', { from, to })

    // 清空暫存資料
    vm.tempMsg = []
    window.localStorage.removeItem(from)
  },
  // 找出最後一則訊息
  _findLastMessage(vm, selfId, otherId) {
    // 第一種： 在線即時訊息
    // 第二種： 歷史訊息
    const findUserMsg =
      vm.allMsg.find(msg => msg.userId === otherId) ||
      vm.allMsg.find(msg => msg.userId === selfId)

    const currentUserMsg = findUserMsg.msg

    // 管理者 使用者 尚未有任何互動
    if (currentUserMsg.length === 0) return false

    // 即時傳送的from(string) 與 DB讀出的from(ObjectId)不同
    // 找出自己發送最後一筆訊息的時間
    const selfMsg = currentUserMsg.filter(msg => msg.from._id === selfId)

    // 若自己尚未發出任何訊息則為0
    let selfLastMsgTime = 0
    if (selfMsg.length !== 0) {
      selfLastMsgTime = selfMsg[selfMsg.length - 1].createAt

      vm.userLastMsgTime = parseInt(selfLastMsgTime)
    }

    // 未讀訊息
    const unreadMsg = currentUserMsg.filter(msg => {
      return (
        msg.from._id === otherId &&
        parseInt(msg.createAt) >= selfLastMsgTime &&
        msg.unread === '0'
      )
    })

    if (unreadMsg.length !== 0) {
      // 顯示當前使用者未讀訊息數
      for (let i = 0; i < vm.allUsers.length; i++) {
        for (let j = 0; j < unreadMsg.length; j++) {
          if (vm.allUsers[i].userId === otherId) {
            vm.allUsers[i].unread = unreadMsg.length
          }
        }
      }
      // 未存在unread tag才添加
      if (!vm.$refs.unread) {
        unreadMsg[0].showUnreadTag = true
      }

      return false
    }

    this._scrollToBottom(vm)
  },
  // 未讀訊息數（顯示小紅點)
  async _getUserUnreadMsgCount(vm, from, to) {
    const self = vm
    const {
      status,
      data: { unreadMsgCount, retCode }
    } = await self.$axios.post('/getUnreadMsgCount', { from, to })

    if (status === 200 && retCode === 0) {
      vm.unreadMsgCount = unreadMsgCount
      return false
    }
  },
  // 顯示朋友列表
  async _getAllFriends(vm) {
    const self = vm
    const {
      status: allFriendsStatus,
      data: { friends, retCode: retCode1 }
    } = await self.$axios.get('/allFriends')

    if (allFriendsStatus === 200 && retCode1 === 0) {
      const friendList = friends.map(friend => {
        return {
          username: friend.friendId.name,
          userId: friend.friendId._id,
          socketId: '',
          loginTime: friend.loginTime,
          lastestMsg: '',
          lastMsgTime: '',
          lastMsgFrom: '',
          unread: 0
        }
      })
      self.friendList = friendList
      // 匹配socketId
      self.allUsers.forEach(online => {
        self.friendList.forEach(user => {
          if (online.userId === user.userId) {
            user.socketId = online.socketId
          }
        })
      })
      // 複製一份friendList做 filter用
      self.copyFriendList = self.friendList
      // 預設顯示上次互動的使用者
      const {
        status: lastMsgStatus,
        data: { lastestMsg, msg, retCode: retCode2 }
      } = await self.$axios.post('/getLastestMsg')

      if (lastMsgStatus === 200 && retCode2 === 0) {
        // 判斷最後一則訊息是否已讀
        if (lastestMsg.from !== vm.adminId && lastestMsg.unread === '0') return false

        const filter = lastestMsg.from === vm.adminId ? lastestMsg.to : lastestMsg.from
        const lastUser = friendList.find(friend => friend.userId === filter)
        self.currentUserMsg.titleArea = lastUser || {}
        self.currentUserId = lastUser.userId
      } else {
        console.log(msg)
      }
    } else {
      self.friendList = []
    }
  },
  // 朋友列表排序
  _sortUserList(vm) {
    // 有未讀訊息的排前面
    vm.allMsg.forEach(msg => {
      vm.friendList.forEach(friend => {
        if (msg.msg.length !== 0) {
          if (msg.userId === friend.userId) {
            msg.msg.forEach(item => {
              // 有未讀訊息且對話框未開啟
              if (
                item.unread === '0' &&
                vm.currentUserId !== item.from._id &&
                item.from._id !== vm.adminId
              ) {
                friend.unread++
              }
            })

            friend.lastestMsg = msg.msg[msg.msg.length - 1].message
            friend.lastMsgTime = msg.msg[msg.msg.length - 1].createAt
            friend.lastMsgFrom = msg.msg[msg.msg.length - 1].from._id
          }
        }
      })
    })

    vm.friendList = _orderby(vm.friendList, ['lastMsgTime', 'unread'], ['desc', 'desc'])
  },
  // 送出消息後移至底部
  _scrollToBottom(vm) {
    vm.$nextTick(() => {
      // scroll to bottom
      const chatMessageWrapper = vm.$refs.msgContent

      if (chatMessageWrapper) {
        chatMessageWrapper.scrollTop = chatMessageWrapper.scrollHeight
      }
    })
  },
  // 開啟對話框後移至未讀區域
  _scrollToUnread(vm, type) {
    vm.$nextTick(() => {
      // const unreadTag = document.getElementById('unread')
      const unreadTag = vm.$refs.unread
      const chatMessageWrapper = vm.$refs.msgContent

      // 非position:fixed的狀況
      if (type === 'admin' && unreadTag) {
        unreadTag[0].scrollIntoView({ behavior: 'auto', block: 'center' })
        return false
      }

      // position:fixed的狀況
      chatMessageWrapper.scrollTo(
        0,
        unreadTag[0].offsetTop - chatMessageWrapper.offsetHeight
      )
    })
  },
  _debounceSengMsg(vm, fn, wait) {
    const self = vm

    return function() {
      const ctx = this
      const args = arguments
      if (self.debounceTimer) clearTimeout(self.debounceTimer)
      self.debounceTimer = setTimeout(() => {
        fn.apply(ctx, args)
      }, wait)
    }
  },
  // 隨滾動顯示訊息時間段
  _showTimeSection(vm) {
    // console.log(vm.$refs.timeSection[0].getBoundingClientRect().top)
    const timeSection = document.getElementsByClassName('msg_time')

    const parent = vm.$refs.msgContent

    parent.addEventListener('scroll', e => {
      console.log(e.target.scrollTop)
      const scrollTop = e.target.scrollTop

      const corArray = [] // 紀錄每個unreadTag 相對座標

      const timeSectionArray = Array.apply(null, timeSection) // nodelist to array
      timeSectionArray.forEach(time =>
        corArray.push(this._absolutePosition(time).y - 205)
      )

      const abstractCorArray = [] // unreadTag之間相差的距離
      const resultArray = [] // 最後計算結果

      for (let i = 0; i < corArray.length; i++) {
        if (corArray[i + 1]) {
          abstractCorArray.push(corArray[i + 1] - corArray[i])
        }
      }

      for (let i = 0; i < abstractCorArray.length; i++) {
        if (i === 0) {
          resultArray.push({
            showTime: timeSection[0].children[0].textContent.split(' ')[0],
            timeSection: [0, abstractCorArray[i]]
          })
        }

        if (abstractCorArray[i + 1]) {
          if (timeSection[i + 1]) {
            resultArray.push({
              showTime: timeSection[i + 1].children[0].textContent.split(' ')[0],
              timeSection: [abstractCorArray[i], abstractCorArray[i + 1]]
            })
          }
        }
      }

      let showTime = ''
      for (let i = 0; i < resultArray.length; i++) {
        if (
          scrollTop > resultArray[i].timeSection[0] &&
          scrollTop < resultArray[i].timeSection[1]
        ) {
          showTime = resultArray[i].showTime
          break
        }
      }

      // const lastTagScrollTop = abstractCorArray.reduce((a, b) => a + b) + 400
      const lastTagScrollTop =
        this._absolutePosition(timeSection[timeSection.length - 1]).y - 205

      if (scrollTop > lastTagScrollTop) {
        const last = timeSection.length - 1
        showTime = timeSection[last].children[0].textContent.split(' ')[0]
      }
      // 計算最後一個tag與上一個tag的差值
      if (
        scrollTop < lastTagScrollTop &&
        scrollTop > this._absolutePosition(timeSection[timeSection.length - 2]).y - 205
      ) {
        const last = timeSection.length - 2
        showTime = timeSection[last].children[0].textContent.split(' ')[0]
      }
      // 小於第一個tag
      if (scrollTop < abstractCorArray[0]) {
        showTime = timeSection[0].children[0].textContent.split(' ')[0]
      }

      vm.fixedShowTime = showTime

      console.log(showTime)
    })
  },
  _absolutePosition(element) {
    let x = 0
    let y = 0
    // 搭配上面的示意圖可比較輕鬆理解為何要這麼計算
    while (element) {
      x += element.offsetLeft - element.scrollLeft + element.clientLeft
      y += element.offsetTop - element.scrollLeft + element.clientTop
      // 這邊有個重點，當父元素被下了 position 屬性之後他就會變成 offsetParent，所以這邊我們用迴圈不斷往上累加。
      element = element.offsetParent
    }

    return { x, y }
  }
}
