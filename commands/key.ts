import { CommandFile } from "../type"
import userPages, { updateBehavior } from "../browserControl"

const KeyCommand: CommandFile = {
  name: "key",
  async run(client, message, args) {
    try {
      const userPage = userPages.get(message.author.id)
      //if (message.inGuild()) return message.reply("DM으로 해주세요!")
      if (!userPage) return message.reply("페이지가 존재하지 않습니다!")
      await userPage.page.keyboard.press(args.join(" "))
      await userPage.page.waitForLoadState("networkidle")
      await userPage.page.waitForTimeout(900)
      const msg = await userPage.message.edit({
        content: userPage.page.url(),
        files: [
          await userPage.page.screenshot({
            fullPage: true,
          }),
        ],
      })
      updateBehavior(message.author.id, userPage.page, msg)
    } catch (e) {
      message.reply("실패했습니다, 문자를 입력하시려면 `!pv type`을 이용하세요")
    }
  },
}

export default KeyCommand
