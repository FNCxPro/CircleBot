import client from '~/client'
import RichEmbed from '~/embed'
import GuildCheck from '~/middleware/GuildCheck'
import User from '~/database/models/User'
import Circle from '~/database/models/Circle'

client.registerCommand(
  'leaderboard',
  async (msg, args) => {
    if (!GuildCheck(msg)) return ''
    let leaderboardMessage = '```md\nCircles Leaderboard```'
    let circles = await Circle.find({
      where: {
        betrayed: false
      }
    })
    let sorted = circles.sort((a, b) =>
      a.members.length < b.members.length ? 1 : -1
    )
    if (sorted.length > 9) {
      sorted = sorted.slice(9)
    }
    let index = 1
    sorted.forEach(circle => {
      let owner = client.users.get(circle.owner.id)!
      leaderboardMessage =
        leaderboardMessage +
        `\n**${index.toString()}.** - **${circle.name}** - ${
          circle.members.length
        } - Owned by **${owner.username}#${owner.discriminator}**`
      index++
    })
    return leaderboardMessage
  },
  {
    aliases: ['lb']
  }
)
