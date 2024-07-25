import React, { useContext, useEffect, useRef, useState } from "react";
import { socket } from "../socket";
import { NameContext } from "../context/nameContext";
import { IoIosSend } from "react-icons/io";
import { IoExitOutline } from "react-icons/io5";
import "../css/Chat.css";

const Chat = () => {
  const [msg, setMsg] = useState("");
  const [waiting, setWaiting] = useState(false);
  const msgList = useRef();
  const { username, setChat } = useContext(NameContext);
  useEffect(() => {
    setWaiting(true);
    socket.connect();

    socket.emit("initialize", { name: username });
    socket.emit("join");
    function userJoined({ message }) {
      setWaiting(false);
      addMessage("System", message);
    }

    function userLeft({ message }) {
      addMessage("System", message);
    }

    function recieveMsg({ name, message }) {
      addMessage(name, message, "recieved");
    }
    socket.on("user-joined", userJoined);
    socket.on("user-left", userLeft);
    socket.on("recieve-msg", recieveMsg);
    return () => {
      // we mention method name with socket.off because it will
      // remove only those event listener with the given method
      // signature
      console.log("Connection closed and Unmounted");
      socket.off("user-joined", userJoined);
      socket.off("user-left", userLeft);
      socket.off("recieve-msg", recieveMsg);
      socket.disconnect();
    };
  }, []);
  function handlePress(e) {
    if (e.keyCode === 13 && e.shiftKey) {
      // Prevented enter key behavior
      e.preventDefault();
      handleSend();
    }
  }
  function handleChange(e) {
    setMsg(e.target.value);
  }
  function handleSend() {
    if (msg.trim().length === 0) return;
    addMessage(username, msg, "");
    socket.emit("msg", { message: msg });
    setMsg("");
  }
  function addMessage(name, message, spclClass = "") {
    const child = document.createElement("li");
    const sender = document.createElement("div");
    const content = document.createElement("div");
    child.classList.add("message");
    if (spclClass) child.classList.add(spclClass);
    sender.textContent = name;
    content.textContent = message;
    child.appendChild(sender);
    child.appendChild(content);
    msgList.current.appendChild(child);

    // Scrolling to bottom
    const list = document.querySelector(".cont");
    list.scrollTop = list.scrollHeight;
  }
  return (
    <>
        <div className="control">
          <button id="leave" onClick={() => setChat(false)}>
            Leave <IoExitOutline />
          </button>
        </div>
      <div className="cont">
        {/* <h3>Your name: {username} </h3> */}
        {waiting && <h3>Waiting for someone to join...</h3>}
        <div className="message-box">
            <div className="message-list">
              <ul ref={msgList} className="messages"></ul>
            </div>
        </div>
        <div>
          <div className="input-box">
            <textarea
              placeholder="Use shift enter to send"
              type="text"
              id="message"
              onKeyDown={handlePress}
              onChange={handleChange}
              value={msg}
            ></textarea>
            <button onClick={handleSend} id="send" disabled={waiting}>
              <IoIosSend />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
