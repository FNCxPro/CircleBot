import client from '~/client'
import RichEmbed from '~/embed'
import DMCheck from '~/middleware/DMCheck'
import Circle from '~/database/models/Circle'
import User from '~/database/models/User'
import UpdateReputation from '~/middleware/UpdateReputation'

client.registerCommand(
  'join',
  async (msg, args) => {
    if (!DMCheck(msg)) return ''
    let name = args[0]
    let key = args.slice(1).join(' ')
    let circle = await Circle.findOne({
      name: name
    })
    if (!circle || circle.key !== key) {
      let embed = new RichEmbed()
      embed
        .setColor(process.env.COLOR_RED as string)
        .setTitle(`${process.env.EMOJI_XMARK} Failed to Join`)
        .setDescription('The circle name or key is invalid.')
        .setTimestamp()
      return { embed }
    }
    if (circle.betrayed) {
      let embed = new RichEmbed()
      embed
        .setColor(process.env.COLOR_RED as string)
        .setTitle(`${process.env.EMOJI_XMARK} Failed to Join`)
        .setDescription('The circle has been betrayed.')
        .setTimestamp()
      return { embed }
    }
    let dbUser = await User.get(msg.author)
    if (
      typeof circle.members.find(m => m.id === msg.author.id) !== 'undefined'
    ) {
      let embed = new RichEmbed()
      embed
        .setColor(process.env.COLOR_RED as string)
        .setTitle(`${process.env.EMOJI_XMARK} Failed to Join`)
        .setDescription('You are already a member of the circle.')
        .setTimestamp()
      return { embed }
    }
    dbUser.memberOf = dbUser.memberOf || []
    dbUser.memberOf.push(circle)
    await dbUser.save()

    await client.editChannelPermission(
      circle.channel,
      msg.author.id,
      1024, // Read messages
      0,
      'member',
      `${msg.author.username}#${msg.author.discriminator} (${
        msg.author.id
      }) joined circle successfully`
    )

    let embed = new RichEmbed()
    embed
      .setColor(process.env.COLOR_GREEN as string)
      .setTitle(`${process.env.EMOJI_CHECK} Success`)
      .setDescription(`Successfully joined circle ${name}.`)
      .setTimestamp()
    UpdateReputation(msg.author)
    return { embed }
  },
  {
    dmOnly: true,
    aliases: ['joincircle']
  }
)
