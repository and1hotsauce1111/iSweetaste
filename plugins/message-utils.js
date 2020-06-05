import Vue from 'vue'

Vue.prototype.$messageHandler = {
  // this 指向$messageHandler
  _sendMessage(vm, socket, msgInfo) {
    // 判斷當前用戶是否在線
    const currentUser = vm.allUsers.find(user => user.userId !== vm.currentUserId)

    if (vm.sendMsg !== '') {
      if (currentUser && currentUser.socketId !== '') {
        // 使用者在線
        socket.emit('sendToAdmin', msgInfo)

        // 記錄到待送訊息區
        vm.tempMsg.push(msgInfo)
        this._outPutMessage(vm, vm.currentUserId, msgInfo)
        // 存一份到localstorage
        window.localStorage.setItem(msgInfo.from, vm.tempMsg)
        // 存進DB
        this._throttleApiFn(vm, msgInfo.from, msgInfo.to)
        // 清空輸入框
        vm.sendMsg = ''
        this._scrollToBottom(vm)
      } else {
        vm.tempMsg.push(msgInfo)
        this._outPutMessage(vm, vm.currentUserId, msgInfo)
        window.localStorage.setItem(msgInfo.from, vm.tempMsg)
        this._throttleApiFn(vm, msgInfo.from, msgInfo.to)
        vm.sendMsg = ''
        this._scrollToBottom(vm)
      }
    }
  },
  async _getHistoryMessage(vm) {
    const self = vm
    if (self.adminInfo.length === 0) return false
    const {
      status,
      data: { allMsg, retCode }
    } = await self.$axios.post('/historyMessage', {
      from: self.currentUserId,
      to: self.adminInfo[0]._id
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

        allMsg.forEach(message => {
          message.msg.forEach(msg => {
            this._outPutMessage(vm, message.userId, msg)
          })

          // 顯示小紅點
          // const unreadMessage = message.msg.filter(msg => {
          //   return msg.from !== self.currentUserId && msg.unread === '0'
          // })

          // for (let i = 0; i < unreadMessage.length; i++) {
          //   for (let j = 0; j < self.allUsers.length; j++) {
          //     if (unreadMessage[i].to === self.allUsers[j].userId) {
          //       self.allUsers[j].unread++
          //     }
          //   }
          // }
        })

        // 未讀訊息
        this._findLastMessage(vm, self.currentUserId)
      }
    }
  },
  _getAllHistoryMessage(vm) {},
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
  // _outPutMessage(vm, currentUserId, msg) {
  //   // 渲染歷史訊息用
  //   if (!vm.hasHistoryMsg && vm.allMsg.length === 0) {
  //     // 沒有歷史訊息
  //     const msgObj = {}
  //     Object.defineProperty(msgObj, currentUserId, {
  //       enumerable: true,
  //       configurable: true,
  //       writable: true
  //     })
  //     msgObj[currentUserId] = {
  //       msg: [msg]
  //     }
  //     vm.allMsg.push(msgObj)

  //     this._scrollToBottom(vm)
  //     return false
  //   }

  //   // 渲染發送訊息用
  //   const userMsgIndex = vm.allMsg.findIndex(message => {
  //     return Object.keys(message)[0] === currentUserId
  //   })

  //   if (userMsgIndex !== -1) {
  //     vm.allMsg[userMsgIndex][currentUserId].msg.push(msg)
  //   } else {
  //     const msgObj = {}
  //     Object.defineProperty(msgObj, currentUserId, {
  //       enumerable: true,
  //       configurable: true,
  //       writable: true
  //     })
  //     msgObj[currentUserId] = {
  //       msg: [msg]
  //     }
  //     vm.allMsg.push(msgObj)
  //   }

  //   this._scrollToBottom(vm)
  // },
  async _saveMessage(vm, id) {
    await vm.$axios.post('/addChatMessage', { tempMsg: vm.tempMsg })

    // 清空暫存資料
    vm.tempMsg = []
    window.localStorage.removeItem(id)
  },
  _findLastMessage(vm, userId) {
    // 第一種： 在線即時訊息
    // 第二種： 歷史訊息
    const findUserMsg = vm.allMsg.find(msg => msg.userId === userId)

    const currentUserMsg = findUserMsg.msg

    // 管理者 使用者 尚未有任何互動
    if (currentUserMsg.length === 0) return false

    // 找出自己發送最後一筆訊息的時間
    const selfMsg = currentUserMsg.filter(msg => msg.from._id === userId)

    const selfLastMsgTime = selfMsg[selfMsg.length - 1].createAt
    vm.userLastMsgTime = parseInt(selfLastMsgTime)

    // 未讀訊息
    const unreadMsg = currentUserMsg.filter(msg => {
      return (
        msg.from._id !== userId &&
        parseInt(msg.createAt) >= selfLastMsgTime &&
        msg.unread === '0'
      )
    })

    if (unreadMsg.length !== 0) {
      // 顯示當前使用者未讀訊息數
      for (let i = 0; i < vm.allUsers.length; i++) {
        for (let j = 0; j < unreadMsg.length; j++) {
          if (vm.allUsers[i].userId === unreadMsg[j].to) {
            vm.allUsers[i].unread++
          }
        }
      }
      unreadMsg[0].showUnreadTag = true
      // 移動捲軸到相對應位置
      this._scrollToUnread(vm)
    } else {
      this._scrollToBottom(vm)
    }
  },
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
  async _getAllFriends(vm) {
    const self = vm
    const {
      status,
      data: { friends, retCode }
    } = await self.$axios.get('/allFriends')
    if (status === 200 && retCode === 0) {
      const friendList = friends.map(friend => {
        return {
          username: friend.friendId.name,
          userId: friend.friendId._id,
          socketId: '',
          loginTime: friend.loginTime,
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
      // 預設顯示第一個使用者
      // self.currentUserMsg.titleArea = friendList[0]
      // userList 排序
      this._sortUserList()
    }
  },
  async _sortUserList() {
    // 有未讀訊息的排前面
  },
  _scrollToBottom(vm) {
    vm.$nextTick(() => {
      // scroll to bottom
      const chatMessageWrapper = vm.$refs.msgContent

      if (chatMessageWrapper) {
        chatMessageWrapper.scrollTop = chatMessageWrapper.scrollHeight
      }
    })
  },
  _scrollToUnread(vm) {
    vm.$nextTick(() => {
      const unreadTag = vm.$refs.unread
      const chatMessageWrapper = this.$refs.msgContent

      if (unreadTag && chatMessageWrapper) {
        chatMessageWrapper.scrollTo(
          0,
          unreadTag[0].offsetTop - chatMessageWrapper.offsetTop - 50
        )
      }
    })
  },
  _formatTime() {},
  _throttleApiFn(vm, from, to) {
    if (vm.throttleTimer) return
    const self = this

    vm.throttleTimer = setTimeout(async () => {
      self._saveMessage(vm, from)
      vm.throttleTimer = null
      // 更改訊息為實心勾勾
      vm.allMsg[0].msg.forEach(msg => {
        if (msg.from === from) {
          msg.isSend = true
        }
      })

      await vm.$axios.post('/sendMsgSucceed', { from, to })
    }, 2000)
  }
}
