import client from '~/client'
import { TextChannel, Guild, Member, User as ErisUser } from 'eris'
import RichEmbed from '~/embed'
import CircleCheck from '~/middleware/CircleCheck'
import User from '~/database/models/User'

client.registerCommand(
  'manager',
  async (msg, args) => {
    let circle = await CircleCheck(msg, true)
    if (!circle) return ''
    let target: ErisUser

    let embed = new RichEmbed()
    embed
      .setColor(process.env.COLOR_RED as string)
      .setErisAuthor(msg.author)
      .setTitle(`${process.env.EMOJI_XMARK} Error`)
      .setDescription('x.')
      .setTimestamp()
    if (msg.mentions.length === 0) {
      embed.setDescription(
        'You must tag a user in the command to give them manager in your circle.'
      )
      return { embed }
    }
    if (msg.mentions.length > 0) {
      target = msg.mentions[0] as ErisUser
    }
    let chan = msg.channel as TextChannel

    let memberInCircle = circle.members.find(
      u => u.id === (target as ErisUser).id
    )
    if (!memberInCircle) {
      embed.setDescription('That member is not in your circle.')
      return { embed }
    }
    let alreadyManager = chan.permissionsOf(target!.id).has('MANAGE_MESSAGES')
    if (alreadyManager) {
      chan.editPermission(
        target!.id,
        1024, // read messages
        0,
        'member',
        'Revoking manager from circle at request of owner'
      )
      embed.setDescription(
        `<@${target!.id}> no longer has Manage Messages in your Circle.`
      )
    } else {
      chan.editPermission(
        target!.id,
        9216, // read messages and manage messages,
        0,
        'member',
        'Granting manager of a circle at request of owner'
      )
      embed.setDescription(
        `<@${target!.id}> now has Manage Messages in your Circle.`
      )
    }
    embed
      .setColor(process.env.COLOR_GREEN as string)
      .setTitle(`${process.env.EMOJI_CHECK} Success`)
    return { embed }
  },
  {
    description: 'Grant or revoke Manage Messages from someone in your circle',
    usage: 'c!manager @relative#0123'
  }
)
