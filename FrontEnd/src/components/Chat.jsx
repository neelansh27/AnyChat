import React, { useEffect, useState } from 'react'
import { socket } from '../socket'

const Chat = () => {
  const [msg, setMsg] = useState("");
  useEffect(()=>{
    socket.connect();
    console.log(socket.connected)
    socket.on('response',(msg)=>{
      console.log(msg)
    })
  },[])
  function handleChange(e){
    setMsg(e.target.value);
  }
  function handleSend(){
    socket.emit('msg',{msg:msg})
    setMsg("");
  }
  return (
    <div className='message-box'>
      <input type="text" onChange={handleChange} value={msg}/>
      <button onClick={handleSend}> send </button>
    </div>
  )
}

export default Chat
