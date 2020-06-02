// all connected users
const users = []

// Join user to chat
function userJoin(socketId, userId, username, room, unread) {
  const user = { socketId, userId, username, room, unread }
  const existUser = users.find(user => user.socketId === socketId)
  if (!existUser) {
    users.push(user)
    return user
  }
  return existUser
}

function getCurrentUser(id) {
  return users.find(user => user.userId === id)
}

function userLeave(id) {
  const index = users.findIndex(user => user.socketId === id)
  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

function getRoomUsers(room) {
  return users.filter(user => user.room === room)
}

function getAdminId() {
  const admin = users.find(user => user.username === 'admin')
  if (admin) return admin.socketId
  return ''
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getAdminId
}
