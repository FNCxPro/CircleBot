import client from '~/client'
import OwnerCheck from '~/middleware/OwnerCheck'
import User from '~/database/models/User'
import UpdateReputation from '~/middleware/UpdateReputation'

client.registerCommand(
  'resetbetrayed',
  async (msg, args) => {
    if (!OwnerCheck(msg)) return
    let target = msg.author
    if (msg.mentions.length > 0) {
      target = msg.mentions[0]
    }
    let dbUser = await User.get(target)
    dbUser.hasBetrayed = false
    dbUser.betrayedCircles = []
    await dbUser.save()
    UpdateReputation(target)
    await msg.channel.createMessage(
      `${target.username}#${
        target.discriminator
      }'s betrayal status has been reset`
    )
    return
  },
  {
    hidden: true
  }
)
