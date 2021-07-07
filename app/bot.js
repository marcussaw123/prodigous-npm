
const {sendMessage, ButtonPaginator} = require('../index')
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
  }
}) 
client.login(config.token)
