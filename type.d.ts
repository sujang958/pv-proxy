import { Client, Message } from "discord.js"

export interface CommandFile {
  name: string
  run: (client: Client, message: Message, args: string[]) => Promise<any>
}
