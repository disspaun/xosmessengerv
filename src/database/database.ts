import { typeORMDriver } from 'react-native-quick-sqlite'
import { DataSource } from 'typeorm'

import { Chat, Document, Message } from '@src/database/models'

export const dataSource = new DataSource({
  database: 'utopiatest-typeorm.db',
  entities: [Chat, Document, Message],
  location: '.',
  logging: [],
  synchronize: true,
  type: 'react-native',
  driver: typeORMDriver,
})
