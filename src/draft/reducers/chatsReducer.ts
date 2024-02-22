import { AddChatInput, Chat, EditChatInput, SetChatsInput } from '../types'

export type ChatsActions =
  | ({ type: 'ADD_CHAT' } & AddChatInput)
  | ({ type: 'UPDATE_CHAT' } & EditChatInput)
  | ({ type: 'SET_CHATS' } & SetChatsInput)

const sortDraftByLastMessageId = (draft: Chat[]) => {
  return draft.sort((a, b) => (Number(b.lastMessageId) || 0) - (Number(a.lastMessageId) || 0))
}

export function chatsReducer(draft: Chat[], action: ChatsActions) {
  switch (action.type) {
    case 'SET_CHATS': {
      draft = action.chats
      break
    }
    case 'ADD_CHAT': {
      draft.push(action.chat)
      break
    }
    case 'UPDATE_CHAT': {
      const currentChatIndex = draft.findIndex((item) => item.from === action.chat.from)
      if (currentChatIndex !== -1) {
        draft[currentChatIndex] = {
          ...action.chat,
          count: action.chat.count
            ? Number(draft[currentChatIndex].count) + (action.isOutcoming ? 0 : action.chat.count)
            : 0,
        }
      }

      break
    }
  }
  return sortDraftByLastMessageId(draft)
}
