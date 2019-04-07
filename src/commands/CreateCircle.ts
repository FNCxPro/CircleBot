import client from '~/client'
import RichEmbed from '~/embed'
import DMCheck from '~/middleware/DMCheck'
import Circle from '~/database/models/Circle'
import User from '~/database/models/User'
import { PrivateChannel } from 'eris'
import UpdateReputation from '~/middleware/UpdateReputation'

client.registerCommand(
  'create',
  async (msg, args) => {
    if (!DMCheck(msg)) return ''
    let dbUser = await User.get(msg.author)
    if (dbUser.createdCircle) {
      let embed = new RichEmbed()
      embed
        .setColor(process.env.COLOR_RED as string)
        .setTitle(`${process.env.EMOJI_XMARK} Cancelled`)
        .setDescription(
          'The creation of the circle has been cancelled because you already have a circle.'
        )
        .setTimestamp()
      return { embed }
    }
    let name = args[0]
    let key = args.slice(1).join(' ')
    let existingCircles = await Circle.find({
      name: name
    })
    if (existingCircles.length > 0) {
      let embed = new RichEmbed()
      embed
        .setColor(process.env.COLOR_RED as string)
        .setTitle(`${process.env.EMOJI_XMARK} Cancelled`)
        .setDescription(
          'The creation of the circle has been cancelled because there is already a circle with that name.'
        )
        .setTimestamp()
      return { embed }
    }
    return `Please confirm that you want to make a circle with the following parameters:\n**Name**: \`${name}\`\n**Key**: \`${key}\``
  },
  {
    reactionButtons: [
      {
        emoji: process.env.EMOJI_XMARKID as string,
        type: 'cancel',
        response: (msg, args) => {
          let embed = new RichEmbed()
          embed
            .setColor(process.env.COLOR_RED as string)
            .setTitle(`${process.env.EMOJI_XMARK} Cancelled`)
            .setDescription('The creation of the circle has been cancelled.')
            .setTimestamp()
          return { embed }
        }
      },
      {
        emoji: process.env.EMOJI_CHECKID as string,
        type: 'edit',
        response: async (msg, args) => {
          let chan = msg.channel as PrivateChannel
          let author = chan.recipient
          let name = args[0]
          let key = args.slice(1).join(' ')
          let dbUser = await User.get(author)
          let embed = new RichEmbed()
          if (dbUser.createdCircle) {
            embed
              .setColor(process.env.COLOR_RED as string)
              .setTitle(`${process.env.EMOJI_XMARK} Cancelled`)
              .setDescription(
                'The creation of the circle has been cancelled because you already have a circle.'
              )
              .setTimestamp()
            return { embed }
          }
          let existingCircles = await Circle.find({
            name: name
          })
          if (existingCircles.length > 0) {
            let embed = new RichEmbed()
            embed
              .setColor(process.env.COLOR_RED as string)
              .setTitle(`${process.env.EMOJI_XMARK} Cancelled`)
              .setDescription(
                'The creation of the circle has been cancelled because there is already a circle with that name.'
              )
              .setTimestamp()
            return { embed }
          }
          let circle = new Circle()
          circle.owner = dbUser
          circle.members = circle.members || []
          circle.members.push(dbUser)
          circle.name = name
          circle.key = key

          let channel = await client.createChannel(
            process.env.BOT_GUILD as string,
            name,
            0,
            `Requested creation by ${author.username}#${
              author.discriminator
            } (${author.id})`,
            process.env.BOT_CATEGORY
          )
          await channel.editPermission(
            author.id,
            9216, // Read messages + Manage messages
            0,
            'member',
            'New circle created'
          )
          let circleEmbed = new RichEmbed()
          circleEmbed
            .setColor(process.env.COLOR_PURPLE as string)
            .setTitle(`ℹ Circle Information`)
            .setDescription(`Welcome to your new circle!`)
            .addField('Name', name)
            .addField('Key', key)
            .addField('Join Command', `c!join ${name} ${key}`)
            .setTimestamp()
          let circleMsg = await client.createMessage(channel.id, {
            embed: circleEmbed
          })
          await circleMsg.pin()
          circle.channel = channel.id
          dbUser.createdCircle = true
          await dbUser.save()
          circle.upgrade = 1
          await circle.save()
          embed
            .setColor(process.env.COLOR_GREEN as string)
            .setTitle(`${process.env.EMOJI_CHECK} Circle Created`)
            .setDescription(
              `Your circle has been created successfully! See <#${
                channel.id
              }> on the Circles Discord server.`
            )
            .addField('Name', name)
            .addField('Key', key)
            .setTimestamp()
          UpdateReputation(author)
          return { embed }
        }
      }
    ],
    reactionButtonTimeout: 15000,
    dmOnly: true,
    aliases: ['createcircle'],
    description: 'Create your own circle (**DM ONLY**)',
    usage: `c!create <1_word_name> <long key>`
  }
)
