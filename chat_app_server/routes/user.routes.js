const express = require("express");
const {
  userLogin,
  userRegister,
  userLogout,
} = require("../controllers/user.controllers");

const userRouter = express.Router();

userRouter.route("/login").post(userLogin);
userRouter.route("/register").post(userRegister);
userRouter.route("/logout").post(userLogout);

module.exports = { userRouter };
