import { AddChatMessageInput, AddChatMessagesInput, Message, SetChatMessagesInput } from '../types'

import { isChatListEndNotViewing } from '@src/screens/ChatScreen'

export type ChatActions =
  | ({ type: 'SET_MESSAGES' } & SetChatMessagesInput)
  | ({ type: 'ADD_MESSAGE' } & AddChatMessageInput)
  | ({ type: 'ADD_MESSAGES' } & AddChatMessagesInput)

const shadowMessages: Record<string, Message[]> = {}

export const clearUpShadowOnes = (user: string) => {
  if (!shadowMessages[user]) {
    return
  }
  shadowMessages[user].length = 0
}

export const countShadowOnes = (user: string) => {
  if (!shadowMessages[user]) {
    return 0
  }

  return shadowMessages[user].length
}

export const chatReducer = (user: string) => {
  const _user = user
  return function (draft: Message[], action: ChatActions) {
    if (_user !== action.with) {
      return draft
    }
    switch (action.type) {
      case 'SET_MESSAGES': {
        draft = action.messages
        break
      }
      case 'ADD_MESSAGES': {
        draft.push(...action.messages)
        break
      }
      case 'ADD_MESSAGE': {
        if (
          !draft.find((item) => item.id === action.message?.id) &&
          !shadowMessages[user]?.find((item) => item.id === action.message?.id)
        ) {
          if (isChatListEndNotViewing(action.with) && !action.forceUpdate && action.message) {
            if (!shadowMessages[user]) {
              shadowMessages[user] = []
            }
            shadowMessages[user].unshift(action.message)
            return draft
          }
          if (shadowMessages[user]?.length) {
            draft.unshift(...shadowMessages[user])
            shadowMessages[user].length = 0
          }
          action.message && draft.unshift(action.message)
        }
        break
      }
    }

    return draft
  }
}
