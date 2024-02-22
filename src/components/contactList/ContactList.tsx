import { useCallback } from 'react'
import { FlatList } from 'react-native'

import { ContactItem, IContactItem } from '@src/components/contactList/ContactItem'

import { useChatProvider } from '@src/providers/ChatProvider'

export const ContactList = () => {
  // TODO provide contacts here
  const { chats: contacts } = useChatProvider()
  const contactsSorted = [...contacts].sort((a, b) => a.name.localeCompare(b.name))
  const renderItem = useCallback(({ item }: IContactItem) => <ContactItem item={item} />, [])

  return <FlatList data={contactsSorted} renderItem={renderItem} />
}
