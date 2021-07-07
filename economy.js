const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
  userID: String,
  balance: Number,
  item: Object
})