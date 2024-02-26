const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

// pre hooks for bcrypt password

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    const hashedPassword = await bcrypt.hash(this.password, 5);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// compare bcrypt password

userSchema.methods.comparePass = async function (password) {
  return bcrypt.compare(password, this.password);
};

// jwt access token

userSchema.methods.accessToken = async function () {
  return jwt.sign(
    {
      userEmail: this.email,
      userId: this._id,
    },
    process.env.ACCESS_SECRET_KEY,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// jwt refresh token

userSchema.methods.refreshToken = async function () {
  return jwt.sign(
    {
      userEmail: this.email,
      userId: this._id,
    },
    process.env.REFRESH_SECRET_KEY,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

const UserModel = mongoose.model("User", userSchema);

module.exports = { UserModel };
