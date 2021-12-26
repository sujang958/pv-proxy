import { Message } from "discord.js"
import { chromium, Page } from "playwright"

export const browser = chromium.launch({ headless: true })

export const updateBehavior = (id: string, page: Page, message: Message) =>
  userPages.set(id, { page, lastBehavior: Date.now(), message })

const userPages = new Map<
  string,
  { page: Page; lastBehavior: number; message: Message }
>()

export default userPages
