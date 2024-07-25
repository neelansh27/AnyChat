import { io } from 'socket.io-client'
const url = import.meta.env.VITE_BACK_URL

// By default, the Socket.IO client opens a connection to the server right away. 
// We can prevent this behavior with the autoConnect option
export const socket = io(url,{
  autoConnect: false
})


