const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
  total: Number,
  userID: String
})
module.exports = mongoose.model("message", Schema)