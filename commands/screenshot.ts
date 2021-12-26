import { CommandFile } from "../type"
import userPages, { updateBehavior } from "../browserControl"

const ScreenshotCommand: CommandFile = {
  name: "screenshot",
  async run(client, message, args) {
    try {
      const userPage = userPages.get(message.author.id)
      //if (message.inGuild()) return message.reply("DM으로 해주세요!")
      if (!userPage) return message.reply("페이지가 존재하지 않습니다!")
      const msg = await userPage.message.edit({
        content: userPage.page.url() + "Updated",
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
      message.reply("실패했습니다" + `\`\`\`${e}\`\`\``)
    }
  },
}

export default ScreenshotCommand
