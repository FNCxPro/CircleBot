import client from '~/client'
import RichEmbed from '~/embed'
import OwnerCheck from '~/middleware/OwnerCheck'
import Circle from '~/database/models/Circle'
import User from '~/database/models/User'

client.registerCommand(
  'eval',
  async (msg, args) => {
    if (!OwnerCheck(msg)) return
    try {
      // scope
      let _msg = msg
      let _client = client
      let _channel = msg.channel
      let _reply = (msg: string) => {
        return _channel.createMessage(`\`\`\`${msg}\`\`\``)
      }
      let res = eval(args.join(' '))
      return res
    } catch (err) {
      return `Your code failed to execute.\n\n\`\`\`${err}\`\`\``
    }
  },
  {
    hidden: true
  }
)
