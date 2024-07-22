import React, { useContext, useEffect, useRef, useState } from 'react'
import { socket } from '../socket'
import { NameContext } from './Landing';

const Chat = () => {
  const [msg, setMsg] = useState("");
  const [waiting,setWaiting] = useState(false);
  const msgList = useRef();
  const {username,setChat}= useContext(NameContext);
  useEffect(()=>{
    setWaiting(true)
    socket.connect();

    socket.emit('initialize',{name:username})
    socket.emit('join')

    function userJoined({message}){
      setWaiting(false);
      document.querySelector('.initial').textContent=message;
    }

    function userLeft({message}){
      document.querySelector('.initial').textContent=message;
    }

    function recieveMsg({name, message}){
      addMessage(name,message);
    }
    socket.on('user-joined',userJoined)
    socket.on('user-left',userLeft)
    socket.on('recieve-msg',recieveMsg)
    return () => {
      // we mention method name with socket.off because it will
      // remove only those event listener with the given method
      // signature
      console.log("Connection closed and Unmounted");
      socket.off('user-joined',userJoined)
      socket.off('user-left',userLeft)
      socket.off('recieve-msg',recieveMsg)
      socket.disconnect()
    }
  },[])
  function handleChange(e){
    setMsg(e.target.value);
  }
  function handleSend(){
    if (msg.trim().length === 0) return;
    addMessage(username,msg);
    socket.emit('msg',{message:msg})
    setMsg("");
  }
  function addMessage(name,message){
    const child = document.createElement('li');
    console.log(message)
    child.textContent=`${name}:${message}`
    msgList.current.appendChild(child)
  }
  return (
    <>
    <h3>Your name: {username} </h3>
    <div className='message-box'>
    <div className="message-list">
      <ul ref={msgList} className="messages">
      </ul>
    </div>
    <div className='initial'></div>
    {waiting && <div>Waiting for someone to join...</div>}
      <input type="text" onChange={handleChange} value={msg}/>
      <button onClick={handleSend}> send </button>
    </div>
    <div>
    <button onClick={()=>setChat(false)}>Leave Chat</button>
    </div>
    </>
  )
}

export default Chat
