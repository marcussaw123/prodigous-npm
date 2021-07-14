const colors = require('kolors-logger')
const Discord = require('discord.js')
const mongoose = require('mongoose')
const db = require('./models/economy')
const db2 = require('./models/voice')
const db3 = require('./models/message')
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
async function balanceCommand(userID, messageClient) {
  if(isConnected !== true) return colors.red("ERROR: Connect to mongodb first!")
  if(!userID) return colors.red("No user id included!")
    if(!messageClient) return colors.red("Include the message client in the fuction")
  const message = messageClient
  let data = await db.findOne({userID})
  if(!data) {
    let i = await db.create({
      userID,
      balance: 0,
      item: []
    })
    await i.save()
    const embed = new Discord.MessageEmbed()
    .setTitle(`${client.user.cache.get(userID).username}'s balance'`)
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
async function leaderboardCommand(message, client) {
  let lb = []
await db.find({}, function(err, result) {
  if(err) {
    console.log(err)
  } else {
    result.forEach(async(info) => {
      await lb.push({userID: info.userID, userUsername: client.users.cache.get(info.userID).tag, amount: info.balance})
    })
    lb.sort((a, b) => b.amount - a.amount).filter(x => !isNaN(x.amount))
  let counter = 1
    const mapped = lb.map((s) => {
      return `${counter++}. User: ${s.userUsername}(**${s.userID}**) Balance: \`${s.amount.toLocaleString()}\``
    })
    const embed = new Discord.MessageEmbed()
    .setTitle("LEADERBOARD")
    .setDescription(mapped)
    .setColor("BLUE")
    message.channel.send(embed)
  }
})
}
async function blackjackCommand(message) {
  let userNumber = Math.floor(Math.random() * 20)
  let botNumber = Math.floor(Math.random() * 20)
  const filter = m => m.author.id === message.author.id
  let collector = await message.channel.createMessageCollector(filter, {time: 150000})
collector.on('collect', async(m) => {
  if(m.content === 'h') {
    if(userNumber > 21 || botNumber === 21) {
      await collector.stop()
      message.channel.send("you lost!")
    } else if(botNumber > 21 || userNumber === 21){
      await collector.stop()
      message.channel.send("You Win!")
    } else {
    userNumber = Math.floor(Math.random() * 5) + userNumber
    botNumber = Math.floor(Math.random() * 5) + botNumber
    if(userNumber > 21 || botNumber === 21) {
      await collector.stop()
      message.channel.send("You lost")
    } else if(botNumber > 21 || userNumber === 21) {
      await collector.stop()
      message.channel.send('you win')
    } else {
    message.channel.send(`User: ${userNumber} Bot: ${botNumber}`)
    }
    }
    
  } else if(m.content === 's') {
    if(botNumber > 21 || userNumber === 21) {
      await collector.stop()
      message.channel.send("You win")
    } else if(userNumber > 21 || botNumber === 21) {
      await collector.stop()
      message.channel.send("You Lose!")
    } else {
      if(userNumber > 21 || botNumber === 21) {
      await collector.stop()
      message.channel.send("You lost")
    } else if(botNumber > 21 || userNumber === 21) {
      await collector.stop()
      message.channel.send('you win')
    } else {
    botNumber = Math.floor(Math.random() * 5) + botNumber
    await message.channel.send(`user: ${userNumber} bot: ${botNumber}`)
    }
    }
  } else if(m.content === 'e') {
    await collector.stop()
    await message.channel.send("Stoped the game!")
  } else {
    await collector.stop()
    await message.channel.send("Invalid option!")
  }
})
}
async function shopCommand() {

}
async function start() {

}
async function giveCommand() {

}
async function addCommand(userID, amountToAdd, message) {
  if(!amountToAdd) return colors.red("No amount inputted")
  if(!message) return colors.red("message not define!")
  if(isNaN(amountToAdd)) return message.channel.send("The amount given is not a number")
  if(!userID) return colors.red("Input the user id")
  let data = await db.findOne({userID})
  if(!data) {
    let d = await db.create({
      userID: userID,
      item: [],
      balance: amountToAdd
    })
    await d.save()
    return message.channel.send(`Added ${amountToAdd} to <@${userID}>`)
  }
  await db.findOneAndUpdate({userID}, {
    $inc: {
      balance: parseInt(amountToAdd)
    }
  }).then((update) => {
    return update && message.channel.send(`Added ${amountToAdd} to <@${userID}>`)
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
async function userInfo(userID, message) {
  let member = message.guild.members.cache.get(userID)
  if(!member) return message.channel.send("Member not in server")
  const embed = new Discord.MessageEmbed()
      .setTitle(`${member.user.username}'s status`)
      let presence = member.presence
      if(presence.status === 'offline') {
        embed.addField("Status", "offline")
        message.channel.send(embed)
      } else {
        let arr = presence.clientStatus
        let key = Object.keys(arr)[0]
        embed.addField("Status", presence.status)
        embed.addField("Device Log on", key)
        if(presence.activities.length === 0) {
          message.channel.send(embed)
        } else {
          if(presence.activities[0].state === null && presence.activities[0].emoji !== null) {
            embed.addField("Custom Status", `<:${presence.activities[0].emoji.name}:${presence.activities[0].emoji.id}>`)
          } else if(presence.activities[0].state !== null && presence.activities[0].emoji !== null) {
            embed.addField("Custom Status", `<:${presence.activities[0].emoji.name}:${presence.activities[0].emoji.id}> ${presence.activities[0].state}`)
          } else {
            embed.addField("Custom Status", `${presence.activities[0].state}`)
          }
          message.channel.send(embed)
        }
      }
  
  }
  async function voiceStart(oldState, newState) {
    if(!oldState || !newState) return colors.red("Pass in all the needed values!")
    const {promisify} = require('util')
    const wait = promisify(setTimeout)
    if (isConnected !== true) return colors.red("Must connect to mongodb!")
    if (oldState.channelID === null) {
      console.log('user joined channel', newState.channelID)
      let data = await db2.findOne({userID: newState.member.id})
      if(!data) {
        let i = await db2.create({
          userID: newState.member.id,
          time: 0
        })
        await i.save()
             while (oldState.channelID === null) {
        if (newState.channelID !== null) {
          await wait(5000)
          await db2.findOneAndUpdate({userID: newState.member.id}, {
            $inc: {
              time: 5000
            }
          })
          console.log("added")
          console.log(newState.channelID)
        } else {
          console.log("user left vc")
          break;
        }
      }
    } else {
      
      while (oldState.channelID === null) {
        if (newState.channelID !== null) {
          await wait(5000)
           await db2.findOneAndUpdate({userID: newState.member.id}, {
            $inc: {
              time: 5000
            }
          })
          console.log("added")
          console.log(newState.channelID)
        } else {
          console.log("user left vc")
          break;
        }
      }
    }
    }
    

  }
  async function timeCommand(userID, message) {
    if(!userID || !message) return colors.red("Pass in all the values needed!")
    const ms = require('pretty-ms')
    const embed = new Discord.MessageEmbed()
    let data = await db2.findOne({userID})
    if(!data) {
      let i = await db2.create({
        time: 0,
        userID
      })
      await i.save()
      embed.setDescription(`Time: No data recorded!`)
      embed.setColor("RED")
      embed.setTimestamp()
      message.channel.send(embed)
    } else if(data.time === 0){
      embed.setDescription(`Time: No data recorded!`)
      embed.setColor("RED")
      embed.setTimestamp()
      message.channel.send(embed)
    } else {
      let time = await ms(data.time)
      embed.setDescription(`${time}`)
      embed.setColor("GREEN")
      embed.setTimestamp()
      message.channel.send(embed)
    }
  }
async function voiceLeaderboard(client, message) {
  let lb = []
  let counter = 1
  const ms = require("pretty-ms")
  await db2.find({}, function(err, result) {
    if(err) {
      console.log(err)
    } else {
      result.forEach(async(i) => {
        await lb.push({userID: i.userID, time: ms(i.time), userUsername: client.users.cache.get(i.userID).tag})
      })
      lb.sort((a, b) => b.time - a.time).filter(x => !isNaN(x.time))
      const mapped = lb.map((i) => {
        return `${counter++}. ${i.userUsername}(**${i.userID}**) - \`${i.time}\``
      })
      const embed = new Discord.MessageEmbed()
      .setTitle("LEADERBOARD")
      .setDescription(mapped)
      .setTimestamp()
      .setColor("RANDOM")
      .setFooter("voice leaderboard")
      message.channel.send(embed)
    }
  })
}
async function timeResetAll(message) {
  let count = 1
  await db2.find({}, function(err, res) {
    if(err) {
      console.log(err)
    } else {
      res.forEach(async(i) => {
        let data = await db2.findOne({userID: i.userID})
        if(data.time === 0) {

        } else {
        await count++
        await db2.findOneAndUpdate({userID: i.userID}, {
          time: 0
        })
        }
      })
      message.channel.send(`Reseted ${count} data from the database`)
    }
  })
}
async function timeReset(userID, message) {
  let data = await db2.findOne({userID})
  if(!data) return message.channel.send("User doesn't have any data stored in database")
  if(data) {
    await db2.find({userID}, function(err, res) {
      if(err) {
        console.log(err)
      } else {
        res.forEach(async(i) => {
          await db2.findOneAndUpdate({userID: i.userID}, {
            time: 0
          })
        })
        return message.channel.send("Finished resetting the data from user")
      }
    })
  }
}
async function messageStart(message, options) {
  if(isConnected !== true) return colors.red("mongodb not connected using the package!")
  let allowBot = false;
  if(!message || !options) return colors.red("Pass in the required fields")
  if(typeof(options) !== "object") return colors.red("Options field must be an object")
  if(options.allowBot === undefined) {
    return colors.red("object must include allowBot field")
  } else if(typeof(options.allowBot) !== 'boolean') return colors.red("allowBot field needs to be an boolean")
  if(options.allowBot === true) {
    allowBot = true
  }
  if(allowBot) {
    let data = await db3.findOne({userID: message.author.id})
    if(!data) {
      let i = await db3.create({
        userID: message.author.id,
        total: 1,
      })
      await i.save()
    }
    await db3.findOneAndUpdate({userID: message.author.id}, {
      $inc: {
        total: 1
      }
    })
  } else {
    if(message.author.bot) return;
    let data = await db3.findOne({userID: message.author.id})
    if(!data) {
      let i = await db3.create({
        userID: message.author.id,
        total: 1,
      })
      await i.save()
    }
    await db3.findOneAndUpdate({userID: message.author.id}, {
      $inc: {
        total: 1
      }
    })
  }
}
async function messageCommand(userID, message) {
  if(!userID || !message) return colors.red("Pass in the required values")
  const embed = new Discord.MessageEmbed()
  let data = await db3.findOne({userID})
  if(!data) {
    let i = await db3.create({
      userID,
      total: 0
    })
  await i.save()
embed.setDescription(`Messages: \`0\``)
embed.setTimestamp()
embed.setColor("RANDOM")
message.channel.send(embed)
  } else {
    embed.setDescription(`Messages: \`${data.total}\``)
    embed.setTimestamp()
    embed.setColor("GREEN")
    message.channel.send(embed)
  }
  
}
module.exports = { sendMessage, connect, balanceCommand, getData, resetAll, addCommand, blackjackCommand, userInfo, ButtonPaginator, leaderboardCommand, voiceStart, timeCommand, voiceLeaderboard, timeResetAll, timeReset, messageStart, messageCommand }