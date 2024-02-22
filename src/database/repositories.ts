import { dataSource } from '@src/database/database'
import { Chat, Document, Message } from '@src/database/models'

export const ChatRepository = dataSource.getRepository(Chat)
export const DocumentRepository = dataSource.getRepository(Document)
export const MessageRepository = dataSource.getRepository(Message)
