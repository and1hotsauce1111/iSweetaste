import Vue from 'vue'
import _orderby from 'lodash.orderby'

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
        // 存進DB
        // this._throttleApiFn(vm, msgInfo.from._id, msgInfo.to._id, type)
        this._debounceSengMsg(vm, this._saveMessage, 1500)(
          vm,
          msgInfo.from._id,
          msgInfo.to._id,
          type
        )

        // 清空輸入框
        vm.sendMsg = ''
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
        // this._throttleApiFn(vm, msgInfo.from._id, msgInfo.to._id, type)
        this._debounceSengMsg(vm, this._saveMessage, 1500)(
          vm,
          msgInfo.from._id,
          msgInfo.to._id,
          type
        )
        vm.sendMsg = ''
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
  // 取得歷史訊息
  async _getHistoryMessage(vm) {
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
    if (status === 200 && allMsg.length === 0 && retCode === -1) return false

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

        this._findLastMessage(vm, self.currentUserId, self.adminInfo[0]._id)
        // self.readMsg()
      }
    }
  },
  async _getAllHistoryMessage(vm, adminId) {
    const self = vm
    const {
      status: getMsgStatus,
      data: { allMsg, retCode: retCode1 }
    } = await self.$axios.post('/allHistoryMessage', { adminId })

    self.allMsg = allMsg

    // console.log(self.allMsg)

    let hasHistoryMsg = 0
    allMsg.forEach(msg => {
      if (msg.msg.length !== 0) {
        hasHistoryMsg++
      }
    })

    // 查無歷史訊息
    if (getMsgStatus === 200 && hasHistoryMsg === 0 && retCode1 === -1) return false
    if (getMsgStatus === 200 && hasHistoryMsg > 0 && retCode1 === 0) {
      self.allMsg = allMsg
      self.hasHistoryMsg = true
      // 顯示未讀訊息tag
      self.allMsg.forEach(msg => {
        this._findLastMessage(vm, vm.loginId, msg.userId)
      })
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
    } else if (getLastStatus === 200 && retCode2 === -1) {
      self.currentUserMsg.msgContent = {}
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

      this._scrollToUnread(vm)
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
    // console.log('sort friend')

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
                // console.log('add unread')

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
  _scrollToUnread(vm) {
    vm.$nextTick(() => {
      const unreadTag = vm.$refs.unread
      const chatMessageWrapper = vm.$refs.msgContent

      if (unreadTag && chatMessageWrapper) {
        let moveY = 0
        let userMsg = []
        let unreadMsgIndex = 0
        // 區分來源是管理者或使用者
        if (vm.currentUserMsg) {
          userMsg = vm.currentUserMsg.msgContent.msg
          unreadMsgIndex = userMsg.findIndex(msg => msg.showUnreadTag)
        } else {
          userMsg = vm.allMsg[0].msg
          unreadMsgIndex = userMsg.findIndex(msg => msg.showUnreadTag)
        }

        for (let i = 0; i < userMsg.length; i++) {
          if (i < unreadMsgIndex) {
            moveY += 44
          }
        }

        chatMessageWrapper.scrollTo(0, moveY)
      }
    })
  },
  // 儲存訊息節流函數
  _throttleApiFn(vm, from, to, type) {
    if (vm.throttleTimer) return
    const self = this

    vm.throttleTimer = setTimeout(() => {
      self._saveMessage(vm, from, to, type)
      vm.throttleTimer = null
    }, 2000)
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
  }
}
