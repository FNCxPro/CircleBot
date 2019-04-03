import client from '~/client'
import OwnerCheck from '~/middleware/OwnerCheck'
import User from '~/database/models/User'
import UpdateReputation from '~/middleware/UpdateReputation'

client.registerCommand(
  'resetbetrayed',
  async (msg, args) => {
    if (!OwnerCheck(msg)) return
    let dbUser = await User.get(msg.author)
    dbUser.hasBetrayed = false
    dbUser.betrayedCircles = []
    await dbUser.save()
    UpdateReputation(msg.author)
    await msg.channel.createMessage('Your betrayal status has been reset')
    return
  },
  {
    hidden: true
  }
)
