import client from '~/client'
import RichEmbed from '~/embed'
import DMCheck from '~/middleware/DMCheck'
import Circle from '~/database/models/Circle'
import User from '~/database/models/User'
import UpdateReputation from '~/middleware/UpdateReputation'

client.registerCommand(
  'betray',
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
        .setTitle(`${process.env.EMOJI_XMARK} Failed to Betray`)
        .setDescription('The circle name or key is invalid.')
        .setTimestamp()
      return { embed }
    }
    if (circle.betrayed) {
      let embed = new RichEmbed()
      embed
        .setColor(process.env.COLOR_RED as string)
        .setTitle(`${process.env.EMOJI_XMARK} Failed to Betray`)
        .setDescription('The circle has already been betrayed.')
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
        .setTitle(`${process.env.EMOJI_XMARK} Failed to Betray`)
        .setDescription('You are already a member of the circle.')
        .setTimestamp()
      return { embed }
    }
    dbUser.hasBetrayed = true
    dbUser.betrayedCircles = dbUser.betrayedCircles || []
    dbUser.betrayedCircles.push(circle)
    circle.betrayed = true
    circle.betrayedBy = dbUser
    circle.members = []
    await circle.save()
    await dbUser.save()
    await client.deleteChannel(
      circle.channel,
      `Circle betrayed by ${msg.author.username}#${msg.author.discriminator} (${
        msg.author.id
      })`
    )
    let betrayalEmbed = new RichEmbed()
    betrayalEmbed
      .setColor(process.env.COLOR_RED as string)
      .setTitle(`${process.env.EMOJI_XMARK} Circle Betrayed`)
      .setDescription(`Your circle, ${name} was betrayed.`)
      .addField(
        'Member Count Before Betrayal',
        circle.members.length.toString()
      )
      .setTimestamp()
    let dmChannel = await client.getDMChannel(circle.owner.id)
    dmChannel.createMessage({ embed: betrayalEmbed })
    let embed = new RichEmbed()
    embed
      .setColor(process.env.COLOR_GREEN as string)
      .setTitle(`${process.env.EMOJI_CHECK} Success`)
      .setDescription(`Successfully betrayed circle ${name}.`)
      .setTimestamp()
    UpdateReputation(msg.author)
    return { embed }
  },
  {
    dmOnly: true,
    aliases: ['betraycircle']
  }
)
