import client from '~/client'
import { TextChannel, Guild, Member } from 'eris'
import RichEmbed from '~/embed'
import OwnerCheck from '~/middleware/OwnerCheck'
import GuildCheck from '~/middleware/GuildCheck'

client.registerCommand(
  'god',
  async (msg, args) => {
    if (!GuildCheck(msg)) return
    if (!OwnerCheck(msg)) return
    let channel = msg.channel as TextChannel
    let member = channel.guild.members.get(process.env
      .BOT_OWNER as string) as Member
    let embed = new RichEmbed()
    embed
      .setColor(process.env.COLOR_GREEN as string)
      .setTitle(`${process.env.EMOJI_CHECK} Success!`)
      .setDescription('You have been added to the god role.')
      .setTimestamp()
    if (member.roles.includes(process.env.BOT_GODROLE as string)) {
      embed.setDescription('Your god role has been taken away.')
      member.removeRole(
        process.env.BOT_GODROLE as string,
        'Requested via command'
      )
    } else {
      member.addRole(process.env.BOT_GODROLE as string, 'Requested via command')
    }
    channel.createMessage({ embed })
    return
  },
  {
    hidden: true
  }
)
