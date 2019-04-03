import { Message, PrivateChannel } from 'eris'
import RichEmbed from '~/embed'

export default (msg: Message) => {
  if (msg.channel instanceof PrivateChannel) return true
  msg.delete()
  let embed = new RichEmbed()
  embed
    .setColor(process.env.COLOR_RED as string)
    .setErisAuthor(msg.author)
    .setTitle(`${process.env.EMOJI_XMARK} DM-Only`)
    .setDescription(
      'This command is DM-only. Please open a DM with the bot and execute the command again.'
    )
    .setTimestamp()
  msg.channel
    .createMessage({
      embed: embed.toJSON()
    })
    .then(msg => {
      setTimeout(() => {
        msg.delete()
      }, 5000)
    })
  return false
}
