import { createConnection, Connection } from 'typeorm'

export default async function(): Promise<Connection> {
  let connection = await createConnection({
    type: 'postgres',
    host: process.env.DATABASE_HOST as string,
    port: parseInt(process.env.DATABASE_PORT as string),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
    entities: ['src/database/models/**/*.ts'],
    migrations: ['src/database/migrations/**/*.ts'],
    subscribers: ['src/database/subscribers/**/*.ts'],
    synchronize: true,
    logging: false
  })
  return connection
}
