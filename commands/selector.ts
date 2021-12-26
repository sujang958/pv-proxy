import { CommandFile } from "../type"
import userPages, { updateBehavior } from "../browserControl"
import { MessageAttachment } from "discord.js"

const SelectorCommand: CommandFile = {
  name: "selector",
  async run(client, message, args) {
    try {
      const userPage = userPages.get(message.author.id)
      //if (message.inGuild()) return message.reply("DM으로 해주세요!")
      if (!userPage) return message.reply("페이지가 존재하지 않습니다!")
      const target = await userPage.page.$(args.join(" "))
      if (!target)
        return message.reply({
          content: "선택자가 존재하지 않습니다!",
          allowedMentions: { repliedUser: false },
        })

      const msg = await userPage.message.edit({
        content: userPage.page.url() + " Viewed selector",
        files: [
          await userPage.page.screenshot({
            fullPage: true,
          }),
          new MessageAttachment(
            Buffer.from(await target.innerHTML()),
            "selector.txt"
          ),
        ],
        allowedMentions: {
          repliedUser: false,
        },
      })
      updateBehavior(message.author.id, userPage.page, msg)
    } catch (e) {
      message.reply({
        allowedMentions: { repliedUser: false },
        content: `\`\`\`${e}\`\`\``,
      })
    }
  },
}

export default SelectorCommand

function addhttp(url: string) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = "http://" + url
  }
  return url
}
