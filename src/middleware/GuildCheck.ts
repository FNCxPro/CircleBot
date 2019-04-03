import { Message, GuildChannel } from 'eris'

export default (msg: Message) => {
  if (msg.channel instanceof GuildChannel) return true
  return false
}
