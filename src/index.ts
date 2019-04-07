/* 
  CircleBot, a clone of r/circleoftrust for Discord
  Copyright (C) 2019  Seth Stephens

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import '~/config'
import client from '~/client'
import createConnection from '~/database'

import '~/commands/GodRole'
import '~/commands/CreateCircle'
import '~/commands/JoinCircle'
import '~/commands/BetrayCircle'
import '~/commands/ResetBetrayed'
import '~/commands/UpdateReputation'
import '~/commands/Reputation'
import '~/commands/Leaderboard'
import '~/commands/Eval'
import '~/commands/Upgrade'
import '~/commands/Manager'
import { Message } from 'eris'
client.on('ready', () => {
  console.log('CircleBot is ready')
})

client.on('messageDelete', async (msg: Message) => {
  if (
    msg.embeds &&
    msg.author.id === client.user.id &&
    msg.embeds[0].description === 'Welcome to your new circle!'
  ) {
    let newMsg = await msg.channel.createMessage({ embed: msg.embeds[0] })
    await newMsg.pin()
  }
})

createConnection().then(() => {
  client.connect()
})
