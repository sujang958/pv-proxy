import { CommandFile } from "../type"
import userPages, { updateBehavior } from "../browserControl"

const CloseCommand: CommandFile = {
  name: "close",
  async run(client, message, args) {
    const userPage = userPages.get(message.author.id)
    //if (message.inGuild()) return message.reply("DM으로 해주세요!")
    if (!userPage) return message.reply("페이지가 존재하지 않습니다!")
    await userPage.page.close()
    userPages.delete(message.author.id)
    message.reply("닫았습니다!")
  },
}

export default CloseCommand
