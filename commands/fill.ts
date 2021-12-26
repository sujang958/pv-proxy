import { CommandFile } from "../type"
import userPages, { updateBehavior } from "../browserControl"

const FillCommand: CommandFile = {
  name: "fill",
  async run(client, message, args) {
    const userPage = userPages.get(message.author.id)
    // if (message.inGuild()) return message.reply("DM으로 해주세요!")
    if (!userPage) return message.reply("페이지가 존재하지 않습니다!")
    const target = await userPage.page.$(args.join(" "))
    if (!target) return message.reply("선택자가 존재하지 않습니다!")
    message.reply("이제, 내용을 입력해주세요")
    const collected = await message.channel.awaitMessages({
      filter: (m) => m.author.id === message.author.id,
      max: 1,
    })
    const response = collected.first()
    await userPage.page.fill(args.join(" "), response.content)
    await userPage.page.waitForLoadState("load")
    const msg = await userPage.message.edit({
      content: userPage.page.url() + " Filled",
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
  },
}

export default FillCommand
