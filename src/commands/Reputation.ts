import client from '~/client'
import { TextChannel, Guild, Member } from 'eris'
import RichEmbed from '~/embed'
import OwnerCheck from '~/middleware/OwnerCheck'
import GuildCheck from '~/middleware/GuildCheck'
import User from '~/database/models/User'

client.registerCommand(
  'reputation',
  async (msg, args) => {
    if (!GuildCheck(msg)) return ''
    let embed = new RichEmbed()
    let target = msg.author
    if (msg.mentions.length > 0) {
      target = msg.mentions[0]
    }
    let dbUser = await User.get(target)
    dbUser.memberOf = dbUser.memberOf || []
    dbUser.betrayedCircles = dbUser.betrayedCircles || []
    dbUser.save()
    let memberOf = dbUser.memberOf.length
    let membersOfCircle = 0
    if (dbUser.ownedCircle) {
      memberOf = memberOf - 1 // -1 to account for their owned circle
      membersOfCircle = dbUser.ownedCircle.members.length - 1 // -1 to account for owner
      if (dbUser.ownedCircle.betrayed) {
        membersOfCircle = 0
        memberOf = memberOf + 1
      }
    }
    embed
      .setColor(process.env.COLOR_GREEN as string)
      .setTitle(`${target.username}#${target.discriminator}'s reputation`)
      .addField('Member Of', `${memberOf.toString()} circles`)
      .addField('Members Of Own Circle', membersOfCircle.toString())
      .addField('Betrayed Count', dbUser.betrayedCircles.length.toString())
      .setTimestamp()
    if (dbUser.hasBetrayed) {
      embed.setColor(process.env.COLOR_RED as string)
    }
    return { embed }
  },
  {
    aliases: ['rep'],
    description: 'Get the reputation of a user',
    fullDescription: 'Get the reputation of a user',
    usage: 'c!reputation <@252509640774909952>'
  }
)
