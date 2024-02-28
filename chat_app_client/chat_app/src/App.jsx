// Update App.js to include Login and handle login events

import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import Sidebar from "./Sidebar";
import Chat from "./Chat";
import Login from "./Login";

const socket = io("http://localhost:8080/", { transports: ["websocket"] });

function App() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    // Fetch users or user list from backend
    socket.on("updateUserList", (users) => {
      setUsers(users);
    });

    socket.on("userLoggedIn", ({ userId, username }) => {
      setUsers((prevUsers) => [...prevUsers, { userId, username }]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleSendMessage = (message) => {
    socket.emit("message", { receiverId: selectedUser.userId, message });
  };

  const handleLogin = (user) => {
    setLoggedInUser(user);
    socket.emit("join", user.username);
  };

  return (
    <div className="app">
      {!loggedInUser ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <Sidebar users={users} onUserSelect={handleUserSelect} />
          {selectedUser && (
            <Chat
              selectedUser={selectedUser}
              onMessageSend={handleSendMessage}
            />
          )}
        </>
      )}
    </div>
  );
}

export default App;
