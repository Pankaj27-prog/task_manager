const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const uri = process.env.MONGODB_URI;
//console.log("MONGODB_URI:", process.env.MONGODB_URI);

const connectDB = () => {
  return mongoose.connect(uri);
}

module.exports = connectDB;