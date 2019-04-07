import client from '~/client'
import RichEmbed from '~/embed'
import GuildCheck from '~/middleware/GuildCheck'
import User from '~/database/models/User'
import Circle from '~/database/models/Circle'

import { chunk } from 'lodash'

client.registerCommand(
  'leaderboard',
  async (msg, args) => {
    if (!GuildCheck(msg)) return ''
    let leaderboardMessage = '```md\n>>    Circles Leaderboard    <<\n'
    let circles = await Circle.find({
      where: {
        betrayed: false
      }
    })
    let sorted = circles.sort((a, b) =>
      a.members.length < b.members.length ? 1 : -1
    )
    sorted = chunk(sorted, 10)[0]
    let index = 1
    sorted.forEach(circle => {
      let owner = client.users.get(circle.owner.id)!
      leaderboardMessage += `#${index.toString} - ${circle.name}\n${
        circle.members.length
      } members (including owner)\nOwned by ${owner.username}#${
        owner.discriminator
      }\n`
      index++
    })
    leaderboardMessage += '```'
    return leaderboardMessage
  },
  {
    aliases: ['lb']
  }
)
