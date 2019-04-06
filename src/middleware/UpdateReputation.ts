import { User as ErisUser, Guild } from 'eris'
import User from '~/database/models/User'
import client from '~/client'

export default async function(user: ErisUser) {
  let dbUser = await User.get(user)
  let guild = client.guilds.get(process.env.BOT_GUILD as string) as Guild

  let member = guild.members.get(user.id)
  if (!member) return
  dbUser.memberOf = dbUser.memberOf || []
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
  member.edit({
    nick: `${
      member.username
    } [${memberOf.toString()}, ${membersOfCircle.toString()}${
      dbUser.hasBetrayed ? ' ∅' : ''
    }]`
  })
}
