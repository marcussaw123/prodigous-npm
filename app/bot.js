
const {sendMessage, connect, balanceCommand, getData, resetAll, addCommand, blackjackCommand, ButtonPaginator, userInfo, leaderboardCommand, voiceStart} = require('../index')
const child_process = require('child_process')
const config = require('./config.json')
const Discord = require('discord.js')
const {promisify} = require('util')
const ms = require('pretty-ms')
const wait = promisify(setTimeout)
let time = 0
const client = new Discord.Client()
require('discord-buttons')(client)
const {MessageButton, MessageActionRow} = require('discord-buttons')
client.on('ready', () => {
console.log(client.user.username)
client.channels.cache.get("841560639020204042").send("Bot restarted!")
})
client.on('voiceStateUpdate', async(oldState, newState) => {
    await voiceStart(oldState, newState)
});

client.on('message', async(message) => {
  	const args = message.content.slice("!".length).trim().split(/ +/);
	const command = args.shift().toLowerCase();
  let isBotDev = false;
  let botDevs = ["431989436897689600"]
  if(botDevs.includes(message.author.id)) {
    isBotDev = true
  }

  if(command === 'test') {
    await sendMessage(message, "Test Npm Works!")
  } else if(command === 'help') {
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
  } else if(command === 'bal') {
    await balanceCommand(message.author.id, message)
  } else if(command === "getdata") {
    let data = await getData()
    console.log(data)
  } else if(command === "resetall") {
    await resetAll(message)
  } else if(command === "add") {
    if(!args[0]) return message.channel.send("Need a user id!")
    if(!args[1]) return message.channel.send("Need a amount")
    await addCommand(args[0], args[1], message)
    await message.channel.send(`Added the coins`)
  } else if(command === 'bj') {
    await blackjackCommand(message)
  } else if(command === 'restart') {
    message.channel.send("restarting").then(async() => {
      await process.exit(1)
    })
  } else if(command === 'eval') {
    if(isBotDev !== true) return;
  function clean(text) {
          if (typeof text === "string")
              return text
                  .replace(/`/g, "`" + String.fromCharCode(8203))
                  .replace(/@/g, "@" + String.fromCharCode(8203));
          else return text;
      }
      const code = args.join(" ");
      if (!args[0]) {
          return message.channel.send(`u gotta evaluate someting big dummi`);
      } else if (args[0].includes("token")) {
          return message.channel.send("(╯°□°）╯︵ ┻━┻ this is my token idiot");
      } else {
          let limit = 980;

          function evalcode(output) {
              return `\`\`\`js\n${output}\n\`\`\``;
          }

          function embed(input, output, type, color, footer, large, error) {
              const e = new Discord.MessageEmbed()
                  .setAuthor(
                      `Evaluated by ${message.author.username}`,
                      `${message.author.displayAvatarURL({
                          format: "png",
                          dynamic: true,
                          size: 2048,
                      })}`
                  )
                  .setFooter(
                      `${footer}`,
                      `${client.user.displayAvatarURL({
                          format: "png",
                          dynamic: true,
                          size: 2048,
                      })}`
                  )
                  .setColor(color);

              let embed;

              if (error) {
                  return (embed = e
                      .addField("Type", `\`\`\`prolog\n${type}\n\`\`\``, true)
                      .addField(
                          "Evalued in",
                          `\`\`\`yaml\n${new Date() - message.createdTimestamp}ms\n\`\`\``,
                          true
                      )
                      .addField("Input", `${input}`)
                      .addField("Output", `${output}`));
              } else {
                  if (large) {
                      return (embed = e
                          .setDescription(
                              "Check the console to view the complete evaluation."
                          )
                          .addField("Type", `\`\`\`prolog\n${type}\n\`\`\``, true)
                          .addField(
                              "Evalued in",
                              `\`\`\`yaml\n${
                                  new Date() - message.createdTimestamp
                              }ms\n\`\`\``,
                              true
                          )
                          .addField("Input", `${input}`)
                          .addField("Output", `${output}`));
                  } else {
                      return (embed = e
                          .addField("Type", `\`\`\`prolog\n${type}\n\`\`\``, true)
                          .addField(
                              "Evalued in",
                              `\`\`\`yaml\n${
                                  new Date() - message.createdTimestamp
                              }ms\n\`\`\``,
                              true
                          )
                          .addField("Input", input)
                          .addField("Output", output));
                  }
              }

              return e;
          }

          try {
              let evalued = await eval(code);
              let cleanedeval = clean(evalued);
              let evaltype = typeof cleanedeval;
              let evalTypeSplitted = evaltype.split("");
              let evalType =
                  evalTypeSplitted[0].toUpperCase() +
                  evalTypeSplitted.slice(1).join("");
              if (
                  typeof evalued !== "string"
                      ? (evalued = require("util").inspect(evalued, { depth: 0 }))
                      : evalued
              );
              const txt = "" + evalued;

              if (txt.length > limit) {
                  await message.channel.send(
                      embed(
                          evalcode(code),
                          evalcode(txt.slice(0, limit)),
                          evalType,
                          "GREEN",
                          "Evaluation",
                          true,
                          false
                      )
                  );
                  console.log(txt);
              } else {
                  await message.channel.send(
                      embed(
                          evalcode(code),
                          evalcode(txt),
                          evalType,
                          "GREEN",
                          "Evaluation",
                          false,
                          false
                      )
                  );
              }
          } catch (err) {
              const errType = err.toString().split(":")[0];

              await message.channel.send(
                  embed(
                      evalcode(code),
                      evalcode(err),
                      errType,
                      "RED",
                      "Wrong evaluation",
                      false,
                      true
                  )
              );
          }
      }

  } else if(command === 'userinfo') {
    let member = message.mentions.users.first() || message.author;
    await userInfo(member.id, message)
  } else if(command === 'pm2') {
    if(!args[0]) return message.channel.send("Mention the command to execute!")
    let code = args.join(" ")
    await child_process.exec("npx pm2 "+code, (err, res) => {
      if(err) return message.channel.send(err.slice(0, 2000), {code: 'js'})
      message.channel.send(res.slice(0, 2000), {code: 'js'})
    })
  } else if(command === 'terminal') {
    if(!args[0]) return message.channel.send("Mention the command to execute!")
    let code = args.join(" ")
    await child_process.exec(code, (err, res) => {
      if(err) return message.channel.send(err.slice(0, 2000), {code: 'js'})
      message.channel.send(res.slice(0, 2000), {code: 'js'})
    })
  } else if(command === 'lb' || command === 'leaderboard') {
    await leaderboardCommand(message, client)
  } else if(command === 'time') {
    let formattedtime = await ms(time)
    message.channel.send(formattedtime)
  }
})

connect("mongodb+srv://lgbt:Je0d1myGuvYtiOWf@cluster0.3ok4e.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")

client.login(config.token)

