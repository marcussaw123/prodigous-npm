
const {sendMessage, connect, balanceCommand, getData, resetAll} = require('../index')
const config = require('./config.json')
const Discord = require('discord.js')
const client = new Discord.Client()
require('discord-buttons')(client)
const {MessageButton, MessageActionRow} = require('discord-buttons')
client.on('ready', () => {
console.log(client.user.username)
})

client.on('message', async(message) => {
  if(message.content === '!test') {
    await sendMessage(message, "Test Npm Works!")
  } else if(message.content === '!help') {
   let embed1 = new Discord.MessageEmbed()
   .setTitle("Page One")
   .setDescription("PAGE ONE")
   let embed2 = new Discord.MessageEmbed()
   .setTitle("Page Two")
   .setDescription("PAGE TWO")
   await ButtonPaginator([embed1, embed2], [
     {
       color: 'red',
       label: "front"
     },
     {
       color: 'blurple',
       label: "back"
     }
    ],
    message,
    MessageButton,
    client,
    MessageActionRow
   )
  } else if(message.content === '!bal') {
    await balanceCommand(message)
  } else if(message.content === '!getdata') {
    let data = await getData()
    console.log(data)
  } else if(message.content === "!resetall") {
    await resetAll(message)
  }
})

connect("mongodb+srv://lgbt:Je0d1myGuvYtiOWf@cluster0.3ok4e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

client.login(config.token)

