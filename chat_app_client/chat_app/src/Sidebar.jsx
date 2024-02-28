// Sidebar.js
import React from "react";

function Sidebar({ users, onUserSelect }) {
  return (
    <div className="sidebar">
      <h2>Online Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.userId} onClick={() => onUserSelect(user)}>
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
