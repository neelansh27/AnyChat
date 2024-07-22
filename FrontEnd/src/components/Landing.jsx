import React, { useState, createContext } from "react";
import Chat from "./Chat";

const NameContext = createContext("");

const Landing = () => {
  const [chat, setChat] = useState(false);
  const [username, setUsername] = useState("");

  function handleName(e) {
    setUsername(e.target.value);
  }
  return (
    <div>
      <h2>Welcome to AnyChat</h2>
      <h3>Chat with Strangers Anonymously</h3>
      {!chat && (
        <div>
          <input
            id="username"
            type="text"
            name="username"
            value={username}
            onChange={handleName}
            placeholder="Choose a Name"
          />
          <div>
            <button onClick={() => setChat(!chat)}>Go to Chat</button>
          </div>
        </div>
      )}
      {/* {!chat && <button>Chat With Someone</button>} */}
      <NameContext.Provider value={{username,setChat}}>
        {chat && <Chat />}
      </NameContext.Provider>
    </div>
  );
};

export default Landing;
export { NameContext }
