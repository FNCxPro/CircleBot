import { CommandClient } from 'eris'

const client = new CommandClient(
  process.env.BOT_TOKEN as string,
  {},
  {
    description: 'Circle bot!',
    owner: 'relative',
    prefix: 'c!'
  }
)

export default client
