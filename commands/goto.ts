import { CommandFile } from "../type"
import userPages, { updateBehavior } from "../browserControl"
import { URL } from "url"
import list from "../list"
import { TextChannel } from "discord.js"

const GotoCommand: CommandFile = {
  name: "goto",
  async run(client, message, args) {
    try {
      const userPage = userPages.get(message.author.id)
      //if (message.inGuild()) return message.reply("DM으로 해주세요!")
      if (!userPage) return message.reply("페이지가 존재하지 않습니다!")
      const target = new URL(addhttp(args.join(" ")))
      if (list.includes(target.hostname))
        if (message.channel instanceof TextChannel) {
          if (!message.channel.nsfw)
            return message.reply("NSFW채널로 만들어주세요!")
        } else
          message.reply(
            "NSFW사이트에 들어가려는 것 같습니다, 모든 책임은 본인에게 있습니다"
          )
      await userPage.page.goto(addhttp(args.join(" ")), {
        waitUntil: "networkidle",
      })
      await userPage.page.waitForTimeout(600)
      const msg = await userPage.message.edit({
        content: userPage.page.url() + " Went",
        files: [
          await userPage.page.screenshot({
            fullPage: true,
          }),
        ],
        allowedMentions: {
          repliedUser: false,
        },
      })
      updateBehavior(message.author.id, userPage.page, msg)
    } catch (e) {
      message.reply({
        allowedMentions: { repliedUser: false },
        content: "실패했습니다" + `\`\`\`${e}\`\`\``,
      })
    }
  },
}

export default GotoCommand

function addhttp(url: string) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = "http://" + url
  }
  return url
}
