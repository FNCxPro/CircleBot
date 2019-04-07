import { Message, EmbedOptions } from 'eris'
import RichEmbed from '~/embed'

export default (msg: Message) => {
  if (msg.author.id === process.env.BOT_OWNER) return true
  let embed = new RichEmbed()
  embed
    .setColor(process.env.COLOR_RED as string)
    .setTitle(`${process.env.EMOJI_XMARK} Permission Denied`)
    .setDescription('You do not have permission to use this command.')
    .setTimestamp()
  msg.channel.createMessage({
    embed: embed.toJSON()
  })
  return false
}
