import { CommandFile } from "../type"
import userPages, { updateBehavior } from "../browserControl"

const TypeCommand: CommandFile = {
  name: "type",
  async run(client, message, args) {
    const userPage = userPages.get(message.author.id)
    //if (message.inGuild()) return message.reply("DM으로 해주세요!")
    if (!userPage) return message.reply("페이지가 존재하지 않습니다!")
    await userPage.page.keyboard.type(args.join(" "))
    await userPage.page.waitForTimeout(1000)
    const msg = await userPage.message.edit({
      content: userPage.page.url() + " Typed",
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

export default TypeCommand
