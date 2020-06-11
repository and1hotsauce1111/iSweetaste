const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getAdminId
} = require('./socket-users')

module.exports = {
  socketInit(io) {
    io.on('connection', socket => {
      // user join
      const chatbotName = 'Sweetaste'
      socket.on('userJoin', userInfo => {
        console.log('user join')
        // console.log(userInfo)
        userInfo['socketId'] = socket.id
        // console.log(userInfo)

        const user = userJoin(userInfo)
        if (!user) return false
        socket.join(user.room)
        // send all userlist to admin
        io.to(user.room).emit('getAllUser', getRoomUsers(user.room))
      })

      // listen on user message
      socket.on('sendToAdmin', msgInfo => {
        console.log('send to admin')

        const id = getAdminId()
        // console.log(id)

        // 判斷是否在線
        if (!id) return false
        io.to(id).emit('msgFromUser', {
          msg: msgInfo
          // socketId: socket.id,
        })
      })

      // listen on admin message
      socket.on('sendToUser', msgInfo => {
        console.log('send to user')

        const user = getCurrentUser(msgInfo.to._id)
        // console.log(user)

        if (!user) return false
        let socketId = user.socketId
        io.to(socketId).emit('msgFromAdmin', msgInfo)
      })

      // 監聽已讀訊息事件
      socket.on('userReadMsg', (from, to) => {
        const user = getCurrentUser(to)
        // console.log(user)

        if (!user) return false
        let socketId = user.socketId
        io.to(socketId).emit('readFromUser', from)
      })

      socket.on('adminReadMsg', (from, to) => {
        const user = getCurrentUser(to)
        // console.log(user)

        if (!user) return false
        let socketId = user.socketId
        io.to(socketId).emit('readFromAdmin', from)
      })

      // user disconnect
      socket.on('disconnect', () => {
        console.log('disconnect')
        const user = userLeave(socket.id)
        if (user) {
          // send all userlist to admin
          io.to(user.room).emit('getAllUser', getRoomUsers(user.room), user)
        }
      })
    })
  }
}
