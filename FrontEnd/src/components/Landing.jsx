import React, { useState } from "react";
import "../css/Landing.css";
import Chat from "./Chat";
import { LuVenetianMask } from "react-icons/lu";
import { FaArrowRightLong } from "react-icons/fa6";
import { NameContext } from "../context/nameContext";

const Landing = () => {
  const [chat, setChat] = useState(false);
  const [username, setUsername] = useState("");
  const [err, setErr] = useState({
    message: "Please enter a name!!",
    visible: false,
  });

  function handleName(e) {
    setUsername(e.target.value);
  }
  function validate() {
    if (username.trim().length === 0) {
      setErr({ ...err, visible: true });
    } else {
      setErr({ ...err, visible: false });
      setChat(!chat);
    }
  }
  return (
      <div className="chat-container">
        <div className="header">
          <div className="mask">
            <LuVenetianMask />
          </div>
          <h2> AnyChat </h2>
          <h3>Chat with Strangers Anonymously</h3>
        </div>
        {!chat && (
          <div className="menu">
            <div className="err">
              {err.visible && <div className="err-msg">{err.message}</div>}
            </div>
            <input
              id="username"
              type="text"
              name="username"
              value={username}
              onChange={handleName}
              placeholder="Choose a Name"
          autoComplete="off"
            />
            <div>
              <button className="chat-btn" onClick={validate}>
                Go to Chat{" "}
                <span className="arr">
                  <FaArrowRightLong />
                </span>
              </button>
            </div>
          </div>
        )}
        {/* {!chat && <button>Chat With Someone</button>} */}
        <NameContext.Provider value={{ username, setChat }}>
          {chat && <Chat />}
        </NameContext.Provider>
    </div>
  );
};

export default Landing;
