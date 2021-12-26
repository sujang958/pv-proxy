import { Client } from "discord.js"
import { config } from "dotenv"
import { readdirSync } from "fs"
import { CommandFile } from "./type"
import { greenBright, cyanBright } from "chalk"
import userPages, { updateBehavior } from "./browserControl"

config()

const { PREFIX, TOKEN } = process.env

if (!PREFIX || !TOKEN) process.exit(404)

const client = new Client({
  partials: ["CHANNEL"],
  intents: ["GUILDS", "DIRECT_MESSAGES", "GUILD_MESSAGES", "GUILD_MEMBERS"],
})

const commands = new Map<string, CommandFile>()

const commandFiles = readdirSync("./commands/")
for (const commandFile of commandFiles) {
  const command: CommandFile = require(`./commands/${commandFile}`).default
  if (!command) continue
  commands.set(command.name, command)
  console.log(
    greenBright("[Commands]"),
    cyanBright(command.name),
    "command successfully installed"
  )
}

setInterval(
  () =>
    userPages.forEach((v, key) => {
      if (Date.now() - v.lastBehavior >= 1000 * 60 * 3) {
        v.page.close()
        userPages.delete(key)
        console.log(cyanBright("[Timeout]"), key)
      }
    }),
  1000 * 60
)

client.on("ready", (cln) =>
  console.log(greenBright("[Bot-Logined-on]"), cln.user.tag)
)

client.once("ready", (cln): any =>
  cln.user.setPresence({
    status: "online",
    activities: [
      {
        name: "Report or Contact developer `sujang@kakao.com`",
      },
    ],
  })
)

client.on("interactionCreate", async (interaction): Promise<any> => {
  if (!interaction.isButton()) return
  const [type, id] = interaction.customId.split(":")
  if (!type || !id) return
  if (id != interaction.user.id) return

  if (type == "update") {
    const userPage = userPages.get(interaction.user.id)
    if (!userPage) return
    const msg = await userPage.message.edit({
      content: userPage.page.url() + " Updated",
      files: [
        await userPage.page.screenshot({
          fullPage: true,
        }),
      ],
      allowedMentions: {
        repliedUser: false,
      },
    })
    interaction.update({})
    return updateBehavior(interaction.user.id, userPage.page, msg)
  }
})

client.on("messageCreate", async (message) => {
  if (message.author.bot) return
  if (!message.content.startsWith(PREFIX)) return
  const args = message.content.slice(PREFIX.length).trim().split(/ +/g)
  const cmd = args.shift().toLowerCase()
  const command = commands.get(cmd)
  if (!command) return
  command.run(client, message, args)
})

client.login(TOKEN)

process.on("uncaughtException", (e) => console.log(e))
