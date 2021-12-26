import { CommandFile } from "../type"
import userPages, { updateBehavior } from "../browserControl"

const FocusCommand: CommandFile = {
  name: "focus",
  async run(client, message, args) {
    try {
      const userPage = userPages.get(message.author.id)
      //if (message.inGuild()) return message.reply("DM으로 해주세요!")
      if (!userPage) return message.reply("페이지가 존재하지 않습니다!")
      await userPage.page.focus(args.join(" "), { timeout: 1000 * 6 })
      await userPage.page.waitForLoadState("networkidle")
      const msg = await userPage.message.edit({
        content: userPage.page.url() + " Focused",
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
      message.reply(
        "실패했습니다, 선택자가 존재하지 않으면 생길 수 있습니다" +
          `\`\`\`${e}\`\`\``
      )
    }
  },
}

export default FocusCommand

function addhttp(url: string) {
  if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
    url = "http://" + url
  }
  return url
}
