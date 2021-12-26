import { CommandFile } from "../type"

const HelpCommand: CommandFile = {
  name: "help",
  async run(client, message, args) {
    message.reply({
      content: "메이크톤 채널에서 확인이 가능합니다",
      allowedMentions: { repliedUser: false },
    })
  },
}

export default HelpCommand
