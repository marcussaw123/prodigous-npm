const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
  time: Number,
  userID: String,
})
module.exports = mongoose.model("voice", Schema)