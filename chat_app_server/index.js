const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cookieParser = require("cookie-parser");
const { userRouter } = require("./routes/user.routes");
const { connectionToDb } = require("./config/db");
const cors = require("cors");

//http server
const http = require("http");

// express server
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://127.0.0.1:5173","https://chat-app-p3qq.onrender.com"],
    credentials: true,
  })
);

const server = http.createServer(app);

//router

app.use("/users", userRouter);

server.listen(process.env.PORT, () => {
  try {
    connectionToDb
      .then((res) => console.log(`connection successfully`))
      .catch((err) => console.log(err));
    console.log(`server is running on port ${process.env.PORT}`);
  } catch (error) {
    console.log(error);
  }
});
