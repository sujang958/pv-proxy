import { CommandFile } from "../type"
import userPages, { browser } from "../browserControl"
import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
} from "discord.js"

const StartCommand: CommandFile = {
  name: "start",
  async run(client, message, args) {
    //if (message.inGuild()) return message.reply("DM으로 해주세요!")
    try {
      if (userPages.has(message.author.id))
        return message.reply("페이지는 1인당 1개로 제한됩니다!")
      const curBrowser = await browser
      const userPage = await curBrowser.newPage()
      await userPage.goto(
        `${
          args.length != 0 ? addhttp(args.join(" ")) : "https://www.google.com/"
        }`
      )

      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId(`update:${message.author.id}`)
            .setStyle("SUCCESS")
            .setLabel("🔁 Update Screen")
        )
        .addComponents(
          new MessageButton()
            .setStyle("SECONDARY")
            .setDisabled(true)
            .setLabel(`Created by ${message.author.tag}`)
            .setCustomId(message.author.id)
        )
      const msg = await message.reply({
        content: userPage.url() + " Hello",
        files: [
          await userPage.screenshot({
            fullPage: true,
          }),
        ],
        components: [row],
        allowedMentions: {
          repliedUser: false,
        },
      })
      userPages.set(message.author.id, {
        page: userPage,
        lastBehavior: Date.now(),
        message: msg,
      })
    } catch (e) {
      await userPages.get(message.author.id)?.page.close()
      userPages.delete(message.author.id)
      message.reply({
        content: "무언가 잘못됬습니다, url이 잘못됬을수도 있습니다",
        allowedMentions: { repliedUser: false },
      })
    }
  },
}

export default StartCommand

function addhttp(url: string) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = "http://" + url
  }
  return url
}
