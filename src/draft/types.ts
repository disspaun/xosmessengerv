import { StatusUser } from '../../tm/Types'

export type Chat = {
  id: number
  name: string
  status: StatusUser
  avatar: string
  count: number
  lastMessageId: number
  from: string
}

export type Message = {
  id: number
  body: string
  timestamp: number
  from: string
  with: string
  sticker?: string
  documents?: Number[]
}

export type Document = {
  id: number
  name: string
  path: string
  mimeType: string
  width: number
  height: number
}

export interface AddChatInput {
  chat: Chat
}

export interface EditChatInput {
  chat: Chat
  isOutcoming?: boolean
}

export interface SetChatsInput {
  chats: Chat[]
}

export interface AddChatMessageInput {
  with: string
  message?: Message
  forceUpdate?: boolean
}

export interface AddChatMessagesInput {
  messages: Message[]
  with: string
}

export interface SetChatMessagesInput {
  messages: Message[]
  with: string
}
