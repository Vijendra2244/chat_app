const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const { userRouter } = require("./routes/user.routes");
const { connectionToDb } = require("./config/db");
const cors = require("cors");
const { Server } = require("socket.io");
const http = require("http");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5173",
      "https://chat-app-p3qq.onrender.com",
      "https://mychatapp010.netlify.app",
    ],
    credentials: true,
  })
);

const server = http.createServer(app);
const io = new Server(server);

// Maintain a mapping of connected users
let connectedUsers = {};

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Listen for user authentication
  socket.on("join", (username) => {
    connectedUsers[socket.id] = username;
    // Notify other users about the new user joining
    socket.broadcast.emit("userJoined", { userId: socket.id, username });
    // Update user list for all clients
    io.emit("updateUserList", Object.values(connectedUsers));
  });

  // Listen for messages
  socket.on("message", (data) => {
    const { receiverId, message } = data;
    // Send the message to the receiver only
    io.to(receiverId).emit("message", { senderId: socket.id, message });
  });

  // Listen for disconnection
  socket.on("disconnect", () => {
    const username = connectedUsers[socket.id];
    delete connectedUsers[socket.id];
    // Notify other users about the disconnected user
    socket.broadcast.emit("userLeft", { userId: socket.id, username });
    // Update user list for all clients
    io.emit("updateUserList", Object.values(connectedUsers));
  });
});


app.use("/users", userRouter);

server.listen(process.env.PORT, () => {
  try {
    connectionToDb
      .then((res) => console.log(`Connection successfully`))
      .catch((err) => console.log(err));
    console.log(`Server is running on port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
