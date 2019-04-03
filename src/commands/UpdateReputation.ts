import client from '~/client'
import RichEmbed from '~/embed'
import UpdateReputation from '~/middleware/UpdateReputation'

client.registerCommand(
  'updatereputation',
  async (msg, args) => {
    UpdateReputation(msg.author)
    let embed = new RichEmbed()
    embed
      .setColor(process.env.COLOR_GREEN as string)
      .setErisAuthor(msg.author)
      .setTitle(`${process.env.EMOJI_CHECK} Success!`)
      .setDescription('Your nickname (reputation) has been updated.')
      .setTimestamp()
    return { embed }
  },
  {
    aliases: ['updaterep', 'update']
  }
)
