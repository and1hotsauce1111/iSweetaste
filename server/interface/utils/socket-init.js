const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getAdminId
} = require('./socket-users')

const formatMessage = require('./format-message')

module.exports = {
  socketInit(io) {
    io.on('connection', socket => {
      // user join
      const chatbotName = 'Sweetaste'
      socket.on('userJoin', ({ userId, username, room, unread }) => {
        console.log('user join')
        const user = userJoin(socket.id, userId, username, room, unread)
        if (!user) return false
        socket.join(user.room)
        // welcome message
        // io.to(socket.id).emit(
        //   'welcomeMessage',
        //   formatMessage(chatbotName, '您好，歡迎來到Sweetaste')
        // )
        // send all userlist to admin
        io.to(room).emit('getAllUser', getRoomUsers(room))
      })

      // listen on user message
      socket.on('sendToAdmin', ({ userId, username, msg }) => {
        const id = getAdminId()
        // 判斷是否在線
        if (!id) return false
        io.to(id).emit('msgFromUser', {
          msg: formatMessage(username, msg),
          // socketId: socket.id,
          userId
        })
      })

      // listen on admin message
      socket.on('sendToUser', ({ id, msg }) => {
        console.log('sendToUser')

        const user = getCurrentUser(id)
        if (!user) return false
        let socketId = user.socketId
        io.to(socketId).emit('msgFromAdmin', formatMessage('admin', msg))
      })

      // user disconnect
      socket.on('disconnect', () => {
        console.log('disconnect')
        const user = userLeave(socket.id)
        if (user) {
          // send all userlist to admin
          io.to(user.room).emit('getAllUser', getRoomUsers(user.room))
        }
      })
    })
  }
}
