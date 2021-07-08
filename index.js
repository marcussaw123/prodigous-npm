const colors = require('kolors-logger')
const Discord = require('discord.js')
const mongoose = require('mongoose')
const db = require('./models/economy')
const bin = require('sourcebin')
require('dotenv')
let isConnected = false
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
  }).then(() => {
    colors.cyan("mongodb connected -> prodigous package")
    isConnected = true
  }).catch((err) => {
    throw new Error(err)
  })
}
async function balanceCommand(messageClient) {
  if(isConnected !== true) return colors.red("ERROR: Connect to mongodb first!")
  const message = messageClient
 const userID = message.author.id
  if(!messageClient) return colors.red("Include the message client in the fuction")
  let data = await db.findOne({userID})
  if(!data) {
    let i = await db.create({
      userID,
      balance: 0,
      item: []
    })
    await i.save()
    const embed = new Discord.MessageEmbed()
    .setTitle(`${message.author.username}'s balance'`)
    .setDescription(`Balance: \`0\``)
    .setColor("RANDOM")
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
    .setTimestamp()
    return message.channel.send(embed)
  } else {
    const embed = new Discord.MessageEmbed()
    .setTitle(`${message.author.username}'s balance`)
    .setDescription(`Balance: \`${data.balance.toLocaleString()}\``)
    .setColor("RANDOM")
    .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL({dynamic: true}))
    .setTimestamp()
    return message.channel.send(embed)
  }
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
async function addCommand(userID, amountToAdd) {
  if(isNaN(amountToAdd)) return colors.red("Amount is not a number")
  if(!userID) return colors.red("Input the user id")
  await db.findOneAndUpdate({userID}, function(err, res) {
    if(err) {
      colors.red("Could not find user in database")
    } else {
      
    }
  })
}
async function resetAll(messageClient) {
  await db.find({}, function (err, result) {
    if(err) {
      throw new Error(err)
    } else {
      result.forEach(async(s) => {
        await db.findOneAndUpdate({userID: s.userID}, {
          balance: 0
        })
      })
      return messageClient.channel.send("Reseted all the data from the database")
    }
  })
}
async function resetCommand() {

}
async function fightCommand() {

}
async function getData() {
  let datas = []
  let counter = 1
  await db.find({}, function (err, res){
    if(err) {
      throw new Error(err)
    } else {
      res.forEach((info) => {
        datas.push({userID: info.userID, balance: info.balance})
      })
      const mapped = datas.map((s) => {
        return `${counter++}. userID: ${s.userID} - Money: ${s.balance} \n`
      })
      console.log(mapped)
      const create = bin.create(
        [
          {
            content: mapped.join(),
            language: 'text',
          },
        ],
        {
          title: 'Exported data',
          description: "no description..."
        },
      ).then((bin) => {
        return bin.url
      })
    }
  })
}

module.exports = { sendMessage, connect, balanceCommand, getData, resetAll }