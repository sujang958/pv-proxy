import { CommandFile } from "../type"
import userPages, { updateBehavior } from "../browserControl"

const VideoCommand: CommandFile = {
  name: "video",
  async run(client, message, args) {
    const userPage = userPages.get(message.author.id)
    // if (message.inGuild()) return message.reply("DM으로 해주세요!")
    if (!userPage) return message.reply("페이지가 존재하지 않습니다!")
    const target = await userPage.page.$("video")
    if (!target) return message.reply("비디오가 존재하지 않습니다!")
    const msg = await userPage.message.edit({
      content: userPage.page.url() + ` Hello`,
      files: [
        await userPage.page.screenshot({
          fullPage: true,
        }),
      ],
      allowedMentions: {
        repliedUser: false,
      },
    })
    message.reply({
      allowedMentions: { repliedUser: false },
      content: `\u200b${await target.getAttribute("src")}`,
    })
    updateBehavior(message.author.id, userPage.page, msg)
  },
}

export default VideoCommand
