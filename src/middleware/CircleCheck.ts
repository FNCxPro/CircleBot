import { Message, PrivateChannel } from 'eris'
import RichEmbed from '~/embed'
import Circle from '~/database/models/Circle'

export default async (msg: Message, owner: boolean = false) => {
  let circle = await Circle.findOne({
    where: {
      channel: msg.channel.id
    }
  })
  if (circle && circle.owner) {
    if (msg.author.id !== circle!.owner.id && owner) {
      msg.delete()
      let embed = new RichEmbed()
      embed
        .setColor(process.env.COLOR_RED as string)
        .setErisAuthor(msg.author)
        .setTitle(`${process.env.EMOJI_XMARK} Circle Owner Only`)
        .setDescription(
          'You must be the owner of the circle to run this command.'
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
    }
    return circle
  }

  msg.delete()
  let embed = new RichEmbed()
  embed
    .setColor(process.env.COLOR_RED as string)
    .setErisAuthor(msg.author)
    .setTitle(`${process.env.EMOJI_XMARK} Circle-Only`)
    .setDescription(
      'This command is circle-only. Please execute the command inside of a circle.'
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
