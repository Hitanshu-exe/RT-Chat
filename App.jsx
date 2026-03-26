import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("chat", (data) => {
      setChat((prev) => [...prev, data]);
    });

    return () => socket.off("chat");
  }, []);

  const joinChat = () => {
    if (username.trim()) {
      socket.emit("join", username);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("sendMessage", message);
      setMessage("");
    }
  };

  return (
    <div className="container">
      {!joined ? (
        <div className="join">
          <h2>Join Chat</h2>
          <input
            placeholder="Enter name"
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={joinChat}>Join</button>
        </div>
      ) : (
        <div className="chat-box">
          <h2>Chat Room</h2>
          <div className="messages">
            {chat.map((msg, index) => (
              <p key={index}>
                <strong>{msg.user}:</strong> {msg.message}
              </p>
            ))}
          </div>
          <div className="input-box">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type message..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;