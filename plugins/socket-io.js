import io from 'socket.io-client'
const socket = io({ reconnection: true })

export default socket
