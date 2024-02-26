const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

//connection to db with express server
const connectionToDb = mongoose.connect(process.env.MONGODB_URL);

module.exports = { connectionToDb };
