import { CommandFile } from "../type"
import userPages, { updateBehavior } from "../browserControl"

const EvalCommand: CommandFile = {
  name: "eval",
  async run(client, message, args) {
    const userPage = userPages.get(message.author.id)
    // if (message.inGuild()) return message.reply("DM으로 해주세요!")
    if (!userPage) return message.reply("페이지가 존재하지 않습니다!")
    await userPage.page.evaluate(
      (__asfjoasdfjoaesfjoefjoefjoasdfjkasfasdfasfdasf) =>
        eval(__asfjoasdfjoaesfjoefjoefjoasdfjkasfasdfasfdasf),
      args.join(" ")
    )
    await userPage.page.waitForLoadState("networkidle")
    await userPage.page.waitForTimeout(1000)
    const msg = await userPage.message.edit({
      content: userPage.page.url(),
      files: [
        await userPage.page.screenshot({
          fullPage: true,
        }),
      ],
    })
    updateBehavior(message.author.id, userPage.page, msg)
  },
}

export default EvalCommand
