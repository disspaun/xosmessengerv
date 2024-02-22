import { Dispatch, ReactNode, ReducerAction, createContext, useContext, useEffect } from 'react'
import { useImmerReducer } from 'use-immer'

import { ChatsActions, chatsReducer } from '@src/draft/reducers/chatsReducer'
import { Chat } from '@src/draft/types'

export interface IChatProvider {
  chats: Chat[]
}

export const ChatContext = createContext<IChatProvider>({
  chats: [],
})

export let dispatchChats: Dispatch<ReducerAction<typeof chatsReducer>> | null = null

export const ChatProvider = ({ children }: { children?: ReactNode }) => {
  const [chats, chatsDispatch] = useImmerReducer<Chat[], ChatsActions>(chatsReducer, [])

  useEffect(() => {
    dispatchChats = chatsDispatch
  }, [chatsDispatch])
  return <ChatContext.Provider value={{ chats }}>{children}</ChatContext.Provider>
}

export const useChatProvider = () => useContext(ChatContext)
