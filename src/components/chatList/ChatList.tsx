import { useCallback, useLayoutEffect } from 'react'
import { FlatList } from 'react-native'

import { ChatItem, IChatItem } from '@src/components/chatList/ChatItem'

import { populateChatTemp } from '@src/database/actions/Chat'
import { useChatProvider } from '@src/providers/ChatProvider'

export const ChatList = () => {
  useLayoutEffect(() => {
    void populateChatTemp()
  }, [])

  const { chats } = useChatProvider()
  const renderItem = useCallback(({ item }: IChatItem) => <ChatItem item={item} />, [])

  return <FlatList data={chats} renderItem={renderItem} />
}
