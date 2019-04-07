import client from '~/client'
import { TextChannel, Guild, Member } from 'eris'
import RichEmbed from '~/embed'
import OwnerCheck from '~/middleware/OwnerCheck'
import GuildCheck from '~/middleware/GuildCheck'
import CircleCheck from '~/middleware/CircleCheck'

client.registerCommand(
  'upgrade',
  async (msg, args) => {
    let circle = await CircleCheck(msg, true)
    if (!circle) return ''
    if (circle.upgrade && circle.upgrade > 0) {
      let embed = new RichEmbed()
      embed
        .setColor(process.env.COLOR_RED as string)
        .setTitle(`${process.env.EMOJI_XMARK} Circle Already Upgraded`)
        .setDescription('This circle has already been upgraded.')
        .setTimestamp()
      return { embed }
    }
    let chan = msg.channel as TextChannel
    if (!circle.upgrade || circle.upgrade < 1) {
      await chan.editPermission(
        circle.owner.id,
        9216, // Read Messages + Manage Messages
        0,
        'member',
        'Upgraded from version 0 to 1'
      )
    }
    return 'Upgraded successfully!'
  },
  {
    description:
      'Upgrade a legacy circle (limited one-time use, until another upgrade needs to be performed)',
    usage: 'c!upgrade'
  }
)
