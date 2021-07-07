const colors = require('kolors-logger')
const Discord = require('discord.js')
const mongoose = require('mongoose')
function sendMessage(messageClient, messageToSend) {
  let message = messageClient
  let msg = messageToSend
  message.channel.send(msg)
}
async function ButtonPaginator(embeds, buttons, message, MessageButton, client, MessageActionRow) {
if(Array.isArray(embeds) !== true) return colors.red("Embeds need to be in an array")
if(embeds.length > 2) return colors.red("Embeds need to be 2 or more")
if(typeof(buttons) !== "object") return colors.red("Buttons need to be in an object array")
if(!message) return colors.red("Need to parse in the message client")
if(!MessageButton) return colors.red("Need to parse in the button client")
if(buttons.length === 0) return colors.red("Need two buttons")
if(buttons.length > 2) return colors.red("Button limit is 2")
if(buttons[0].label === undefined || buttons[0].color === undefined || buttons[1].label === undefined || buttons[1].color === undefined) {
  return colors.red("Need an label and a color for each of the buttons")
}
const btn = new MessageButton()
.setID('front')
const btn2 = new MessageButton()
.setID('back')
if(buttons[0].color.toLowerCase() === 'blurple') {
  btn.setStyle("blurple")
} else if(buttons[0].color.toLowerCase() === 'red') {
  btn.setStyle("red")
} else if(buttons[0].color.toLowerCase() === 'gray') {
  btn.setStyle("gray")
} else if(buttons[0].color.toLowerCase() === 'green') {
  btn.setStyle("green")
} else {
  return colors.red("Invalid color (first button): Avaliable color => blurple, red, gray, green")
}
if(buttons[1].color.toLowerCase() === 'blurple') {
  btn2.setStyle("blurple")
} else if(buttons[1].color.toLowerCase() === 'red') {
  btn2.setStyle("red")
} else if(buttons[1].color.toLowerCase() === 'gray') {
  btn2.setStyle("gray")
} else if(buttons[1].color.toLowerCase() === 'green') {
  btn2.setStyle("green")
} else {
  return colors.red("Invalid color (second button): Avaliable color => blurple, red, gray, green")
}
btn.setLabel(buttons[0].label)
btn2.setDisabled(true)
btn2.setLabel(buttons[1].label)
if(buttons[0].emoji) {
  btn.setEmoji(buttons[0].emoji)
} 
if(buttons[1].emoji) {
btn2.setEmoji(buttons[1].emoji)
}
const row = new MessageActionRow()
.addComponents(btn, btn2)
let embed_length = embeds.length - 1
let counter = 0
message.channel.send({embed: embeds[0], component: row})
 client.on("clickButton", async(button) => {
   await button.reply.defer()
   if(button.id === 'front') {
     colors.green("User clicked on front")
     if(counter >= embed_length) {
       colors.red("REACHED LIMIT")
       await btn.setDisabled(true)
       await btn2.setDisabled(false)
       let newRow = new MessageActionRow()
       .addComponents(btn, btn2)
       button.message.edit({embed: embeds[0], component: newRow})
     } else {
       await counter++
     button.message.edit({embed: embeds[counter], component: row})
     }
   } else if(button.id === 'back') {
     colors.green("user clicked on back")
     await counter--
     button.message.edit({embed: embeds[counter], component: row})
   }
 })
}
async function connect(mongodbURI) {
  if(!mongodbURI) return colors.red("Include mongodb URI")
  await mongoose.connect(mongodbURI, {
    useNewUrlParser: true, 
    useUnifiedTopology: true
  }).then(() => colors.green("MongoDB connected => prodigous package")).catch((err) => {
    throw new Error(err)
  })
}
async function balanceCommand(userID) {
  
}
async function leaderboardCommand() {

}
async function blackjackCommand() {

}
async function shopCommand() {

}
async function start() {

}
async function giveCommand() {

}
async function addCommand() {

}
async function resetAll() {

}
async function resetCommand() {

}
async function fightCommand() {

}
async function 
module.exports = { sendMessage, ButtonPaginator }